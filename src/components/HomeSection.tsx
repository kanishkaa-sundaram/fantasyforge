import React from 'react';
import { ArrowRight, BookOpen, Layers, Shield, Sparkles } from 'lucide-react';
import { AppSection, Character } from '../types/character';
import { CharacterPortrait } from './CharacterPortrait';

interface HomeSectionProps {
  sampleCharacter: Character;
  deckCount: number;
  onNavigate: (section: AppSection) => void;
  onGenerateNewSample: () => void;
  onForgeFromSample: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  sampleCharacter,
  deckCount,
  onNavigate,
  onGenerateNewSample,
  onForgeFromSample,
}) => {
  return (
    <div className="space-y-16">
      {/* Hero Split */}
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
            Offline RPG Character Studio
          </p>

          <h1
            className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#f8f3ea] leading-[1.12]"
            style={{ textWrap: 'balance' }}
          >
            Forge Legend-Grade Fantasy Heroes in Seconds
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-[#c9c1d3]">
            FantasyForge is a self-contained character creation studio for tabletop RPG players,
            worldbuilders, and card collectors. Generate complete heroes with class-balanced
            attributes, custom SVG portraits, parchment backstories, and collectible player cards
            saved directly in your browser.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4a853] px-5 py-3 text-sm font-semibold text-[#130d1d] shadow-md hover:bg-[#e5be6c] active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Open Character Forge
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('deck')}
              className="inline-flex items-center gap-2 rounded-lg border border-[#d4a853]/35 bg-[#161124] px-5 py-3 text-sm font-medium text-[#ede7dc] hover:border-[#d4a853]/70 hover:bg-[#1e1732] transition-colors whitespace-nowrap shrink-0"
            >
              <Layers className="h-4 w-4 text-[#d4a853]" aria-hidden="true" />
              View My Deck ({deckCount})
            </button>
          </div>

          {/* Clean unboxed summary metrics */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[#d4a853]/18 pt-6">
            <div>
              <dt className="text-xs text-[#9b92a8]">Hero Classes</dt>
              <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-[#f4e6c8]">8</dd>
            </div>
            <div>
              <dt className="text-xs text-[#9b92a8]">Fantasy Races</dt>
              <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-[#f4e6c8]">6</dd>
            </div>
            <div>
              <dt className="text-xs text-[#9b92a8]">Rarity Tiers</dt>
              <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-[#f4e6c8]">4</dd>
            </div>
            <div>
              <dt className="text-xs text-[#9b92a8]">Saved in Deck</dt>
              <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-emerald-400">
                {deckCount}
              </dd>
            </div>
          </dl>
        </div>

        {/* Live Interactive Showcase Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-[#d4a853]/30 bg-gradient-to-b from-[#1a142c] to-[#100c1b] p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d4a853]/18 pb-3 mb-4 text-xs">
              <span className="font-semibold uppercase tracking-wider text-[#d4a853]">
                {sampleCharacter.rarity} Showcase
              </span>
              <span className="font-mono tabular-nums text-[#cfc7d9]">
                Level {sampleCharacter.level} · {sampleCharacter.elementalAffinity}
              </span>
            </div>

            <CharacterPortrait character={sampleCharacter} size="md" />

            <div className="mt-4 text-center">
              <h2 className="font-display text-xl font-bold text-[#f7f1e5]">
                {sampleCharacter.name}
              </h2>
              <p className="mt-0.5 text-sm text-[#d4a853]">
                {sampleCharacter.title} · {sampleCharacter.race} {sampleCharacter.characterClass}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-[#d4a853]/15 bg-[#0d0a17]/80 p-3 text-center">
              <div>
                <p className="text-[11px] text-[#9b92a8]">HP</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-emerald-400">
                  {sampleCharacter.stats.hp}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#9b92a8]">MP</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-violet-300">
                  {sampleCharacter.stats.mp}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#9b92a8]">STR / INT</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-[#f0cb78]">
                  {sampleCharacter.stats.strength}/{sampleCharacter.stats.intelligence}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onGenerateNewSample}
                className="flex-1 rounded-lg border border-[#d4a853]/35 bg-[#1b152d] px-3 py-2 text-xs font-medium text-[#ede7dc] hover:bg-[#251d3d] transition-colors whitespace-nowrap"
              >
                Preview Another
              </button>
              <button
                type="button"
                onClick={onForgeFromSample}
                className="flex-1 rounded-lg bg-[#d4a853]/18 border border-[#d4a853]/45 px-3 py-2 text-xs font-semibold text-[#f3d48a] hover:bg-[#d4a853]/28 transition-colors whitespace-nowrap"
              >
                Customize This Hero
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="border-t border-[#d4a853]/18 pt-12">
        <div className="max-w-2xl mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#f7f1e5]">
            Crafted for Collectors & Storytellers
          </h2>
          <p className="mt-2 text-sm text-[#b9b0c5]">
            Every illustration, stat block, and parchment chronicle is synthesized locally with
            zero external dependencies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[#d4a853]/20 bg-[#151023] p-6">
            <Sparkles className="h-5 w-5 text-[#d4a853] mb-3" aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold text-[#f4e6c8]">
              Procedural SVG Portraits
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#bdb5c9]">
              Portraits adapt dynamically to race anatomy, class armaments, gender-neutral hair and
              mask options, and six curated color palettes.
            </p>
          </div>

          <div className="rounded-xl border border-[#d4a853]/20 bg-[#151023] p-6">
            <BookOpen className="h-5 w-5 text-emerald-400 mb-3" aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold text-[#f4e6c8]">
              Parchment Chronicles
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#bdb5c9]">
              Generate structured backstories covering homeland origin, early training, elemental
              mastery, turning points, and personal quests.
            </p>
          </div>

          <div className="rounded-xl border border-[#d4a853]/20 bg-[#151023] p-6">
            <Shield className="h-5 w-5 text-violet-400 mb-3" aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold text-[#f4e6c8]">
              Persistent Trading Deck
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#bdb5c9]">
              Save unique heroes to browser storage, search and filter by class, sort by level or
              rarity, and export high-resolution PNG cards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
