import {
  APPEARANCE_ARCHETYPES,
  BACKSTORY_ABILITIES,
  BACKSTORY_CHILDHOODS,
  BACKSTORY_EVENTS,
  BACKSTORY_MISSIONS,
  BACKSTORY_ORIGINS,
  CHARACTER_CLASSES,
  CLASS_DATA,
  COLOR_THEMES,
  ELEMENTAL_AFFINITIES,
  EYE_GLOW_STYLES,
  FANTASY_RACES,
  HAIR_CROWN_STYLES,
  RACE_DATA,
} from '../data/fantasyDatasets';
import {
  Character,
  CharacterBackstory,
  CharacterClass,
  CharacterStats,
  ElementalAffinity,
  FantasyRace,
  Rarity,
} from '../types/character';

/**
 * Selects a random element from a non-empty array.
 */
function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Generates a unique fantasy character name tailored to the chosen race,
 * avoiding collisions with names already present in the user's saved deck.
 */
export function generateUniqueName(
  race: FantasyRace,
  existingNames: string[] = []
): string {
  const raceMeta = RACE_DATA[race];
  const existingSet = new Set(existingNames.map((n) => n.trim().toLowerCase()));

  for (let attempt = 0; attempt < 25; attempt++) {
    let candidate: string;
    if (attempt < 5 && Math.random() < 0.35) {
      candidate = pickRandom(raceMeta.singleNames);
    } else {
      const first =
        pickRandom(raceMeta.nameFirstParts) + pickRandom(raceMeta.nameSecondParts);
      const surnameFirst =
        pickRandom(raceMeta.nameFirstParts) + pickRandom(raceMeta.nameSecondParts);
      candidate =
        Math.random() < 0.72 ? `${first} ${surnameFirst}` : first;
    }

    if (!existingSet.has(candidate.toLowerCase())) {
      return candidate;
    }
  }

  const fallback =
    pickRandom(raceMeta.nameFirstParts) +
    pickRandom(raceMeta.nameSecondParts) +
    ' ' +
    pickRandom(raceMeta.nameFirstParts) +
    'en';
  return fallback;
}

/**
 * Computes consistent, class-weighted statistics for a character at a given level.
 * Uses a deterministic seed so stats remain stable unless explicitly regenerated.
 */
export function generateStatsForClass(
  characterClass: CharacterClass,
  level: number,
  seed: number
): CharacterStats {
  const weights = CLASS_DATA[characterClass].statWeights;
  const clampedLevel = Math.max(1, Math.min(99, level));

  // Deterministic pseudo-random variance from seed (between 0.90 and 1.12)
  const seededOffset = (salt: number): number => {
    const x = Math.sin(seed * 9301 + salt * 49297) * 233280;
    const frac = x - Math.floor(x);
    return 0.9 + frac * 0.22;
  };

  const levelFactor = 0.55 + (clampedLevel / 99) * 0.45;

  const strength = Math.min(
    99,
    Math.max(18, Math.round(52 * weights.strength * levelFactor * seededOffset(1)))
  );
  const agility = Math.min(
    99,
    Math.max(18, Math.round(52 * weights.agility * levelFactor * seededOffset(2)))
  );
  const intelligence = Math.min(
    99,
    Math.max(18, Math.round(52 * weights.intelligence * levelFactor * seededOffset(3)))
  );
  const defense = Math.min(
    99,
    Math.max(18, Math.round(52 * weights.defense * levelFactor * seededOffset(4)))
  );

  const hp = Math.min(
    999,
    Math.max(110, Math.round((130 + clampedLevel * 6.2) * weights.hp * seededOffset(5)))
  );
  const mp = Math.min(
    999,
    Math.max(45, Math.round((85 + clampedLevel * 5.1) * weights.mp * seededOffset(6)))
  );

  return {
    hp,
    mp,
    strength,
    agility,
    intelligence,
    defense,
  };
}

/**
 * Derives card rarity consistently from character level and overall stat potency.
 */
export function calculateRarity(level: number, stats: CharacterStats): Rarity {
  const coreSum = stats.strength + stats.agility + stats.intelligence + stats.defense;
  const powerScore = level * 1.35 + coreSum * 0.45;

  if (powerScore >= 195 || level >= 78) return 'Legendary';
  if (powerScore >= 152 || level >= 52) return 'Epic';
  if (powerScore >= 112 || level >= 28) return 'Rare';
  return 'Common';
}

/**
 * Generates a personalized multi-part fantasy backstory from predefined templates.
 */
