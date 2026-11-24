import React from 'react';
import { CLASS_DATA, FANTASY_RACES, RARITY_CONFIG } from '../data/fantasyDatasets';
import { AppSection, Rarity } from '../types/character';

interface AboutSectionProps {
  onNavigate: (section: AppSection) => void;
}

const RARITY_ORDER: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary'];

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
          About FantasyForge
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#f8f3ea]">
          A Complete Character Forge Built for Local Play
        </h1>
        <p className="text-base leading-relaxed text-[#c9c1d3]">
          FantasyForge operates entirely inside your browser using deterministic stat weighting,
          curated fantasy lore templates, and layered SVG vector illustration. No external servers,
          accounts, or API keys are required—your saved deck remains stored privately on your
          device via localStorage.
        </p>
      </div>

      {/* Class Archetypes Reference */}
      <section className="space-y-5 border-t border-[#d4a853]/18 pt-8">
        <h2 className="font-display text-2xl font-bold text-[#f4e6c8]">
          Eight Playable Classes
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(CLASS_DATA).map((cls) => (
            <div
              key={cls.name}
              className="rounded-xl border border-[#d4a853]/20 bg-[#151023] p-4 space-y-2"
            >
              <h3 className="font-display text-base font-bold text-[#f0cb78]">{cls.name}</h3>
              <p className="text-xs leading-relaxed text-[#bdb5c9]">{cls.roleSummary}</p>
              <p className="text-[11px] text-[#8d839b]">
                Affinities: {cls.preferredElements.join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Races & Rarity Tiers */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 border-t border-[#d4a853]/18 pt-8">
        <div className="rounded-xl border border-[#d4a853]/20 bg-[#151023] p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-[#f4e6c8]">
            Six Fantasy Races
          </h2>
          <p className="text-sm text-[#bdb5c9]">
            Each race shapes portrait anatomy, naming conventions, and regional origin lore:
          </p>
          <ul className="grid grid-cols-2 gap-3 text-sm text-[#e7e0d2]">
            {FANTASY_RACES.map((race) => (
              <li
                key={race}
                className="rounded-lg border border-white/8 bg-[#0e0a18] px-3 py-2 font-medium"
              >
                {race}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[#d4a853]/20 bg-[#151023] p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-[#f4e6c8]">
            Card Rarity Tiers
          </h2>
          <p className="text-sm text-[#bdb5c9]">
            Card rarity reflects overall combat potency and character level, scaling frame borders
            and collector crests:
          </p>
          <div className="space-y-2.5">
            {RARITY_ORDER.map((rarity) => {
              const cfg = RARITY_CONFIG[rarity];
              return (
                <div
                  key={rarity}
                  className={`flex items-center justify-between rounded-lg border ${cfg.borderColor} ${cfg.surfaceBg} px-3.5 py-2.5`}
                >
                  <span className={`font-display text-sm font-semibold ${cfg.accentColor}`}>
                    {rarity}
                  </span>
                  <span className="text-xs text-[#c5bdd1]">
                    {rarity === 'Common' && 'Levels 1–27 · Adventurer'}
                    {rarity === 'Rare' && 'Levels 28–51 · Seasoned Veteran'}
                    {rarity === 'Epic' && 'Levels 52–77 · Realm Champion'}
                    {rarity === 'Legendary' && 'Levels 78–99 · Mythic Paragon'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={() => onNavigate('create')}
          className="rounded-lg bg-[#d4a853] px-5 py-2.5 text-sm font-semibold text-[#130d1d] hover:bg-[#e5be6c] transition-colors"
        >
          Start Creating Characters
        </button>
        <button
          type="button"
          onClick={() => onNavigate('deck')}
          className="rounded-lg border border-[#d4a853]/35 bg-[#151023] px-5 py-2.5 text-sm font-medium text-[#ede7dc] hover:bg-[#1e1732] transition-colors"
        >
          Explore My Deck
        </button>
      </div>
    </div>
  );
};
