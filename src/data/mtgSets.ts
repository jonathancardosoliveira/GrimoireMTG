export interface MtgSetOption {
  code: string;
  name: string;
}

export const MTG_SET_OPTIONS: MtgSetOption[] = [
  { code: 'HOB', name: 'The Hobbit' },
];

export const DEFAULT_MTG_SET = 'HOB';

export function getSetLabel(code: string): string {
  const normalized = code?.trim().toUpperCase();
  const match = MTG_SET_OPTIONS.find((set) => set.code === normalized);
  return match?.name ?? normalized ?? 'The Hobbit';
}
