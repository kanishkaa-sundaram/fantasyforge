import React from 'react';
import {
  Crown,
  Flame,
  Gem,
  Shield,
  Sparkles,
  Swords,
} from 'lucide-react';
import { RARITY_CONFIG } from '../data/fantasyDatasets';
import { Character, Rarity } from '../types/character';
import { CharacterPortrait } from './CharacterPortrait';

interface PlayerCardProps {
  character: Character;
  portraitRef?: React.Ref<SVGSVGElement>;
  compact?: boolean;
}

const RARITY_ICON: Record<Rarity, React.ReactNode> = {
  Common: <Shield className="h-3.5 w-3.5" aria-hidden="true" />,
  Rare: <Gem className="h-3.5 w-3.5" aria-hidden="true" />,
  Epic: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />,
  Legendary: <Crown className="h-3.5 w-3.5" aria-hidden="true" />,
};

interface StatBarConfig {
  key: keyof Character['stats'];
  label: string;
  max: number;
  barColor: string;
}

const STAT_BARS: StatBarConfig[] = [
  { key: 'hp', label: 'Health (HP)', max: 999, barColor: 'bg-emerald-500' },
  { key: 'mp', label: 'Mana (MP)', max: 999, barColor: 'bg-violet-500' },
  { key: 'strength', label: 'Strength', max: 100, barColor: 'bg-[#d97757]' },
  { key: 'agility', label: 'Agility', max: 100, barColor: 'bg-sky-400' },
  { key: 'intelligence', label: 'Intelligence', max: 100, barColor: 'bg-purple-400' },
  { key: 'defense', label: 'Defense', max: 100, barColor: 'bg-[#d4a853]' },
];

export const PlayerCard: React.FC<PlayerCardProps> = ({
  character,
  portraitRef,
  compact = false,
}) => {
  const rarityMeta = RARITY_CONFIG[character.rarity];

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border-2 ${rarityMeta.borderColor} bg-gradient-to-b from-[#1a142b] via-[#130f21] to-[#0c0916] p-5 sm:p-6 transition-transform duration-200 ${rarityMeta.glowClass}`}
    >
      {/* Subtle Inner Trading-Card Hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 rounded-xl border border-[#d4a853]/18"
      />

      <div className="relative z-10 space-y-5">
        {/* Card Header: Engraved Rarity Crest & Level / Element */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d4a853]/18 pb-3.5">
          <div
            className={`inline-flex items-center gap-2 border border-current/25 ${rarityMeta.surfaceBg} px-3 py-1 rounded-md text-xs font-semibold tracking-wider uppercase ${rarityMeta.accentColor}`}
          >
            {RARITY_ICON[character.rarity]}
            <span>{rarityMeta.label}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#cfc7d9]">
            <span className="font-mono tabular-nums text-[#f0cb78]">
              Level {character.level}
            </span>
            <span aria-hidden="true" className="text-[#786f86]">
              ·
            </span>
            <span className="inline-flex items-center gap-1 text-[#dfd8ca]">
              <Flame className="h-3.5 w-3.5 text-[#d4a853]" aria-hidden="true" />
              {character.elementalAffinity}
            </span>
          </div>
        </div>

        {/* Character Name, Title & Class/Race */}
        <div>
          <h3 className="font-display text-2xl sm:text-[26px] font-bold tracking-wide text-[#f7f1e5] leading-tight">
            {character.name}
          </h3>
          <p className="mt-1 text-sm text-[#d4a853] font-medium">
            {character.title}
            <span aria-hidden="true" className="mx-2 text-[#736982]">
              ·
            </span>
            <span className="text-[#d6cfe0]">
              {character.race} {character.characterClass}
            </span>
          </p>
        </div>

        {/* Portrait + Statistics Split */}
        <div
          className={`grid gap-6 ${
            compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12 items-start'
          }`}
        >
          <div className={compact ? '' : 'md:col-span-5'}>
            <CharacterPortrait
              character={character}
              size={compact ? 'md' : 'lg'}
              svgRef={portraitRef}
            />
            <div className="mt-3 text-center text-xs text-[#a99fb6]">
              <span>{character.appearance.archetype}</span>
              <span aria-hidden="true" className="mx-1.5 text-[#6b6278]">
                ·
              </span>
              <span>{character.appearance.accessory}</span>
            </div>
          </div>

          <div className={compact ? '' : 'md:col-span-7 space-y-3'}>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
              <span className="inline-flex items-center gap-1.5">
                <Swords className="h-3.5 w-3.5" aria-hidden="true" />
                Combat & Arcane Attributes
              </span>
              <span className="font-mono tabular-nums text-[#a99fb6]">
                Power{' '}
                {character.stats.strength +
                  character.stats.agility +
                  character.stats.intelligence +
                  character.stats.defense}
              </span>
            </div>

            <div className="space-y-2.5 rounded-xl border border-[#d4a853]/15 bg-[#0e0a19]/75 p-4">
              {STAT_BARS.map((bar) => {
                const value = character.stats[bar.key];
                const pct = Math.max(6, Math.min(100, Math.round((value / bar.max) * 100)));

                return (
                  <div key={bar.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#cfc7da] font-medium">{bar.label}</span>
                      <span className="font-mono tabular-nums font-semibold text-[#f7f1e5]">
                        {value}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
                      <div
                        className={`h-full rounded-full ${bar.barColor} transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Parchment Backstory Chronicle */}
        <section
          aria-label="Character Backstory"
          className="parchment-surface rounded-xl border border-[#8a5d2a]/40 p-4 sm:p-5"
        >
          <div className="flex items-center justify-between border-b border-[#7a5022]/25 pb-2 mb-3">
            <h4 className="font-display text-sm font-bold tracking-wider text-[#4e2f12] uppercase">
              Character Chronicle
            </h4>
            <span className="text-[11px] font-medium text-[#6e4720]">
              {character.race} · {character.characterClass}
            </span>
          </div>

          {character.backstory ? (
            <div className="space-y-2.5 text-[14px] leading-relaxed text-[#2b1e12]">
              <p>{character.backstory.fullText}</p>
              {!compact && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-[#7a5022]/20 text-xs">
                  <div>
                    <dt className="font-semibold text-[#5a3717]">Origin</dt>
                    <dd className="text-[#382717] mt-0.5">{character.backstory.origin}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#5a3717]">Personal Mission</dt>
                    <dd className="text-[#382717] mt-0.5">{character.backstory.mission}</dd>
                  </div>
                </dl>
              )}
            </div>
          ) : (
            <p className="text-sm italic text-[#5e4326]">
              No backstory has been forged for this character yet. Click Generate Backstory to inscribe their origin, abilities, and personal mission.
            </p>
          )}
        </section>
      </div>
    </article>
  );
};
