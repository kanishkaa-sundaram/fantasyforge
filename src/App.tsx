import { useCallback, useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { CharacterCreator } from './components/CharacterCreator';
import { HomeSection } from './components/HomeSection';
import { MyDeckSection } from './components/MyDeckSection';
import { Navbar } from './components/Navbar';
import { ToastBanner } from './components/ToastBanner';
import {
  AppSection,
  Character,
  ToastMessage,
  ToastTone,
} from './types/character';
import {
  createBaselineCharacter,
  generateBackstory,
  generateCharacter,
  generatePortraitSeed,
  isDuplicateCharacter,
} from './utils/characterGenerator';
import { loadDeck, saveDeck } from './utils/storage';

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [deck, setDeck] = useState<Character[]>(() => loadDeck());
  const [activeCharacter, setActiveCharacter] = useState<Character>(() =>
    generateCharacter()
  );
  const [sampleCharacter, setSampleCharacter] = useState<Character>(() =>
    generateCharacter()
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    saveDeck(deck);
  }, [deck]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 3600);
    },
    [dismissToast]
  );

  const handleGenerateCharacter = () => {
    const existingNames = deck.map((c) => c.name);
    const next = generateCharacter(existingNames);
    setActiveCharacter(next);
    notify(`Generated ${next.name} (${next.race} ${next.characterClass}).`, 'success');
  };

  const handleRegenerateCharacter = () => {
    const existingNames = deck.map((c) => c.name);
    const next = generateCharacter(existingNames);
    setActiveCharacter(next);
    notify(`Regenerated hero: ${next.name}, ${next.title}.`, 'info');
  };

  const handleRandomCharacter = () => {
    const existingNames = deck.map((c) => c.name);
    const next = generateCharacter(existingNames);
    setActiveCharacter(next);
    notify(`Summoned random hero ${next.name}.`, 'success');
  };

  const handleResetCharacter = () => {
    setActiveCharacter(createBaselineCharacter());
    notify('Character workbench reset to baseline.', 'info');
  };

  const handleGeneratePortrait = () => {
    setActiveCharacter((prev) => ({
      ...prev,
      portraitGenerated: true,
      portraitSeed: prev.portraitGenerated ? prev.portraitSeed : generatePortraitSeed(),
    }));
    notify(`Portrait illustrated for ${activeCharacter.name}.`, 'success');
  };

  const handleRegeneratePortrait = () => {
    setActiveCharacter((prev) => ({
      ...prev,
      portraitGenerated: true,
      portraitSeed: generatePortraitSeed(),
    }));
    notify(`Regenerated portrait style for ${activeCharacter.name}.`, 'info');
  };

  const handleGenerateBackstory = () => {
    const safeName = activeCharacter.name.trim() || 'Unnamed Hero';
    const safeTitle = activeCharacter.title.trim() || 'The Wanderer';

    const backstory = generateBackstory(
      safeName,
      safeTitle,
      activeCharacter.characterClass,
      activeCharacter.race,
      activeCharacter.elementalAffinity
    );

    setActiveCharacter((prev) => ({
      ...prev,
      name: safeName,
      title: safeTitle,
      backstory,
    }));
    notify(`Backstory inscribed for ${safeName}.`, 'success');
  };

  const handleSaveToDeck = () => {
    const trimmedName = activeCharacter.name.trim();
    if (!trimmedName) {
      notify('Please enter a character name before saving to your deck.', 'warning');
      return;
    }

    const normalized: Character = {
      ...activeCharacter,
      name: trimmedName,
      title: activeCharacter.title.trim() || 'Adventurer',
      createdAt: Date.now(),
    };

    if (isDuplicateCharacter(normalized, deck)) {
      notify(
        `${normalized.name} is already saved in My Deck. Customize or generate a new hero to save.`,
        'warning'
      );
      return;
    }

    setDeck((prev) => [normalized, ...prev]);
    setActiveCharacter(normalized);
    notify(`Saved ${normalized.name} to My Deck.`, 'success');
  };

  const handleDeleteCharacter = (id: string) => {
    const target = deck.find((c) => c.id === id);
    setDeck((prev) => prev.filter((c) => c.id !== id));
    notify(
      target ? `Deleted ${target.name} from My Deck.` : 'Character deleted.',
      'info'
    );
  };

  const handleClearDeck = () => {
    setDeck([]);
    notify('Cleared all characters from My Deck.', 'info');
  };

  const handleLoadIntoForge = (character: Character) => {
    setActiveCharacter({
      ...character,
      id: `ff-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    });
    setActiveSection('create');
    notify(`Loaded ${character.name} into the Character Forge.`, 'info');
  };

  const handleQuickCreateFromHeader = () => {
    const next = generateCharacter(deck.map((c) => c.name));
    setActiveCharacter(next);
    setActiveSection('create');
    notify(`Forged ${next.name} in the Character Forge.`, 'success');
  };

  const alreadySaved = isDuplicateCharacter(activeCharacter, deck);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0914] text-[#ede7dc]">
      {/* Subtle Ambient Background Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(76,42,133,0.18)_0%,_rgba(11,9,20,0)_58%)]"
      />

      <Navbar
        activeSection={activeSection}
        deckCount={deck.length}
        onNavigate={setActiveSection}
        onQuickCreate={handleQuickCreateFromHeader}
      />

      <main className="relative z-10 flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {activeSection === 'home' && (
          <HomeSection
            sampleCharacter={sampleCharacter}
            deckCount={deck.length}
            onNavigate={setActiveSection}
            onGenerateNewSample={() => setSampleCharacter(generateCharacter())}
            onForgeFromSample={() => {
              setActiveCharacter(sampleCharacter);
              setActiveSection('create');
              notify(`Loaded ${sampleCharacter.name} into the Character Forge.`, 'info');
            }}
          />
        )}

        {activeSection === 'create' && (
          <CharacterCreator
            character={activeCharacter}
            isAlreadySaved={alreadySaved}
            onUpdateCharacter={setActiveCharacter}
            onGenerateCharacter={handleGenerateCharacter}
            onRegenerateCharacter={handleRegenerateCharacter}
            onRandomCharacter={handleRandomCharacter}
            onResetCharacter={handleResetCharacter}
            onGeneratePortrait={handleGeneratePortrait}
            onRegeneratePortrait={handleRegeneratePortrait}
            onGenerateBackstory={handleGenerateBackstory}
            onSaveToDeck={handleSaveToDeck}
            onNotify={notify}
          />
        )}

        {activeSection === 'deck' && (
          <MyDeckSection
            deck={deck}
            onDeleteCharacter={handleDeleteCharacter}
            onClearDeck={handleClearDeck}
            onLoadIntoForge={handleLoadIntoForge}
            onCreateNew={() => setActiveSection('create')}
            onNotify={notify}
          />
        )}

        {activeSection === 'about' && <AboutSection onNavigate={setActiveSection} />}
      </main>

      <footer className="relative z-10 border-t border-[#d4a853]/15 bg-[#090710]/90 py-6">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 text-xs text-[#91889f]">
          <p className="font-display tracking-wide text-[#d4a853]">
            FantasyForge – Fantasy Character Creator
          </p>
          <p>
            All characters, SVG portraits, and decks are stored locally in your browser.
          </p>
        </div>
      </footer>

      <ToastBanner toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
