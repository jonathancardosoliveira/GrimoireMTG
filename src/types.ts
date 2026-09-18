export type ManaColor = 'W' | 'U' | 'B' | 'R' | 'G' | 'C';

export type CardRarity = 'mythic' | 'rare' | 'uncommon' | 'common';

export type CardType = 
  | 'Criatura'
  | 'Feitiço'
  | 'Instantânea'
  | 'Encantamento'
  | 'Artefato'
  | 'Terreno'
  | 'Planeswalker';

export interface Card {
  id: string;
  name: string;
  manaCost: string;
  cmc: number;
  colors: ManaColor[];
  type: CardType;
  subtype?: string;
  rarity: CardRarity;
  power?: number | string;
  toughness?: number | string;
  oracleText: string;
  tags: string[];
  roleBadge?: string;
  setCode: string;
  collectorNumber?: string;
  imageUrl?: string;
}

export interface PoolCardEntry {
  card: Card;
  count: number;
}

export type PoolStatus = 'rascunho' | 'confirmado' | 'deck_pronto';

export interface SealedPool {
  id: string;
  code: string; // e.g. "#0094-ARC"
  title: string;
  setCode: string; // "BLB", "DSK"
  setName: string;
  status: PoolStatus;
  cards: Record<string, number>; // cardId -> count
  totalCount: number; // target 84
  score?: number;
  recommendedColors?: string;
  colorCodes?: ManaColor[];
  synergyArchetype?: string;
  tier?: string;
  keyRares?: string[];
  deckId?: string;
  createdAt: string;
}

export interface DeckCardEntry {
  card: Card;
  count: number;
}

export interface DeckExegesis {
  score: number;
  motor: string; // "Genético + Heurística"
  convergence: string; // "240 Gerações"
  calcTime: string; // "1.8s (84 Cartas)"
  colorPair: {
    name: string;
    synergy: number;
    reasoning: string;
    alternatives: {
      label: string;
      viability: number;
      color: string;
    }[];
    evasionTip: string;
  };
  militaryCore: {
    title: string;
    summary: string;
    anchorCards: {
      cardId: string;
      badge: string;
      desc: string;
    }[];
  };
  curveArch: {
    title: string;
    summary: string;
    avgCmc: number;
    creatureCount: number;
    spellCount: number;
  };
  manaBase: {
    title: string;
    summary: string;
    lands: {
      color: ManaColor;
      name: string;
      count: number;
      pips: number;
    }[];
    notes: string;
  };
  secretCombo?: {
    title: string;
    desc: string;
    cardId: string;
  };
  codexQuote: string;
}

export interface Deck {
  id: string;
  poolId: string;
  title: string;
  archetype: string;
  colors: ManaColor[];
  score: number;
  mainboard: DeckCardEntry[];
  sideboard: DeckCardEntry[];
  basicLands: {
    W: number;
    U: number;
    B: number;
    R: number;
    G: number;
  };
  exegesis: DeckExegesis;
}

export type ViewTab = 'compendio' | 'registrar' | 'deck_ativo' | 'ajustes' | 'sets' | 'ia_lab';

export type ViewportMode = 'responsive' | 'mobile_frame' | 'desktop_frame';
