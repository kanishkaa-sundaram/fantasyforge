import React, { useState } from 'react';
import { Menu, Sparkles, X } from 'lucide-react';
import { AppSection } from '../types/character';

interface NavbarProps {
  activeSection: AppSection;
  deckCount: number;
  onNavigate: (section: AppSection) => void;
  onQuickCreate: () => void;
}

const NAV_ITEMS: { id: AppSection; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'create', label: 'Create Character' },
  { id: 'deck', label: 'My Deck' },
  { id: 'about', label: 'About' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  deckCount,
  onNavigate,
  onQuickCreate,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (section: AppSection) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#d4a853]/20 bg-[#0b0914]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="font-display text-lg font-bold tracking-wide text-[#f4e6c8] whitespace-nowrap shrink-0 hover:text-[#d4a853] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4a853]"
        >
          FantasyForge
        </button>

        {/* Zone 2: Clean single-line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const label =
              item.id === 'deck' && deckCount > 0
                ? `${item.label} (${deckCount})`
                : item.label;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4a853] ${
                  isActive
                    ? 'text-[#f0cb78]'
                    : 'text-[#bfb7ca] hover:text-[#f8f3ea]'
                }`}
              >
                {label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-1 h-[2px] bg-[#d4a853] transition-transform duration-150 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onQuickCreate();
              setMobileOpen(false);
            }}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#d4a853] px-4 py-2 text-xs font-semibold text-[#130d1d] shadow-sm hover:bg-[#e5be6c] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0cb78]"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Forge Character
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-[#d4a853]/30 text-[#ede7dc] hover:bg-[#1a142a] transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-[#d4a853]/15 bg-[#120e1e] px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#241b38] text-[#f0cb78]'
                    : 'text-[#cbc4d4] hover:bg-[#1b152b]'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'deck' && (
                  <span className="font-mono text-xs tabular-nums text-[#a69cb3]">
                    {deckCount}
                  </span>
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              onQuickCreate();
              setMobileOpen(false);
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#d4a853] px-4 py-2.5 text-sm font-semibold text-[#130d1d]"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Forge Character
          </button>
        </nav>
      )}
    </header>
  );
};
