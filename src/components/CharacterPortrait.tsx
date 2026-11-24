import React, { useId } from 'react';
import {
  COLOR_THEMES,
  EYE_COLOR_HEX,
  RACE_DATA,
  RARITY_CONFIG,
} from '../data/fantasyDatasets';
import { Character } from '../types/character';

interface CharacterPortraitProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg';
  svgRef?: React.Ref<SVGSVGElement>;
}

/**
 * Computes deterministic pseudo-random variation from portraitSeed
 * so "Regenerate Portrait" shifts runes, pose aura, hair tint, and sigil geometry.
 */
function seededFraction(seed: number, salt: number): number {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  character,
  size = 'lg',
  svgRef,
}) => {
  const uid = useId().replace(/:/g, '');
  const theme =
    COLOR_THEMES.find((t) => t.id === character.appearance.colorTheme) ??
    COLOR_THEMES[0];
  const raceMeta = RACE_DATA[character.race];
  const eyeHex = EYE_COLOR_HEX[character.appearance.eyeColor] ?? '#f59e0b';
  const rarityMeta = RARITY_CONFIG[character.rarity];

  const seed = character.portraitSeed;
  const sigilRotation = Math.round(seededFraction(seed, 1) * 45);
  const starShift = Math.round((seededFraction(seed, 2) - 0.5) * 16);
  const hairVariant = seededFraction(seed, 3);

  const hairColors = [
    '#27202b',
    '#4d3222',
    '#c8b496',
    '#8b352a',
    '#cbd5e1',
    '#2e3f47',
  ];
  const hairHex =
    hairColors[Math.floor(hairVariant * hairColors.length) % hairColors.length];

  const frameSizeClasses =
    size === 'sm'
      ? 'w-24 h-28'
      : size === 'md'
        ? 'w-44 h-52'
        : 'w-full max-w-[260px] aspect-[5/6]';

  const bgGradId = `bg-${uid}`;
  const auraGradId = `aura-${uid}`;
  const metalGradId = `metal-${uid}`;
  const wingGradId = `wing-${uid}`;
  const clipId = `clip-${uid}`;

  const isMasked =
    character.appearance.archetype === 'Masked Sentinel' ||
    character.appearance.archetype === 'Shadow Striker' ||
    character.characterClass === 'Assassin';

  const isHooded =
    character.appearance.hairStyle === 'Hooded Cloak' ||
    character.characterClass === 'Rogue';

  const isHornedHelm = character.appearance.hairStyle === 'Horned Helm';
  const isCirclet = character.appearance.hairStyle === 'Arcane Circlet';
  const isBraided = character.appearance.hairStyle === 'Braided Crown';
  const isShortHair = character.appearance.hairStyle === 'Short Crop';

  return (
    <div
      className={`relative mx-auto select-none ${frameSizeClasses} rounded-xl p-[3px] transition-all duration-200 ${rarityMeta.glowClass}`}
      style={{
        background: `linear-gradient(145deg, ${theme.primary}, ${theme.secondary}, ${theme.metal})`,
      }}
    >
      {/* Inner Dark Bezel */}
      <div className="relative h-full w-full overflow-hidden rounded-[9px] bg-[#0d0a17] border border-black/60">
        {!character.portraitGenerated ? (
          <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-[#171226] to-[#0c0914]">
            <svg
              viewBox="0 0 120 120"
              className="w-16 h-16 text-[#d4a853]/45 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="60" cy="60" r="44" strokeDasharray="4 4" />
              <polygon points="60,20 94,78 26,78" />
              <circle cx="60" cy="58" r="14" />
            </svg>
            <p className="font-display text-xs tracking-wider text-[#d4a853]/80">
              Portrait Unbound
            </p>
            <p className="mt-1 text-[11px] text-[#9b92a8]">
              Select Generate Portrait to illustrate
            </p>
          </div>
        ) : (
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 250 300"
            className="h-full w-full block"
            role="img"
            aria-label={`Fantasy portrait of ${character.name}, ${character.race} ${character.characterClass}`}
          >
            <defs>
              <linearGradient id={bgGradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.bgTop} />
                <stop offset="100%" stopColor={theme.bgBottom} />
              </linearGradient>

              <radialGradient id={auraGradId} cx="50%" cy="42%" r="48%">
                <stop offset="0%" stopColor={theme.primary} stopOpacity="0.48" />
                <stop offset="60%" stopColor={theme.secondary} stopOpacity="0.18" />
                <stop offset="100%" stopColor={theme.bgBottom} stopOpacity="0" />
              </radialGradient>

              <linearGradient id={metalGradId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={theme.accent} />
                <stop offset="50%" stopColor={theme.metal} />
                <stop offset="100%" stopColor={theme.secondary} />
              </linearGradient>

              <linearGradient id={wingGradId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={theme.accent} stopOpacity="0.72" />
                <stop offset="100%" stopColor={theme.primary} stopOpacity="0.22" />
              </linearGradient>

              <clipPath id={clipId}>
                <rect x="0" y="0" width="250" height="300" rx="8" />
              </clipPath>
            </defs>

            <g clipPath={`url(#${clipId})`}>
              {/* Backdrop */}
              <rect x="0" y="0" width="250" height="300" fill={`url(#${bgGradId})`} />
              <circle cx="125" cy="126" r="115" fill={`url(#${auraGradId})`} />

              {/* Decorative Arcane / Elemental Geometry */}
              <g
                transform={`translate(125 125) rotate(${sigilRotation})`}
                stroke={theme.primary}
                strokeOpacity="0.28"
                fill="none"
              >
                <circle r="84" strokeWidth="1.2" strokeDasharray="6 5" />
                <circle r="68" strokeWidth="0.9" />
                <polygon points="0,-78 68,40 -68,40" strokeWidth="0.9" />
                <polygon points="0,78 68,-40 -68,-40" strokeWidth="0.9" />
              </g>

              {/* Ambient Motes */}
              <g fill={theme.accent} fillOpacity="0.55">
                <circle cx={42 + starShift} cy="48" r="1.8" />
                <circle cx={205 - starShift} cy="62" r="2.1" />
                <circle cx={58 - starShift} cy="192" r="1.5" />
                <circle cx={196 + starShift} cy="184" r="1.7" />
              </g>

              {/* Racial Wings (Fairy) */}
              {character.race === 'Fairy' && (
                <g>
                  <path
                    d="M125 162 C78 108, 18 98, 24 148 C28 178, 72 190, 118 182 Z"
                    fill={`url(#${wingGradId})`}
                    stroke={theme.accent}
                    strokeWidth="1.3"
                  />
                  <path
                    d="M125 162 C172 108, 232 98, 226 148 C222 178, 178 190, 132 182 Z"
                    fill={`url(#${wingGradId})`}
                    stroke={theme.accent}
                    strokeWidth="1.3"
                  />
                  <path
                    d="M122 178 C84 185, 48 214, 58 242 C72 252, 102 224, 120 198 Z"
                    fill={`url(#${wingGradId})`}
                    stroke={theme.accent}
                    strokeWidth="1"
                  />
                  <path
                    d="M128 178 C166 185, 202 214, 192 242 C178 252, 148 224, 130 198 Z"
                    fill={`url(#${wingGradId})`}
                    stroke={theme.accent}
                    strokeWidth="1"
                  />
                </g>
              )}

              {/* Class Back Equipment & Weapons */}
              {character.characterClass === 'Warrior' && (
                <g transform="translate(182 42) rotate(22)">
                  <rect x="-5" y="0" width="10" height="125" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                  <line x1="0" y1="8" x2="0" y2="112" stroke="#64748b" strokeWidth="1.5" />
                  <rect x="-20" y="114" width="40" height="8" rx="3" fill={`url(#${metalGradId})`} />
                  <rect x="-4" y="122" width="8" height="26" fill="#452719" />
                  <circle cx="0" cy="151" r="6" fill={`url(#${metalGradId})`} />
                </g>
              )}

              {character.characterClass === 'Paladin' && (
                <g>
                  <circle
                    cx="125"
                    cy="112"
                    r="62"
                    fill="none"
                    stroke={theme.accent}
                    strokeWidth="2.5"
                    strokeOpacity="0.6"
                  />
                  <g stroke={theme.accent} strokeWidth="2" strokeOpacity="0.65">
                    <line x1="125" y1="36" x2="125" y2="48" />
                    <line x1="65" y1="68" x2="74" y2="76" />
                    <line x1="185" y1="68" x2="176" y2="76" />
                    <line x1="52" y1="112" x2="64" y2="112" />
                    <line x1="198" y1="112" x2="186" y2="112" />
                  </g>
                </g>
              )}

              {character.characterClass === 'Mage' && (
                <g>
                  <line x1="54" y1="74" x2="62" y2="292" stroke="#5b3b24" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="53" cy="64" r="15" fill="none" stroke={`url(#${metalGradId})`} strokeWidth="3" />
                  <circle cx="53" cy="64" r="8" fill={theme.accent} />
                  <circle cx="194" cy="96" r="11" fill={theme.primary} fillOpacity="0.85" stroke={theme.accent} strokeWidth="1.8" />
                  <ellipse cx="194" cy="96" rx="18" ry="6" fill="none" stroke={theme.accent} strokeWidth="1.2" transform="rotate(-18 194 96)" />
                </g>
              )}

              {character.characterClass === 'Ranger' && (
                <g>
                  <path
                    d="M174 48 C210 92, 212 184, 178 238"
                    fill="none"
                    stroke="#7c4a26"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <line x1="174" y1="48" x2="178" y2="238" stroke="#e2e8f0" strokeWidth="1.1" strokeOpacity="0.7" />
                  <rect x="64" y="88" width="16" height="58" rx="4" transform="rotate(-24 64 88)" fill="#5c3820" stroke={theme.metal} strokeWidth="1.2" />
                  <polygon points="56,74 64,66 68,78" fill={theme.accent} />
                  <polygon points="65,69 73,61 77,73" fill={theme.primary} />
                </g>
              )}

              {character.characterClass === 'Druid' && (
                <g>
                  <path
                    d="M84 96 C64 76, 56 54, 62 34 M62 66 C48 60, 42 48, 44 38 M66 52 C74 44, 76 34, 72 26"
                    fill="none"
                    stroke="#855a36"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M166 96 C186 76, 194 54, 188 34 M188 66 C202 60, 208 48, 206 38 M184 52 C176 44, 174 34, 178 26"
                    fill="none"
                    stroke="#855a36"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {character.characterClass === 'Necromancer' && (
                <g>
                  <line x1="196" y1="68" x2="188" y2="292" stroke="#2c2438" strokeWidth="5.5" />
                  <circle cx="196" cy="70" r="14" fill="#181224" stroke={theme.accent} strokeWidth="2" />
                  <circle cx="196" cy="70" r="6" fill={eyeHex} />
                  <path d="M46 112 Q56 88 66 112 T52 138 Z" fill={eyeHex} fillOpacity="0.45" />
                </g>
              )}

              {(character.characterClass === 'Rogue' || character.characterClass === 'Assassin') && (
                <g>
                  <path d="M52 178 L34 114 L64 166 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" />
                  <path d="M198 178 L216 114 L186 166 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1.2" />
                </g>
              )}

              {/* Cloak & Torso Base */}
              <path
                d="M34 300 L52 206 C64 176, 94 168, 125 168 C156 168, 186 176, 198 206 L216 300 Z"
                fill={theme.cloak}
                stroke={theme.metal}
                strokeWidth="1.6"
              />

              {/* Armor / Robe Class Detailing */}
              {(character.characterClass === 'Warrior' || character.characterClass === 'Paladin') && (
                <g>
                  {/* Heavy Pauldrons */}
                  <path
                    d="M46 218 C46 184, 72 172, 98 182 L88 232 Z"
                    fill={`url(#${metalGradId})`}
                    stroke="#1e1726"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M204 218 C204 184, 178 172, 152 182 L162 232 Z"
                    fill={`url(#${metalGradId})`}
                    stroke="#1e1726"
                    strokeWidth="1.5"
                  />
                  {/* Chestplate */}
                  <path
                    d="M84 190 L125 212 L166 190 L176 296 L74 296 Z"
                    fill="#262433"
                    stroke={theme.metal}
                    strokeWidth="2"
                  />
                  <polygon points="125,216 135,234 125,252 115,234" fill={theme.primary} />
                </g>
              )}

              {(character.characterClass === 'Mage' ||
                character.characterClass === 'Necromancer' ||
                character.characterClass === 'Druid') && (
                <g>
                  {/* High Arcane Collar */}
                  <path
                    d="M82 188 L68 148 L98 176 L125 198 L152 176 L182 148 L168 188 Z"
                    fill={theme.secondary}
                    stroke={theme.accent}
                    strokeWidth="1.5"
                  />
                  {/* Robe V-Trim & Sash */}
                  <path
                    d="M95 192 L125 268 L155 192"
                    fill="none"
                    stroke={theme.primary}
                    strokeWidth="3"
                  />
                  <circle cx="125" cy="222" r="9" fill={theme.bgBottom} stroke={theme.accent} strokeWidth="2" />
                  <circle cx="125" cy="222" r="4" fill={eyeHex} />
                </g>
              )}

              {(character.characterClass === 'Rogue' ||
                character.characterClass === 'Ranger' ||
                character.characterClass === 'Assassin') && (
                <g>
                  {/* Leather Bandolier & Scarf */}
                  <path
                    d="M84 184 L168 292"
                    stroke="#4b2f21"
                    strokeWidth="12"
                  />
                  <path
                    d="M84 184 L168 292"
                    stroke={theme.metal}
                    strokeWidth="1.5"
                    strokeDasharray="10 14"
                  />
                  <path
                    d="M88 176 Q125 204 162 176 L168 198 Q125 220 82 198 Z"
                    fill={theme.secondary}
                    stroke={theme.metal}
                    strokeWidth="1.2"
                  />
                </g>
              )}

              {/* Neck */}
              <rect x="111" y="148" width="28" height="32" rx="8" fill={raceMeta.skinShadow} />

              {/* Back Hair (for longer styles) */}
              {!isShortHair && !isHooded && (
                <path
                  d="M82 104 C74 134, 72 176, 84 196 L166 196 C178 176, 176 134, 168 104 Z"
                  fill={hairHex}
                />
              )}

              {/* Ears (Race specific) */}
              {raceMeta.earStyle === 'round' && (
                <g fill={raceMeta.skinShadow}>
                  <ellipse cx="88" cy="120" rx="6" ry="10" />
                  <ellipse cx="162" cy="120" rx="6" ry="10" />
                </g>
              )}
              {(raceMeta.earStyle === 'long-pointed' || raceMeta.earStyle === 'fairy') && (
                <g fill={raceMeta.skinTone} stroke={raceMeta.skinShadow} strokeWidth="1">
                  <path d="M90 116 L58 104 L88 128 Z" />
                  <path d="M160 116 L192 104 L162 128 Z" />
                </g>
              )}
              {raceMeta.earStyle === 'orc' && (
                <g fill={raceMeta.skinShadow}>
                  <path d="M88 118 L68 112 L88 128 Z" />
                  <path d="M162 118 L182 112 L162 128 Z" />
                </g>
              )}

              {/* Dragonborn Horns */}
              {character.race === 'Dragonborn' && (
                <g fill="#422820" stroke={theme.metal} strokeWidth="1.2">
                  <path d="M98 86 C86 64, 74 48, 62 42 C72 62, 78 78, 90 96 Z" />
                  <path d="M152 86 C164 64, 176 48, 188 42 C178 62, 172 78, 160 96 Z" />
                </g>
              )}

              {/* Head / Face */}
              <path
                d={
                  character.race === 'Dwarf' || character.race === 'Orc'
                    ? 'M90 100 C90 74, 160 74, 160 100 L160 132 C160 154, 144 164, 125 164 C106 164, 90 154, 90 132 Z'
                    : 'M92 98 C92 72, 158 72, 158 98 L156 128 C154 150, 138 164, 125 164 C112 164, 96 150, 94 128 Z'
                }
                fill={raceMeta.skinTone}
                stroke={raceMeta.skinShadow}
                strokeWidth="1.4"
              />

              {/* Dragonborn Scale Crest */}
              {character.race === 'Dragonborn' && (
                <g fill={raceMeta.skinShadow} opacity="0.65">
                  <polygon points="125,76 132,90 125,98 118,90" />
                  <polygon points="106,136 114,142 108,148" />
                  <polygon points="144,136 136,142 142,148" />
                </g>
              )}

              {/* Eyes */}
              <g>
                <ellipse cx="110" cy="116" rx="7.5" ry="4.5" fill="#130f1c" />
                <ellipse cx="140" cy="116" rx="7.5" ry="4.5" fill="#130f1c" />
                <circle cx="110" cy="116" r="3.4" fill={eyeHex} />
                <circle cx="140" cy="116" r="3.4" fill={eyeHex} />
                <circle cx="111" cy="115" r="1.2" fill="#ffffff" />
                <circle cx="141" cy="115" r="1.2" fill="#ffffff" />
                {/* Brows */}
                <path d="M100 108 Q110 104 119 109" fill="none" stroke="#291e24" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M150 108 Q140 104 131 109" fill="none" stroke="#291e24" strokeWidth="2.2" strokeLinecap="round" />
              </g>

              {/* Nose & Mouth */}
              <path d="M125 117 L123 132 L128 134" fill="none" stroke={raceMeta.skinShadow} strokeWidth="1.6" strokeLinecap="round" />
              <path d="M116 144 Q125 148 134 144" fill="none" stroke={raceMeta.skinShadow} strokeWidth="1.8" strokeLinecap="round" />

              {/* Orc Tusks */}
              {character.race === 'Orc' && (
                <g fill="#f5eedc" stroke="#9e8f75" strokeWidth="0.9">
                  <polygon points="113,146 116,136 120,145" />
                  <polygon points="130,145 134,136 137,146" />
                </g>
              )}

              {/* Dwarf Braided Beard Option (for Battle-Hardened or Dwarf) */}
              {character.race === 'Dwarf' && character.appearance.archetype !== 'Androgynous Noble' && (
                <path
                  d="M95 138 Q125 152 155 138 L146 184 L125 196 L104 184 Z"
                  fill={hairHex}
                  stroke="#1f1822"
                  strokeWidth="1.2"
                />
              )}

              {/* Half-Mask for Masked Sentinel / Assassin */}
              {isMasked && (
                <path
                  d="M93 124 Q125 132 157 124 L154 152 Q125 168 96 152 Z"
                  fill="#191526"
                  stroke={theme.metal}
                  strokeWidth="1.5"
                />
              )}

              {/* Front Hair / Headgear */}
              {!isHooded && !isHornedHelm && (
                <path
                  d={
                    isShortHair
                      ? 'M88 106 C90 72, 160 72, 162 106 C150 90, 100 90, 88 106 Z'
                      : 'M86 114 C86 68, 164 68, 164 114 C154 92, 136 86, 125 94 C114 86, 96 92, 86 114 Z'
                  }
                  fill={hairHex}
                />
              )}

              {isBraided && (
                <g fill={hairHex} stroke={theme.metal} strokeWidth="1">
                  <rect x="86" y="114" width="8" height="44" rx="4" />
                  <rect x="156" y="114" width="8" height="44" rx="4" />
                </g>
              )}

              {isCirclet && (
                <g>
                  <path d="M90 95 Q125 104 160 95" fill="none" stroke={`url(#${metalGradId})`} strokeWidth="3.5" />
                  <polygon points="125,84 131,94 125,104 119,94" fill={eyeHex} stroke={theme.accent} strokeWidth="1" />
                </g>
              )}

              {isHooded && (
                <path
                  d="M74 174 C70 96, 94 64, 125 64 C156 64, 180 96, 176 174 C168 124, 150 92, 125 92 C100 92, 82 124, 74 174 Z"
                  fill={theme.cloak}
                  stroke={theme.metal}
                  strokeWidth="1.8"
                />
              )}

              {isHornedHelm && (
                <g>
                  <path
                    d="M88 106 C88 68, 162 68, 162 106 L154 98 L125 112 L96 98 Z"
                    fill={`url(#${metalGradId})`}
                    stroke="#1c1524"
                    strokeWidth="1.5"
                  />
                  <path d="M90 88 C72 78, 66 56, 74 42 C78 58, 86 70, 98 76 Z" fill="#dfd5c2" stroke="#5b5043" strokeWidth="1" />
                  <path d="M160 88 C178 78, 184 56, 176 42 C172 58, 164 70, 152 76 Z" fill="#dfd5c2" stroke="#5b5043" strokeWidth="1" />
                </g>
              )}

              {/* Subtle Decorative Inner Corner Filigree */}
              <g stroke={theme.accent} strokeOpacity="0.6" strokeWidth="1.4" fill="none">
                <path d="M10 26 L10 10 L26 10" />
                <path d="M240 26 L240 10 L224 10" />
                <path d="M10 274 L10 290 L26 290" />
                <path d="M240 274 L240 290 L224 290" />
              </g>
            </g>
          </svg>
        )}
      </div>
    </div>
  );
};
