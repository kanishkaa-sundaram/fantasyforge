export type CharacterClass =
  | 'Warrior'
  | 'Mage'
  | 'Rogue'
  | 'Paladin'
  | 'Ranger'
  | 'Druid'
  | 'Necromancer'
  | 'Assassin';

export type FantasyRace =
  | 'Human'
  | 'Elf'
  | 'Dwarf'
  | 'Orc'
  | 'Dragonborn'
  | 'Fairy';

export type ElementalAffinity =
  | 'Fire'
  | 'Frost'
  | 'Lightning'
  | 'Shadow'
  | 'Nature'
  | 'Arcane'
  | 'Light'
  | 'Earth';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export type ColorThemeId =
  | 'antique-gold'
  | 'emerald-verdant'
  | 'abyssal-purple'
  | 'crimson-bronze'
  | 'frost-sapphire'
  | 'ashen-silver';

export type AppearanceArchetype =
  | 'Androgynous Noble'
  | 'Masked Sentinel'
  | 'Mystic Wanderer'
  | 'Battle-Hardened'
  | 'Ethereal Sage'
  | 'Shadow Striker';

export type HairCrownStyle =
  | 'Flowing Locks'
  | 'Braided Crown'
  | 'Hooded Cloak'
  | 'Horned Helm'
  | 'Arcane Circlet'
  | 'Short Crop';

export type EyeGlowStyle =
  | 'Amber'
  | 'Emerald'
  | 'Violet'
  | 'Ice Blue'
  | 'Crimson'
  | 'Silver';

export interface AppearanceOptions {
  archetype: AppearanceArchetype;
  hairStyle: HairCrownStyle;
  eyeColor: EyeGlowStyle;
  colorTheme: ColorThemeId;
  accessory: string;
}

export interface CharacterStats {
  hp: number;
  mp: number;
  strength: number;
  agility: number;
  intelligence: number;
  defense: number;
}

export interface CharacterBackstory {
  origin: string;
  childhood: string;
  abilities: string;
  majorEvent: string;
  mission: string;
  fullText: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  characterClass: CharacterClass;
  race: FantasyRace;
  elementalAffinity: ElementalAffinity;
  level: number;
  rarity: Rarity;
  appearance: AppearanceOptions;
  stats: CharacterStats;
  backstory: CharacterBackstory | null;
  portraitGenerated: boolean;
  portraitSeed: number;
  createdAt: number;
}

export type AppSection = 'home' | 'create' | 'deck' | 'about';

export type ToastTone = 'success' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  tone: ToastTone;
}
