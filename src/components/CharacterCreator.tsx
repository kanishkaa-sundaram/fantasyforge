import React, { useRef, useState } from 'react';
import {
  BookmarkPlus,
  Dices,
  Download,
  Image as ImageIcon,
  RefreshCw,
  RotateCcw,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import {
  APPEARANCE_ARCHETYPES,
  CHARACTER_CLASSES,
  CLASS_DATA,
  COLOR_THEMES,
  ELEMENTAL_AFFINITIES,
  EYE_GLOW_STYLES,
  FANTASY_RACES,
  HAIR_CROWN_STYLES,
} from '../data/fantasyDatasets';
import {
  AppearanceArchetype,
  Character,
  CharacterClass,
  ColorThemeId,
  ElementalAffinity,
  EyeGlowStyle,
  FantasyRace,
  HairCrownStyle,
} from '../types/character';
import {
  calculateRarity,
  generateStatsForClass,
} from '../utils/characterGenerator';
import { downloadCharacterCardPng } from '../utils/exportCardImage';
import { PlayerCard } from './PlayerCard';

interface CharacterCreatorProps {
  character: Character;
  isAlreadySaved: boolean;
  onUpdateCharacter: (updated: Character) => void;
  onGenerateCharacter: () => void;
  onRegenerateCharacter: () => void;
  onRandomCharacter: () => void;
  onResetCharacter: () => void;
  onGeneratePortrait: () => void;
  onRegeneratePortrait: () => void;
  onGenerateBackstory: () => void;
  onSaveToDeck: () => void;
  onNotify: (message: string, tone?: 'success' | 'info' | 'warning') => void;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  character,
  isAlreadySaved,
  onUpdateCharacter,
  onGenerateCharacter,
  onRegenerateCharacter,
  onRandomCharacter,
  onResetCharacter,
  onGeneratePortrait,
  onRegeneratePortrait,
  onGenerateBackstory,
  onSaveToDeck,
  onNotify,
}) => {
  const portraitSvgRef = useRef<SVGSVGElement | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleClassChange = (newClass: CharacterClass) => {
    const newStats = generateStatsForClass(
      newClass,
      character.level,
      character.portraitSeed
    );
    const newRarity = calculateRarity(character.level, newStats);
    const accessories = CLASS_DATA[newClass].accessories;

    onUpdateCharacter({
      ...character,
      characterClass: newClass,
      stats: newStats,
      rarity: newRarity,
      appearance: {
        ...character.appearance,
        accessory: accessories[0],
      },
    });
  };

  const handleLevelChange = (rawLevel: number) => {
    const clampedLevel = Math.max(1, Math.min(99, Math.round(rawLevel) || 1));
    const newStats = generateStatsForClass(
      character.characterClass,
      clampedLevel,
      character.portraitSeed
    );
    const newRarity = calculateRarity(clampedLevel, newStats);

    onUpdateCharacter({
      ...character,
      level: clampedLevel,
      stats: newStats,
      rarity: newRarity,
    });
  };

  const handleDownloadCard = async () => {
    if (!character.name.trim()) {
      onNotify('Enter a character name before downloading the card.', 'warning');
      return;
    }

    setExporting(true);
    try {
      const ok = await downloadCharacterCardPng(character, portraitSvgRef.current);
      if (ok) {
        onNotify(`Downloaded ${character.name} card as PNG.`, 'success');
      } else {
        onNotify('Card image export is unavailable in this browser.', 'warning');
      }
    } catch {
      onNotify('Could not export card image.', 'warning');
    } finally {
      setExporting(false);
    }
  };

  const accessoryOptions = CLASS_DATA[character.characterClass].accessories;

  return (
    <div className="space-y-8">
      {/* Forge Action Header */}
      <div className="flex flex-col gap-4 border-b border-[#d4a853]/18 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
            Character Forge
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-[#f8f3ea]">
            Create & Customize Your Hero
          </h1>
          <p className="mt-1 text-sm text-[#b9b0c5]">
            Generate complete heroes automatically or fine-tune every trait, portrait detail, and
            chronicle.
          </p>
        </div>

        {/* Core Generation & Reset Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onGenerateCharacter}
            className="inline-flex items-center gap-2 rounded-lg bg-[#d4a853] px-4 py-2.5 text-sm font-semibold text-[#130d1d] shadow-sm hover:bg-[#e5be6c] active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Generate Character
          </button>

          <button
            type="button"
            onClick={onRegenerateCharacter}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d4a853]/35 bg-[#171226] px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#ede7dc] hover:border-[#d4a853]/70 hover:bg-[#211a36] transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="h-4 w-4 text-[#d4a853]" aria-hidden="true" />
            Regenerate Character
          </button>

          <button
            type="button"
            onClick={onRandomCharacter}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/35 bg-[#11211d] px-3.5 py-2.5 text-xs sm:text-sm font-medium text-emerald-200 hover:bg-[#172e28] transition-colors whitespace-nowrap shrink-0"
          >
            <Dices className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Random Character
          </button>

          <button
            type="button"
            onClick={onResetCharacter}
            className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-[#141020] px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#c5bdd1] hover:border-white/25 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset Character
          </button>
        </div>
      </div>

      {/* Main Split Workspace: Left Controls / Right Live Player Card */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left: Interactive Controls & Customization */}
        <div className="lg:col-span-5 space-y-6">
          {/* Portrait & Backstory Action Panel */}
          <section className="rounded-2xl border border-[#d4a853]/22 bg-[#140f22] p-5 space-y-4">
            <h2 className="font-display text-base font-bold tracking-wide text-[#f0cb78]">
              Illustration & Chronicle Controls
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onGeneratePortrait}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d4a853]/40 bg-[#1e1730] px-3.5 py-2.5 text-xs font-semibold text-[#f5dfb0] hover:bg-[#292041] transition-colors whitespace-nowrap"
              >
                <ImageIcon className="h-4 w-4 text-[#d4a853]" aria-hidden="true" />
                Generate Portrait
              </button>

              <button
                type="button"
                onClick={onRegeneratePortrait}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-400/35 bg-[#1b1530] px-3.5 py-2.5 text-xs font-semibold text-violet-200 hover:bg-[#261d42] transition-colors whitespace-nowrap"
              >
                <RefreshCw className="h-4 w-4 text-violet-300" aria-hidden="true" />
                Regenerate Portrait
              </button>
            </div>

            <button
              type="button"
              onClick={onGenerateBackstory}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#b88644]/50 bg-[#251a12] px-4 py-2.5 text-sm font-semibold text-[#f3dfb8] hover:bg-[#322318] transition-colors"
            >
              <ScrollText className="h-4 w-4 text-[#d4a853]" aria-hidden="true" />
              Generate Backstory
            </button>
          </section>

          {/* Identity & Class Customization */}
          <section className="rounded-2xl border border-[#d4a853]/22 bg-[#140f22] p-5 space-y-4">
            <h2 className="font-display text-base font-bold tracking-wide text-[#f0cb78]">
              Identity & Attributes
            </h2>

            <div className="space-y-3.5">
              <div>
                <label
                  htmlFor="char-name"
                  className="block text-xs font-medium text-[#cfc7da] mb-1.5"
                >
                  Character Name
                </label>
                <input
                  id="char-name"
                  type="text"
                  maxLength={40}
                  value={character.name}
                  onChange={(e) =>
                    onUpdateCharacter({ ...character, name: e.target.value })
                  }
                  placeholder="Enter character name"
                  className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] placeholder:text-[#736a82] focus:border-[#d4a853] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="char-title"
                  className="block text-xs font-medium text-[#cfc7da] mb-1.5"
                >
                  Character Title
                </label>
                <input
                  id="char-title"
                  type="text"
                  maxLength={48}
                  value={character.title}
                  onChange={(e) =>
                    onUpdateCharacter({ ...character, title: e.target.value })
                  }
                  placeholder="e.g. The Oathbound"
                  className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] placeholder:text-[#736a82] focus:border-[#d4a853] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="char-class"
                    className="block text-xs font-medium text-[#cfc7da] mb-1.5"
                  >
                    Class
                  </label>
                  <select
                    id="char-class"
                    value={character.characterClass}
                    onChange={(e) =>
                      handleClassChange(e.target.value as CharacterClass)
                    }
                    className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] focus:border-[#d4a853] focus:outline-none"
                  >
                    {CHARACTER_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="char-race"
                    className="block text-xs font-medium text-[#cfc7da] mb-1.5"
                  >
                    Fantasy Race
                  </label>
                  <select
                    id="char-race"
                    value={character.race}
                    onChange={(e) =>
                      onUpdateCharacter({
                        ...character,
                        race: e.target.value as FantasyRace,
                      })
                    }
                    className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] focus:border-[#d4a853] focus:outline-none"
                  >
                    {FANTASY_RACES.map((race) => (
                      <option key={race} value={race}>
                        {race}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="char-element"
                    className="block text-xs font-medium text-[#cfc7da] mb-1.5"
                  >
                    Elemental Affinity
                  </label>
                  <select
                    id="char-element"
                    value={character.elementalAffinity}
                    onChange={(e) =>
                      onUpdateCharacter({
                        ...character,
                        elementalAffinity: e.target.value as ElementalAffinity,
                      })
                    }
                    className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] focus:border-[#d4a853] focus:outline-none"
                  >
                    {ELEMENTAL_AFFINITIES.map((el) => (
                      <option key={el} value={el}>
                        {el}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-[#cfc7da] mb-1.5">
                    <label htmlFor="char-level">Character Level</label>
                    <span className="font-mono tabular-nums text-[#f0cb78]">
                      {character.level}
                    </span>
                  </div>
                  <input
                    id="char-level"
                    type="range"
                    min={1}
                    max={99}
                    value={character.level}
                    onChange={(e) => handleLevelChange(Number(e.target.value))}
                    className="w-full accent-[#d4a853] cursor-pointer mt-2"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Gender-Neutral Appearance & Theme Customization */}
          <section className="rounded-2xl border border-[#d4a853]/22 bg-[#140f22] p-5 space-y-4">
            <h2 className="font-display text-base font-bold tracking-wide text-[#f0cb78]">
              Gender-Neutral Appearance & Gear
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="char-archetype"
                  className="block text-xs font-medium text-[#cfc7da] mb-1.5"
                >
                  Appearance Style
                </label>
                <select
                  id="char-archetype"
                  value={character.appearance.archetype}
                  onChange={(e) =>
                    onUpdateCharacter({
                      ...character,
                      appearance: {
                        ...character.appearance,
                        archetype: e.target.value as AppearanceArchetype,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] focus:border-[#d4a853] focus:outline-none"
                >
                  {APPEARANCE_ARCHETYPES.map((arch) => (
                    <option key={arch} value={arch}>
                      {arch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="char-hair"
                  className="block text-xs font-medium text-[#cfc7da] mb-1.5"
                >
                  Hair & Headgear
                </label>
                <select
                  id="char-hair"
                  value={character.appearance.hairStyle}
                  onChange={(e) =>
                    onUpdateCharacter({
                      ...character,
                      appearance: {
                        ...character.appearance,
                        hairStyle: e.target.value as HairCrownStyle,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] focus:border-[#d4a853] focus:outline-none"
                >
                  {HAIR_CROWN_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="char-eyes"
                  className="block text-xs font-medium text-[#cfc7da] mb-1.5"
                >
                  Eye Glow
                </label>
                <select
                  id="char-eyes"
                  value={character.appearance.eyeColor}
                  onChange={(e) =>
                    onUpdateCharacter({
                      ...character,
                      appearance: {
                        ...character.appearance,
                        eyeColor: e.target.value as EyeGlowStyle,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] focus:border-[#d4a853] focus:outline-none"
                >
                  {EYE_GLOW_STYLES.map((eye) => (
                    <option key={eye} value={eye}>
                      {eye}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="char-theme"
                  className="block text-xs font-medium text-[#cfc7da] mb-1.5"
                >
                  Color Theme
                </label>
                <select
                  id="char-theme"
                  value={character.appearance.colorTheme}
                  onChange={(e) =>
                    onUpdateCharacter({
                      ...character,
                      appearance: {
                        ...character.appearance,
                        colorTheme: e.target.value as ColorThemeId,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] focus:border-[#d4a853] focus:outline-none"
                >
                  {COLOR_THEMES.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="char-accessory"
                className="block text-xs font-medium text-[#cfc7da] mb-1.5"
              >
                Signature Equipment & Accessory
              </label>
              <select
                id="char-accessory"
                value={character.appearance.accessory}
                onChange={(e) =>
                  onUpdateCharacter({
                    ...character,
                    appearance: {
                      ...character.appearance,
                      accessory: e.target.value,
                    },
                  })
                }
                className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] focus:border-[#d4a853] focus:outline-none"
              >
                {accessoryOptions.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>
          </section>
        </div>

        {/* Right: Interactive Collectible Player Card & Deck Actions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d4a853]/22 bg-[#140f22] px-4 py-3">
            <div className="text-xs text-[#bdb5c9]">
              <span className="font-semibold text-[#f4e6c8]">Interactive Player Card</span>
              <span aria-hidden="true" className="mx-2 text-[#6b6278]">
                ·
              </span>
              <span>{isAlreadySaved ? 'Saved in My Deck' : 'Ready to collect'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadCard}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-lg border border-[#d4a853]/35 bg-[#1b152d] px-3.5 py-2 text-xs font-semibold text-[#f3dfb8] hover:bg-[#261d3e] disabled:opacity-60 transition-colors whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5 text-[#d4a853]" aria-hidden="true" />
                {exporting ? 'Exporting...' : 'Download Card'}
              </button>

              <button
                type="button"
                onClick={onSaveToDeck}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
                Save to Deck
              </button>
            </div>
          </div>

          <PlayerCard character={character} portraitRef={portraitSvgRef} />
        </div>
      </div>
    </div>
  );
};
