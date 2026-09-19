import { Deck, SealedPool } from '../types';
import { CARD_DATABASE } from './cards';

export const INITIAL_POOLS: SealedPool[] = [
  {
    id: 'pool-hob-01',
    code: '#0094-ARC',
    title: 'Pré-release The Hobbit',
    setCode: 'HOB',
    setName: 'The Hobbit [HOB]',
    status: 'confirmado',
    totalCount: 84,
    score: 88.4,
    recommendedColors: 'Selesnya (Verde / Branco)',
    colorCodes: ['G', 'W'],
    synergyArchetype: 'Sinergia de Explosão / Fractura',
    tier: 'Tier A+',
    keyRares: ['Apex Rift', 'Nullglass Warden'],
    deckId: 'deck-hob-01',
    createdAt: '2026-09-17T20:15:00Z',
    cards: {
      'blb-zoraline': 1,
      'blb-essence-channeler': 1,
      'blb-starseer-mentor': 2,
      'blb-lifecreed-duo': 3,
      'blb-glidedive-duo': 2,
      'blb-banishing-light': 2,
      'blb-fell': 2,
      'blb-moonrise-cleric': 2,
      'blb-starlit-sentry': 3,
      'blb-thornplate-intimidator': 2,
      'blb-caretakers-talent': 1,
      'blb-agate-blade-assassin': 2,
      'blb-crumb-and-get-it': 2,
      'blb-downpour-drop': 2,
      'blb-dazzling-denial': 1,
      'blb-ygra': 1,
      'blb-maha': 1,
    }
  },
  {
    id: 'pool-hob-02',
    code: '#0091-EXP',
    title: 'Treino Sealed The Hobbit #03',
    setCode: 'HOB',
    setName: 'The Hobbit [HOB]',
    status: 'confirmado',
    totalCount: 84,
    score: 81.2,
    recommendedColors: 'Dimir (Azul / Preto)',
    colorCodes: ['U', 'B'],
    synergyArchetype: 'Controle & Fractura Temporal',
    tier: 'Tier B+',
    keyRares: ['Apex Rift', 'Nullglass Warden'],
    deckId: 'deck-hob-01',
    createdAt: '2026-09-16T18:00:00Z',
    cards: {
      'blb-zoraline': 1,
      'blb-fell': 2,
      'blb-glidedive-duo': 2,
      'blb-thornplate-intimidator': 2,
      'blb-dazzling-denial': 2,
    }
  }
];

export const INITIAL_DECK: Deck = {
  id: 'deck-hob-01',
  poolId: 'pool-hob-01',
  title: 'The Hobbit Evasão & Controle',
  archetype: 'Fractura & Ganho de Vida',
  colors: ['W', 'B'],
  score: 89.4,
  mainboard: [
    { card: CARD_DATABASE.find(c => c.id === 'blb-zoraline')!, count: 1 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-essence-channeler')!, count: 1 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-starseer-mentor')!, count: 2 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-lifecreed-duo')!, count: 3 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-glidedive-duo')!, count: 2 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-moonrise-cleric')!, count: 2 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-starlit-sentry')!, count: 3 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-thornplate-intimidator')!, count: 2 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-banishing-light')!, count: 2 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-fell')!, count: 2 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-caretakers-talent')!, count: 1 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-downpour-drop')!, count: 1 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-crumb-and-get-it')!, count: 1 },
  ],
  sideboard: [
    { card: CARD_DATABASE.find(c => c.id === 'blb-agate-blade-assassin')!, count: 2 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-dazzling-denial')!, count: 2 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-ygra')!, count: 1 },
    { card: CARD_DATABASE.find(c => c.id === 'blb-maha')!, count: 1 },
  ],
  basicLands: {
    W: 9,
    U: 0,
    B: 8,
    R: 0,
    G: 0,
  },
  exegesis: {
    score: 89.4,
    motor: 'Genético + Especialista',
    convergence: '240 Gerações',
    calcTime: '1.8s (84 Cartas)',
    colorPair: {
      name: 'Orzhov (Branco & Preto)',
      synergy: 92,
      reasoning: 'O motor de otimização genética identificou que sua pool de Bloomburrow concentra sua maior densidade de valor e evasão nas cores Orzhov (Branco/Preto). Foram detectadas 7 criaturas com evasão natural (Voar) somadas ao arquétipo simbiótico de Morcegos, que convertem perda e ganho de vida por turno em marcadores cumulativos permanentes.',
      alternatives: [
        { label: 'Branco & Preto (WB Morcegos)', viability: 92, color: '#c2a264' },
        { label: 'Verde & Vermelho (RG Gastrópodes)', viability: 51, color: '#7a7365' },
        { label: 'Azul & Branco (WU Pássaros)', viability: 39, color: '#4d463a' },
      ],
      evasionTip: 'Evasão Dominante: 7 criaturas com Voar garantem letalidade em Bloomburrow, neutralizando os bloqueadores terrestres verdes e esquilos adversários.',
    },
    militaryCore: {
      title: 'Âncoras Míticas & Tríade de Remoção',
      summary: 'A recomendação orbita na proteção de ameaças singulares com auto-sustentação e na capacidade incondicional de neutralizar bombas adversárias.',
      anchorCards: [
        {
          cardId: 'blb-zoraline',
          badge: 'ÂNCORA MÍTICA CENTRAL',
          desc: 'Reanimação perpétua de permanentes de CMC ≤ 3 com marcadores de fatalidade e ganho de vida recorrente.',
        },
        {
          cardId: 'blb-fell',
          badge: 'REMOÇÃO 2 CMC',
          desc: 'Remoção pontual incondicional a custo 2 de criatura no ritmo ideal de Selado.',
        },
        {
          cardId: 'blb-banishing-light',
          badge: 'EXÍLIO UNIVERSAL',
          desc: 'Resposta universal contra bombas, planeswalkers ou artefatos do formato.',
        }
      ]
    },
    curveArch: {
      title: 'Ajuste de Velocidade Bloomburrow',
      summary: 'Em Bloomburrow Selado, 68% dos reveses derivam da inação nos turnos 1 e 2. O otimizador priorizou a consolidação agressiva da faixa de CMC 2 com 8 mágicas para estabilizar o early game e preparar o pico de evasão nos turnos 4 e 5.',
      avgCmc: 2.74,
      creatureCount: 16,
      spellCount: 7,
    },
    manaBase: {
      title: '9 Planícies & 8 Pântanos (17 Totais)',
      summary: 'Ponderação hipergeométrica calculada para mitigar o risco de mana screw e garantir conjuração de mágicas com duas fontes da mesma cor no turno 4 com 91.4% de probabilidade.',
      lands: [
        { color: 'W', name: 'Planícies', count: 9, pips: 13 },
        { color: 'B', name: 'Pântanos', count: 8, pips: 11 },
      ],
      notes: 'Zero terrenos incolores mantêm estabilidade máxima sem atraso de tempo.',
    },
    secretCombo: {
      title: 'Segredo do Pareamento',
      desc: 'Zoraline reanima qualquer mágica de custo 3 ou menor: Permite reciclar o Banishing Light destruído ou trazer o Lifecreed Duo para bloquear no turno 4.',
      cardId: 'blb-zoraline'
    },
    codexQuote: '« CODEX REGULA V » — "Nas terras do vale, a vitória pertence àquele que governa a penumbra sem abandonar a luz dos céus."'
  }
};
