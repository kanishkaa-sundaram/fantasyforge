import { Character } from '../types/character';

const DECK_STORAGE_KEY = 'fantasyforge_deck_v1';

/**
 * Loads saved characters safely from browser localStorage.
 */
export function loadDeck(): Character[] {
  try {
    const raw = window.localStorage.getItem(DECK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is Character =>
        Boolean(
          entry &&
            typeof entry.id === 'string' &&
            typeof entry.name === 'string' &&
            typeof entry.characterClass === 'string' &&
            entry.stats &&
            entry.appearance
        )
    );
  } catch {
    return [];
  }
}

/**
 * Persists the entire character deck to browser localStorage.
 */
export function saveDeck(deck: Character[]): void {
  try {
    window.localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
  } catch {
    // Gracefully ignore storage quota issues in restricted environments
  }
}
