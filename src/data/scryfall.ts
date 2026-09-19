import { Card, CardRarity, CardType, ManaColor } from '../types';
import { CARD_DATABASE } from './cards';
import { getSetLabel } from './mtgSets';

type ScryfallCard = {
  id: string;
  name: string;
  mana_cost?: string;
  cmc?: number;
  colors?: string[];
  type_line?: string;
  oracle_text?: string;
  rarity?: string;
  power?: string | null;
  toughness?: string | null;
  collector_number?: string;
  set?: string;
  set_name?: string;
  image_uris?: {
    art_crop?: string;
    normal?: string;
    small?: string;
  };
  card_faces?: Array<{
    name?: string;
    type_line?: string;
    oracle_text?: string;
    image_uris?: {
      art_crop?: string;
      normal?: string;
      small?: string;
    };
  }>;
};

type ScryfallSearchResponse = {
  data?: ScryfallCard[];
  has_more?: boolean;
  next_page?: string;
};

type ScryfallSet = {
  code?: string;
  name?: string;
};

const normalizeColor = (color: string): ManaColor => {
  switch (color) {
    case 'W':
      return 'W';
    case 'U':
      return 'U';
    case 'B':
      return 'B';
    case 'R':
      return 'R';
    case 'G':
      return 'G';
    default:
      return 'C';
  }
};

const normalizeRarity = (rarity?: string): CardRarity => {
  switch (rarity) {
    case 'mythic':
      return 'mythic';
    case 'rare':
      return 'rare';
    case 'uncommon':
      return 'uncommon';
    default:
      return 'common';
  }
};

const normalizeType = (typeLine?: string): CardType => {
  const value = typeLine?.toLowerCase() ?? '';

  if (value.includes('creature')) return 'Criatura';
  if (value.includes('instant')) return 'Instantânea';
  if (value.includes('sorcery')) return 'Feitiço';
  if (value.includes('enchantment')) return 'Encantamento';
  if (value.includes('artifact')) return 'Artefato';
  if (value.includes('land')) return 'Terreno';
  if (value.includes('planeswalker')) return 'Planeswalker';

  return 'Artefato';
};

const mapScryfallCard = (card: ScryfallCard): Card => {
  const primaryFace = card.card_faces?.[0];
  const faceImage = primaryFace?.image_uris;
  const imageUrl = card.image_uris?.art_crop ?? faceImage?.art_crop ?? card.image_uris?.normal ?? faceImage?.normal;

  const typeLine = card.type_line ?? primaryFace?.type_line ?? 'Artifact';

  return {
    id: card.id,
    name: card.name,
    manaCost: card.mana_cost ?? '',
    cmc: card.cmc ?? 0,
    colors: (card.colors ?? []).map((color) => normalizeColor(color)),
    type: normalizeType(typeLine),
    subtype: undefined,
    rarity: normalizeRarity(card.rarity),
    power: card.power ?? undefined,
    toughness: card.toughness ?? undefined,
    oracleText: card.oracle_text ?? primaryFace?.oracle_text ?? '',
    tags: [
      `Raridade: ${normalizeRarity(card.rarity)}`,
      ...(card.type_line ? [card.type_line] : []),
    ],
    roleBadge: normalizeRarity(card.rarity) === 'mythic' ? 'BOMBA MÍTICA' : undefined,
    setCode: (card.set ?? '').toUpperCase(),
    collectorNumber: card.collector_number,
    imageUrl,
  };
};

export async function fetchSetMetadata(setCode: string): Promise<{ code: string; name: string }> {
  const normalizedSet = setCode.trim().toUpperCase();

  if (!normalizedSet) {
    return { code: 'HOB', name: getSetLabel('HOB') };
  }

  try {
    const response = await fetch(`https://api.scryfall.com/sets/${encodeURIComponent(normalizedSet)}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return { code: normalizedSet, name: getSetLabel(normalizedSet) };
    }

    const payload = (await response.json()) as ScryfallSet;
    return {
      code: payload.code?.toUpperCase() ?? normalizedSet,
      name: payload.name ?? getSetLabel(normalizedSet),
    };
  } catch {
    return { code: normalizedSet, name: getSetLabel(normalizedSet) };
  }
}

export async function fetchRealCardsForSet(setCode: string): Promise<Card[]> {
  const normalizedSet = setCode.trim().toUpperCase();

  if (!normalizedSet) {
    return CARD_DATABASE;
  }

  const baseUrl = `https://api.scryfall.com/cards/search?order=set&unique=prints&q=set:${normalizedSet}`;
  let nextUrl: string | null = baseUrl;
  const cards: Card[] = [];

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Scryfall request failed (${response.status})`);
    }

    const payload = (await response.json()) as ScryfallSearchResponse;
    const data = payload.data ?? [];

    for (const card of data) {
      if (card?.name) {
        cards.push(mapScryfallCard(card));
      }
    }

    if (!payload.has_more || !payload.next_page) {
      break;
    }

    nextUrl = payload.next_page;
  }

  if (cards.length === 0) {
    throw new Error(`Scryfall não encontrou a edição ${normalizedSet}`);
  }

  return cards;
}
