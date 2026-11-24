import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowUpDown,
  Download,
  Eye,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { CHARACTER_CLASSES, RARITY_CONFIG } from '../data/fantasyDatasets';
import { Character, CharacterClass } from '../types/character';
import { downloadCharacterCardPng } from '../utils/exportCardImage';
import { CharacterPortrait } from './CharacterPortrait';
import { PlayerCard } from './PlayerCard';

interface MyDeckSectionProps {
  deck: Character[];
  onDeleteCharacter: (id: string) => void;
  onClearDeck: () => void;
  onLoadIntoForge: (character: Character) => void;
  onCreateNew: () => void;
  onNotify: (message: string, tone?: 'success' | 'info' | 'warning') => void;
}

type SortOption =
  | 'newest'
  | 'level-desc'
  | 'level-asc'
  | 'rarity-desc'
  | 'rarity-asc';

export const MyDeckSection: React.FC<MyDeckSectionProps> = ({
  deck,
  onDeleteCharacter,
  onClearDeck,
  onLoadIntoForge,
  onCreateNew,
  onNotify,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<'All' | CharacterClass>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [exportingModal, setExportingModal] = useState(false);

  const modalPortraitRef = useRef<SVGSVGElement | null>(null);

  const filteredAndSorted = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = deck.filter((char) => {
      if (classFilter !== 'All' && char.characterClass !== classFilter) {
        return false;
      }

      if (!query) return true;

      return (
        char.name.toLowerCase().includes(query) ||
        char.title.toLowerCase().includes(query) ||
        char.race.toLowerCase().includes(query) ||
        char.characterClass.toLowerCase().includes(query) ||
        char.elementalAffinity.toLowerCase().includes(query) ||
        (char.backstory?.fullText.toLowerCase().includes(query) ?? false)
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'level-desc':
          return b.level - a.level;
        case 'level-asc':
          return a.level - b.level;
        case 'rarity-desc':
          return (
            RARITY_CONFIG[b.rarity].rankOrder - RARITY_CONFIG[a.rarity].rankOrder ||
            b.level - a.level
          );
        case 'rarity-asc':
          return (
            RARITY_CONFIG[a.rarity].rankOrder - RARITY_CONFIG[b.rarity].rankOrder ||
            a.level - b.level
          );
        case 'newest':
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }, [deck, searchQuery, classFilter, sortBy]);

  const handleModalDownload = async () => {
    if (!selectedCharacter) return;
    setExportingModal(true);
    try {
      const ok = await downloadCharacterCardPng(
        selectedCharacter,
        modalPortraitRef.current
      );
      if (ok) {
        onNotify(`Downloaded ${selectedCharacter.name} card as PNG.`, 'success');
      } else {
        onNotify('Card image export is unavailable in this browser.', 'warning');
      }
    } catch {
      onNotify('Could not export card image.', 'warning');
    } finally {
      setExportingModal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Deck Header */}
      <div className="flex flex-col gap-4 border-b border-[#d4a853]/18 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a853]">
            Character Collection
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-[#f8f3ea]">
            My Deck ({deck.length})
          </h1>
          <p className="mt-1 text-sm text-[#b9b0c5]">
            Browse, inspect, filter, and manage your saved fantasy heroes stored locally in your
            browser.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 rounded-lg bg-[#d4a853] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#130d1d] hover:bg-[#e5be6c] transition-colors whitespace-nowrap"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Create New Hero
          </button>

          {deck.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-950/30 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-rose-200 hover:bg-rose-950/55 transition-colors whitespace-nowrap"
            >
              <Trash2 className="h-4 w-4 text-rose-400" aria-hidden="true" />
              Clear Deck
            </button>
          )}
        </div>
      </div>

      {/* Inline Clear Deck Confirmation */}
      {confirmClearOpen && (
        <div
          role="alertdialog"
          aria-labelledby="clear-deck-heading"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-rose-500/45 bg-[#23101a] p-4"
        >
          <div>
            <h2 id="clear-deck-heading" className="text-sm font-semibold text-rose-100">
              Clear all {deck.length} characters from My Deck?
            </h2>
            <p className="text-xs text-rose-200/80 mt-0.5">
              This permanently removes all saved heroes from localStorage on this browser.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setConfirmClearOpen(false)}
              className="rounded-lg border border-white/15 bg-[#150d17] px-3.5 py-2 text-xs font-medium text-[#ede7dc] hover:bg-[#1f1422] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onClearDeck();
                setConfirmClearOpen(false);
                setSelectedCharacter(null);
              }}
              className="rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
            >
              Confirm Clear Deck
            </button>
          </div>
        </div>
      )}

      {/* Search, Filter & Sort Toolbar */}
      {deck.length > 0 && (
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#d4a853]/20 bg-[#140f22] p-4 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d839b]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, race, title, or element..."
              aria-label="Search saved characters"
              className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] py-2 pl-9 pr-3 text-sm text-[#f7f1e5] placeholder:text-[#736a82] focus:border-[#d4a853] focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={classFilter}
              onChange={(e) =>
                setClassFilter(e.target.value as 'All' | CharacterClass)
              }
              aria-label="Filter by character class"
              className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] px-3 py-2 text-sm text-[#f7f1e5] focus:border-[#d4a853] focus:outline-none"
            >
              <option value="All">All Classes</option>
              {CHARACTER_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="relative md:col-span-3">
            <ArrowUpDown
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d839b]"
              aria-hidden="true"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort saved characters"
              className="w-full rounded-lg border border-[#d4a853]/25 bg-[#0d0a17] py-2 pl-9 pr-3 text-sm text-[#f7f1e5] focus:border-[#d4a853] focus:outline-none"
            >
              <option value="newest">Sort: Recently Saved</option>
              <option value="level-desc">Level: High to Low</option>
              <option value="level-asc">Level: Low to High</option>
              <option value="rarity-desc">Rarity: Legendary First</option>
              <option value="rarity-asc">Rarity: Common First</option>
            </select>
          </div>
        </div>
      )}

      {/* Empty States or Deck Grid */}
      {deck.length === 0 ? (
        <div className="rounded-2xl border border-[#d4a853]/20 bg-[#140f22] px-6 py-14 text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#f4e6c8]">
            Your Deck Is Empty
          </h2>
          <p className="mx-auto max-w-md text-sm text-[#b9b0c5]">
            Head to the Character Forge to generate a hero, illustrate their portrait, write a
            chronicle, and click Save to Deck to build your collection.
          </p>
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 rounded-lg bg-[#d4a853] px-5 py-2.5 text-sm font-semibold text-[#130d1d] hover:bg-[#e5be6c] transition-colors"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Forge Your First Character
          </button>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="rounded-2xl border border-[#d4a853]/20 bg-[#140f22] px-6 py-12 text-center space-y-3">
          <h2 className="font-display text-xl font-bold text-[#f4e6c8]">
            No Matching Heroes
          </h2>
          <p className="text-sm text-[#b9b0c5]">
            No characters match your current search or class filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setClassFilter('All');
            }}
            className="rounded-lg border border-[#d4a853]/35 px-4 py-2 text-xs font-medium text-[#f0cb78] hover:bg-[#1e1732] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((char) => {
            const rarityCfg = RARITY_CONFIG[char.rarity];
            return (
              <article
                key={char.id}
                className={`group flex flex-col justify-between rounded-2xl border ${rarityCfg.borderColor} bg-gradient-to-b from-[#191329] to-[#100c1b] p-5 transition-transform duration-150 hover:-translate-y-0.5 ${rarityCfg.glowClass}`}
              >
                <div className="space-y-4">
                  {/* Top Metadata Line */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`font-semibold uppercase tracking-wider ${rarityCfg.accentColor}`}
                    >
                      {char.rarity}
                    </span>
                    <span className="font-mono tabular-nums text-[#cfc7d9]">
                      Lvl {char.level} · {char.elementalAffinity}
                    </span>
                  </div>

                  {/* Portrait + Identity */}
                  <div className="flex items-center gap-4">
                    <CharacterPortrait character={char} size="sm" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-bold text-[#f7f1e5] truncate">
                        {char.name}
                      </h3>
                      <p className="text-xs text-[#d4a853] truncate">{char.title}</p>
                      <p className="mt-1.5 text-xs text-[#c5bdd1]">
                        {char.race} · {char.characterClass}
                      </p>
                    </div>
                  </div>

                  {/* Compact Stat Row */}
                  <dl className="grid grid-cols-4 gap-2 rounded-lg border border-white/8 bg-[#0c0915] px-3 py-2 text-center">
                    <div>
                      <dt className="text-[10px] text-[#9b92a8]">HP</dt>
                      <dd className="font-mono text-xs font-semibold tabular-nums text-emerald-400">
                        {char.stats.hp}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] text-[#9b92a8]">MP</dt>
                      <dd className="font-mono text-xs font-semibold tabular-nums text-violet-300">
                        {char.stats.mp}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] text-[#9b92a8]">STR</dt>
                      <dd className="font-mono text-xs font-semibold tabular-nums text-[#f0cb78]">
                        {char.stats.strength}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] text-[#9b92a8]">DEF</dt>
                      <dd className="font-mono text-xs font-semibold tabular-nums text-[#e2d9c8]">
                        {char.stats.defense}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Card Actions */}
                <div className="mt-4 flex items-center gap-2 border-t border-[#d4a853]/15 pt-3.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCharacter(char)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#d4a853]/35 bg-[#1b152d] px-3 py-2 text-xs font-semibold text-[#f3dfb8] hover:bg-[#271e40] transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    Inspect Card
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteCharacter(char.id)}
                    aria-label={`Delete ${char.name}`}
                    className="inline-flex items-center justify-center rounded-lg border border-rose-500/30 bg-rose-950/25 p-2 text-rose-300 hover:bg-rose-950/55 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Character Detail Modal */}
      {selectedCharacter && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedCharacter.name} Details`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto"
        >
          <div className="relative my-auto w-full max-w-3xl rounded-2xl border border-[#d4a853]/35 bg-[#0f0b1a] p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleModalDownload}
                  disabled={exportingModal}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4a853]/35 bg-[#1b152d] px-3 py-2 text-xs font-semibold text-[#f3dfb8] hover:bg-[#271e40] transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-[#d4a853]" aria-hidden="true" />
                  {exportingModal ? 'Exporting...' : 'Download Card'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLoadIntoForge(selectedCharacter);
                    setSelectedCharacter(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#d4a853] px-3 py-2 text-xs font-semibold text-[#130d1d] hover:bg-[#e5be6c] transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit in Forge
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCharacter(selectedCharacter.id);
                    setSelectedCharacter(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/35 bg-rose-950/30 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-950/55 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCharacter(null)}
                aria-label="Close character details"
                className="rounded-lg border border-white/15 bg-[#171226] p-2 text-[#c9c1d3] hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <PlayerCard
              character={selectedCharacter}
              portraitRef={modalPortraitRef}
            />
          </div>
        </div>
      )}
    </div>
  );
};
