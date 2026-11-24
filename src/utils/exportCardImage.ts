import { COLOR_THEMES, RARITY_CONFIG } from '../data/fantasyDatasets';
import { Character } from '../types/character';

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const testLine = current ? `${current} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      current = testLine;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === maxLines && words.length > 0) {
    const joined = lines.join(' ');
    if (joined.length < text.length - 4) {
      lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.,;:\s]+$/, '')}...`;
    }
  }

  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

async function svgElementToImage(svgEl: SVGSVGElement): Promise<HTMLImageElement> {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Renders a complete high-resolution trading card PNG using Canvas 2D
 * and triggers a local browser file download.
 */
export async function downloadCharacterCardPng(
  character: Character,
  portraitSvgElement: SVGSVGElement | null
): Promise<boolean> {
  const width = 920;
  const height = 1280;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  const theme =
    COLOR_THEMES.find((t) => t.id === character.appearance.colorTheme) ??
    COLOR_THEMES[0];

  const rarityAccentMap = {
    Common: '#94a3b8',
    Rare: '#10b981',
    Epic: '#a78bfa',
    Legendary: '#d4a853',
  };
  const borderAccent = rarityAccentMap[RARITY_CONFIG[character.rarity].label];

  // Outer card background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#181229');
  bgGrad.addColorStop(0.5, '#110d1f');
  bgGrad.addColorStop(1, '#090712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Ornate border frame
  drawRoundedRect(ctx, 22, 22, width - 44, height - 44, 24);
  ctx.strokeStyle = borderAccent;
  ctx.lineWidth = 5;
  ctx.stroke();

  drawRoundedRect(ctx, 36, 36, width - 72, height - 72, 18);
  ctx.strokeStyle = 'rgba(212, 168, 83, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Header metadata row
  ctx.fillStyle = borderAccent;
  ctx.font = '600 20px "Cinzel", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(character.rarity.toUpperCase(), 64, 86);

  ctx.fillStyle = '#e5dccb';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`LVL ${character.level}  ·  ${character.elementalAffinity}`, width - 64, 86);

  // Character Name & Title
  ctx.textAlign = 'left';
  ctx.fillStyle = '#f8f3ea';
  ctx.font = '700 42px "Cinzel", Georgia, serif';
  ctx.fillText(character.name, 64, 140);

  ctx.fillStyle = '#d4a853';
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `${character.title}  ·  ${character.race} ${character.characterClass}`,
    64,
    176
  );

  // Portrait Box (Left)
  const portX = 64;
  const portY = 212;
  const portW = 340;
  const portH = 408;

  drawRoundedRect(ctx, portX - 4, portY - 4, portW + 8, portH + 8, 16);
  ctx.fillStyle = theme.primary;
  ctx.fill();

  drawRoundedRect(ctx, portX, portY, portW, portH, 12);
  ctx.fillStyle = '#0d0a17';
  ctx.fill();

  if (portraitSvgElement && character.portraitGenerated) {
    try {
      const img = await svgElementToImage(portraitSvgElement);
      ctx.save();
      drawRoundedRect(ctx, portX, portY, portW, portH, 12);
      ctx.clip();
      ctx.drawImage(img, portX, portY, portW, portH);
      ctx.restore();
    } catch {
      // Continue cleanly if SVG rasterization is blocked
    }
  } else {
    ctx.fillStyle = '#9b92a8';
    ctx.font = '500 20px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Portrait Unbound', portX + portW / 2, portY + portH / 2);
  }

  // Stats Panel (Right)
  const statsX = 440;
  const statsY = 216;
  const statsW = 416;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#d4a853';
  ctx.font = '600 19px "Cinzel", Georgia, serif';
  ctx.fillText('CHARACTER ATTRIBUTES', statsX, statsY + 20);

  const statRows = [
    { label: 'Health (HP)', value: character.stats.hp, max: 999, color: '#10b981' },
    { label: 'Mana (MP)', value: character.stats.mp, max: 999, color: '#8b5cf6' },
    { label: 'Strength', value: character.stats.strength, max: 100, color: '#e07a5f' },
    { label: 'Agility', value: character.stats.agility, max: 100, color: '#38bdf8' },
    { label: 'Intelligence', value: character.stats.intelligence, max: 100, color: '#c084fc' },
    { label: 'Defense', value: character.stats.defense, max: 100, color: '#d4a853' },
  ];

  statRows.forEach((row, index) => {
    const rowY = statsY + 62 + index * 58;
    ctx.fillStyle = '#dfd8ca';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(row.label, statsX, rowY);

    ctx.fillStyle = '#f8f3ea';
    ctx.font = '600 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(String(row.value), statsX + statsW, rowY);

    // Track
    drawRoundedRect(ctx, statsX, rowY + 12, statsW, 12, 6);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    // Fill
    const ratio = Math.max(0.06, Math.min(1, row.value / row.max));
    drawRoundedRect(ctx, statsX, rowY + 12, statsW * ratio, 12, 6);
    ctx.fillStyle = row.color;
    ctx.fill();
  });

  // Appearance Summary Strip
  const traitY = 660;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#a79db5';
  ctx.font = '500 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `${character.appearance.archetype}  ·  ${character.appearance.hairStyle}  ·  ${character.appearance.accessory}`,
    64,
    traitY
  );

  // Parchment Backstory Box
  const parchX = 64;
  const parchY = 696;
  const parchW = width - 128;
  const parchH = 474;

  const parchGrad = ctx.createLinearGradient(parchX, parchY, parchX + parchW, parchY + parchH);
  parchGrad.addColorStop(0, '#f4ebd4');
  parchGrad.addColorStop(1, '#e0ca9f');
  drawRoundedRect(ctx, parchX, parchY, parchW, parchH, 14);
  ctx.fillStyle = parchGrad;
  ctx.fill();

  drawRoundedRect(ctx, parchX + 10, parchY + 10, parchW - 20, parchH - 20, 10);
  ctx.strokeStyle = 'rgba(115, 76, 30, 0.32)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#5d3917';
  ctx.font = '700 21px "Cinzel", Georgia, serif';
  ctx.fillText('CHRONICLE & ORIGIN', parchX + 34, parchY + 52);

  const storyText =
    character.backstory?.fullText ??
    'No chronicle has been inscribed for this character yet. Generate a backstory in FantasyForge to record their origin and mission.';

  ctx.fillStyle = '#291d12';
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  const lines = wrapTextLines(ctx, storyText, parchW - 68, 12);
  lines.forEach((line, idx) => {
    ctx.fillText(line, parchX + 34, parchY + 96 + idx * 30);
  });

  // Footer Brand
  ctx.fillStyle = '#8b7f99';
  ctx.font = '600 16px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('FANTASYFORGE COLLECTOR EDITION', width / 2, height - 56);

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const safeName = character.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  link.download = `${safeName || 'fantasy-character'}-card.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
}