export function generateBackstory(
  name: string,
  title: string,
  characterClass: CharacterClass,
  race: FantasyRace,
  elementalAffinity: ElementalAffinity
): CharacterBackstory {
  const origin = pickRandom(BACKSTORY_ORIGINS[race]);
  const childhood = pickRandom(BACKSTORY_CHILDHOODS[characterClass]);
  const ability = pickRandom(BACKSTORY_ABILITIES[elementalAffinity]);
  const majorEvent = pickRandom(BACKSTORY_EVENTS);
  const mission = pickRandom(BACKSTORY_MISSIONS);

  const fullText = `${origin}, ${name} — known across the marches as ${title} — grew up ${childhood} As an adept of ${elementalAffinity.toLowerCase()} mastery, this ${race.toLowerCase()} ${characterClass.toLowerCase()} ${ability}. ${majorEvent} ${mission}`;

  return {
    origin,
    childhood,
    abilities: `As an adept of ${elementalAffinity.toLowerCase()}, ${name} ${ability}.`,
    majorEvent,
    mission,
    fullText,
  };
}

/**
 * Generates a fresh portrait seed integer for visual variety.
 */
export function generatePortraitSeed(): number {
  return Math.floor(100000 + Math.random() * 899999);
}

/**
 * Generates a complete, cohesive fantasy character with stats, portrait, and backstory.
 */
export function generateCharacter(existingNames: string[] = []): Character {
  const characterClass = pickRandom(CHARACTER_CLASSES);
  const race = pickRandom(FANTASY_RACES);
  const classMeta = CLASS_DATA[characterClass];

  // 70% chance of class-favored element for thematic coherence, 30% wild element
  const elementalAffinity =
    Math.random() < 0.7
      ? pickRandom(classMeta.preferredElements)
      : pickRandom(ELEMENTAL_AFFINITIES);

  const name = generateUniqueName(race, existingNames);
  const title = pickRandom(classMeta.titles);
  const level = Math.floor(8 + Math.random() * 88);
  const statSeed = Math.floor(1 + Math.random() * 100000);
  const stats = generateStatsForClass(characterClass, level, statSeed);
  const rarity = calculateRarity(level, stats);

  const appearance = {
    archetype: pickRandom(APPEARANCE_ARCHETYPES),
    hairStyle: pickRandom(HAIR_CROWN_STYLES),
    eyeColor: pickRandom(EYE_GLOW_STYLES),
    colorTheme: pickRandom(COLOR_THEMES).id,
    accessory: pickRandom(classMeta.accessories),
  };

  const backstory = generateBackstory(
    name,
    title,
    characterClass,
    race,
    elementalAffinity
  );

  return {
    id: `ff-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    name,
    title,
    characterClass,
    race,
    elementalAffinity,
    level,
    rarity,
    appearance,
    stats,
    backstory,
    portraitGenerated: true,
    portraitSeed: generatePortraitSeed(),
    createdAt: Date.now(),
  };
}

/**
 * Creates a clean baseline character for the Reset Character action.
 */
export function createBaselineCharacter(): Character {
  const characterClass: CharacterClass = 'Paladin';
  const race: FantasyRace = 'Human';
  const level = 15;
  const stats = generateStatsForClass(characterClass, level, 4242);

  return {
    id: `ff-${Date.now()}-base`,
    name: 'Aldric Vance',
    title: 'The Oathbound',
    characterClass,
    race,
    elementalAffinity: 'Light',
    level,
    rarity: calculateRarity(level, stats),
    appearance: {
      archetype: 'Androgynous Noble',
      hairStyle: 'Flowing Locks',
      eyeColor: 'Amber',
      colorTheme: 'antique-gold',
      accessory: 'Radiant Halo Crest',
    },
    stats,
    backstory: null,
    portraitGenerated: false,
    portraitSeed: 424211,
    createdAt: Date.now(),
  };
}

/**
 * Checks whether an equivalent character already exists in the saved deck
 * to prevent duplicate saves.
 */
export function isDuplicateCharacter(
  candidate: Character,
  deck: Character[]
): boolean {
  return deck.some(
    (item) =>
      item.id === candidate.id ||
      (item.name.trim().toLowerCase() === candidate.name.trim().toLowerCase() &&
        item.characterClass === candidate.characterClass &&
        item.race === candidate.race &&
        item.title.trim().toLowerCase() === candidate.title.trim().toLowerCase() &&
        item.level === candidate.level)
  );
}
