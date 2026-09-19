import { Deck } from '../types';

export function generateArenaDecklist(deck: Deck): string {
  const lines: string[] = ['Deck'];

  // Mainboard spells & creatures
  for (const entry of deck.mainboard) {
    const setCode = entry.card.setCode || 'HOB';
    const collNum = entry.card.collectorNumber || '1';
    lines.push(`${entry.count} ${entry.card.name} (${setCode}) ${collNum}`);
  }

  // Basic lands
  if (deck.basicLands.W > 0) lines.push(`${deck.basicLands.W} Plains (${deck.mainboard[0]?.card.setCode || 'HOB'}) 277`);
  if (deck.basicLands.U > 0) lines.push(`${deck.basicLands.U} Island (${deck.mainboard[0]?.card.setCode || 'HOB'}) 280`);
  if (deck.basicLands.B > 0) lines.push(`${deck.basicLands.B} Swamp (${deck.mainboard[0]?.card.setCode || 'HOB'}) 282`);
  if (deck.basicLands.R > 0) lines.push(`${deck.basicLands.R} Mountain (${deck.mainboard[0]?.card.setCode || 'HOB'}) 284`);
  if (deck.basicLands.G > 0) lines.push(`${deck.basicLands.G} Forest (${deck.mainboard[0]?.card.setCode || 'HOB'}) 286`);

  // Sideboard
  if (deck.sideboard.length > 0) {
    lines.push('');
    lines.push('Sideboard');
    for (const entry of deck.sideboard) {
      const setCode = entry.card.setCode || 'HOB';
      const collNum = entry.card.collectorNumber || '1';
      lines.push(`${entry.count} ${entry.card.name} (${setCode}) ${collNum}`);
    }
  }

  return lines.join('\n');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Falha ao copiar:', err);
    return false;
  }
}
