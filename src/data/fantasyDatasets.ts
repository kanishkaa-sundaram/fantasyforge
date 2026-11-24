import {
  AppearanceArchetype,
  CharacterClass,
  ColorThemeId,
  ElementalAffinity,
  EyeGlowStyle,
  FantasyRace,
  HairCrownStyle,
  Rarity,
} from '../types/character';

export const CHARACTER_CLASSES: CharacterClass[] = [
  'Warrior',
  'Mage',
  'Rogue',
  'Paladin',
  'Ranger',
  'Druid',
  'Necromancer',
  'Assassin',
];

export const FANTASY_RACES: FantasyRace[] = [
  'Human',
  'Elf',
  'Dwarf',
  'Orc',
  'Dragonborn',
  'Fairy',
];

export const ELEMENTAL_AFFINITIES: ElementalAffinity[] = [
  'Fire',
  'Frost',
  'Lightning',
  'Shadow',
  'Nature',
  'Arcane',
  'Light',
  'Earth',
];

export const APPEARANCE_ARCHETYPES: AppearanceArchetype[] = [
  'Androgynous Noble',
  'Masked Sentinel',
  'Mystic Wanderer',
  'Battle-Hardened',
  'Ethereal Sage',
  'Shadow Striker',
];

export const HAIR_CROWN_STYLES: HairCrownStyle[] = [
  'Flowing Locks',
  'Braided Crown',
  'Hooded Cloak',
  'Horned Helm',
  'Arcane Circlet',
  'Short Crop',
];

export const EYE_GLOW_STYLES: EyeGlowStyle[] = [
  'Amber',
  'Emerald',
  'Violet',
  'Ice Blue',
  'Crimson',
  'Silver',
];

export interface ColorThemeConfig {
  id: ColorThemeId;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  bgTop: string;
  bgBottom: string;
  cloak: string;
  metal: string;
}

export const COLOR_THEMES: ColorThemeConfig[] = [
  {
    id: 'antique-gold',
    label: 'Antique Gold & Obsidian',
    primary: '#d4a853',
    secondary: '#7a5425',
    accent: '#f5d487',
    bgTop: '#241a35',
    bgBottom: '#110d1b',
    cloak: '#2e223d',
    metal: '#d4a853',
  },
  {
    id: 'emerald-verdant',
    label: 'Emerald Verdant',
    primary: '#10b981',
    secondary: '#065f46',
    accent: '#6ee7b7',
    bgTop: '#102624',
    bgBottom: '#0a1514',
    cloak: '#15362e',
    metal: '#c89b4b',
  },
  {
    id: 'abyssal-purple',
    label: 'Abyssal Violet',
    primary: '#8b5cf6',
    secondary: '#4c1d95',
    accent: '#c4b5fd',
    bgTop: '#251542',
    bgBottom: '#100a1f',
    cloak: '#311b54',
    metal: '#b89f6d',
  },
  {
    id: 'crimson-bronze',
    label: 'Crimson Bronze',
    primary: '#cd6142',
    secondary: '#742c1c',
    accent: '#f2a27d',
    bgTop: '#2b161b',
    bgBottom: '#140b0e',
    cloak: '#471e23',
    metal: '#b87d4b',
  },
  {
    id: 'frost-sapphire',
    label: 'Frost Sapphire',
    primary: '#38bdf8',
    secondary: '#1e40af',
    accent: '#bae6fd',
    bgTop: '#12223a',
    bgBottom: '#09111f',
    cloak: '#1b3152',
    metal: '#cbd5e1',
  },
  {
    id: 'ashen-silver',
    label: 'Ashen Silver',
    primary: '#94a3b8',
    secondary: '#475569',
    accent: '#e2e8f0',
    bgTop: '#1f232e',
    bgBottom: '#0e1017',
    cloak: '#2a303d',
    metal: '#b4bcc8',
  },
];

export const EYE_COLOR_HEX: Record<EyeGlowStyle, string> = {
  Amber: '#f59e0b',
  Emerald: '#34d399',
  Violet: '#a78bfa',
  'Ice Blue': '#7dd3fc',
  Crimson: '#f87171',
  Silver: '#e2e8f0',
};

export interface ClassMetadata {
  name: CharacterClass;
  roleSummary: string;
  statWeights: {
    hp: number;
    mp: number;
    strength: number;
    agility: number;
    intelligence: number;
    defense: number;
  };
  titles: string[];
  accessories: string[];
  preferredElements: ElementalAffinity[];
}

export const CLASS_DATA: Record<CharacterClass, ClassMetadata> = {
  Warrior: {
    name: 'Warrior',
    roleSummary: 'Frontline vanguard wielding heavy steel and unbroken resolve.',
    statWeights: { hp: 1.35, mp: 0.45, strength: 1.35, agility: 0.78, intelligence: 0.55, defense: 1.3 },
    titles: ['The Oathbound', 'Breaker of Shields', 'Iron Vanguard', 'Sentinel of the Pass', 'Banner-Bearer'],
    accessories: ['Greatsword Hilt', 'Spiked Pauldrons', 'War-Horn Mantle', 'Lionheart Medallion'],
    preferredElements: ['Fire', 'Earth', 'Lightning'],
  },
  Mage: {
    name: 'Mage',
    roleSummary: 'Scholar of high sorcery weaving raw leyline currents into spells.',
    statWeights: { hp: 0.72, mp: 1.45, strength: 0.45, agility: 0.75, intelligence: 1.4, defense: 0.62 },
    titles: ['Archivist of Ash', 'Weaver of the Astral Loom', 'Keeper of Runes', 'Starbound Scholar', 'Flame-Scribe'],
    accessories: ['Floating Arcane Orb', 'Runed Staff Crest', 'Astrolabe Collar', 'Celestial Mantle'],
    preferredElements: ['Arcane', 'Fire', 'Frost', 'Lightning'],
  },
  Rogue: {
    name: 'Rogue',
    roleSummary: 'Nimble opportunists thriving in twilight alleys and vaulted ruins.',
    statWeights: { hp: 0.88, mp: 0.65, strength: 0.82, agility: 1.4, intelligence: 0.9, defense: 0.75 },
    titles: ['Whisper of the Docks', 'Gilded Phantom', 'Night-Ledger', 'Lockbreaker', 'Velvet Blade'],
    accessories: ['Twin Belt Daggers', 'Velvet Half-Mask', 'Silver Coin Charm', 'Leather Bandolier'],
    preferredElements: ['Shadow', 'Lightning', 'Frost'],
  },
  Paladin: {
    name: 'Paladin',
    roleSummary: 'Sworn templar channeling radiant vows through consecrated armor.',
    statWeights: { hp: 1.28, mp: 0.95, strength: 1.15, agility: 0.68, intelligence: 0.95, defense: 1.35 },
    titles: ['Dawnbringer', 'Shield of the Sanctum', 'Beacon of the Vigil', 'Oathkeeper', 'Sun-Templar'],
    accessories: ['Radiant Halo Crest', 'Winged Pauldrons', 'Sanctified Seal', 'Gilded War-Mace'],
    preferredElements: ['Light', 'Fire', 'Earth'],
  },
  Ranger: {
    name: 'Ranger',
    roleSummary: 'Keen-eyed outrider reading wind, track, and distant horizons.',
    statWeights: { hp: 0.95, mp: 0.78, strength: 0.95, agility: 1.32, intelligence: 0.88, defense: 0.85 },
    titles: ['Warden of the Thornwood', 'Far-Watcher', 'Gale-Arrow', 'Pathfinder', 'Horizon Stalker'],
    accessories: ['Yew Longbow & Quiver', 'Compass Brooch', 'Feathered Cloak Clasp', 'Hawkeye Bracer'],
    preferredElements: ['Nature', 'Lightning', 'Frost'],
  },
  Druid: {
    name: 'Druid',
    roleSummary: 'Ancient circle guardian attuned to root, tempest, and seasonal cycle.',
    statWeights: { hp: 1.05, mp: 1.25, strength: 0.72, agility: 0.85, intelligence: 1.25, defense: 0.95 },
    titles: ['Voice of the Old Grove', 'Root-Speaker', 'Storm-Shepherd', 'Verdant Oracle', 'Moss-Walker'],
    accessories: ['Antler Totem Mantle', 'Amber Sap Vial', 'Living Vine Staff', 'Moonstone Pendant'],
    preferredElements: ['Nature', 'Earth', 'Frost', 'Lightning'],
  },
  Necromancer: {
    name: 'Necromancer',
    roleSummary: 'Binder of lingering echoes who bargains with dusk and bone.',
    statWeights: { hp: 0.82, mp: 1.42, strength: 0.5, agility: 0.7, intelligence: 1.38, defense: 0.72 },
    titles: ['Cantor of the Ossuary', 'Pale Lantern', 'Soul-Binder', 'Ashen Prelate', 'Grave-Scholar'],
    accessories: ['Soul Lantern', 'Bone-Ribbed Mantle', 'Spectral Wisps', 'Obsidian Phylactery'],
    preferredElements: ['Shadow', 'Frost', 'Arcane'],
  },
  Assassin: {
    name: 'Assassin',
    roleSummary: 'Silent executioner striking once from blind spots and mist.',
    statWeights: { hp: 0.85, mp: 0.78, strength: 1.05, agility: 1.45, intelligence: 0.95, defense: 0.68 },
    titles: ['The Quiet Bell', 'Umbral Fang', 'Nightshade Envoy', 'Veil-Cutter', 'Crimson Echo'],
    accessories: ['Curved Twin Blades', 'Shadow Veil', 'Venom Vial Band', 'Obsidian Hood'],
    preferredElements: ['Shadow', 'Fire', 'Frost'],
  },
};

export interface RaceMetadata {
  name: FantasyRace;
  skinTone: string;
  skinShadow: string;
  earStyle: 'round' | 'pointed' | 'long-pointed' | 'orc' | 'horned' | 'fairy';
  nameFirstParts: string[];
  nameSecondParts: string[];
  singleNames: string[];
}

export const RACE_DATA: Record<FantasyRace, RaceMetadata> = {
  Human: {
    name: 'Human',
    skinTone: '#d9b293',
    skinShadow: '#b08264',
    earStyle: 'round',
    nameFirstParts: ['Al', 'Cor', 'Val', 'Row', 'Mar', 'Ser', 'Eld', 'Luc', 'Garr', 'Hal', 'Vey', 'Cas'],
    nameSecondParts: ['ric', 'en', 'ian', 'ora', 'yn', 'eth', 'ard', 'is', 'on', 'aine', 'mir', 'en'],
    singleNames: ['Aldric Vance', 'Seren Vale', 'Corvin Holt', 'Elara Thorne', 'Gideon Kestrel', 'Rowan Mercer'],
  },
  Elf: {
    name: 'Elf',
    skinTone: '#e6ccb8',
    skinShadow: '#be9d89',
    earStyle: 'long-pointed',
    nameFirstParts: ['Ael', 'Syl', 'Thal', 'Lir', 'Fae', 'Cael', 'Elen', 'Vael', 'Oroph', 'Myr', 'Sari', 'Nyr'],
    nameSecondParts: ['ion', 'riel', 'indra', 'anis', 'eth', 'oril', 'wen', 'ael', 'aryn', 'iel', 'os', 'ea'],
    singleNames: ['Aelarion Whisperwind', 'Sylvaria Dawnleaf', 'Thalindor Silverveil', 'Lirael Starbrook', 'Vaelis Moonspire'],
  },
  Dwarf: {
    name: 'Dwarf',
    skinTone: '#cfa082',
    skinShadow: '#9e6f54',
    earStyle: 'round',
    nameFirstParts: ['Thor', 'Bram', 'Khar', 'Dain', 'Bryn', 'Grom', 'Thrain', 'Or', 'Dur', 'Kaz', 'Helg', 'Tor'],
    nameSecondParts: ['in', 'gar', 'rik', 'ora', 'mir', 'dun', 'rak', 'grim', 'bold', 'hild', 'orn', 'ak'],
    singleNames: ['Thorin Ironvein', 'Brynja Stonehearth', 'Khardin Deepforge', 'Dain Copperbraid', 'Helga Anvilborn'],
  },
  Orc: {
    name: 'Orc',
    skinTone: '#6f8b61',
    skinShadow: '#496140',
    earStyle: 'orc',
    nameFirstParts: ['Grim', 'Krag', 'Zul', 'Mok', 'Vorg', 'Shag', 'Gor', 'Drak', 'Urz', 'Thok', 'Khar', 'Ruk'],
    nameSecondParts: ['ash', 'tar', 'gul', 'nak', 'mar', 'gash', 'zar', 'rok', 'ka', 'gor', 'shak', 'ruk'],
    singleNames: ['Kragash Ironjaw', 'Zulgor Bloodtusk', 'Mokara Ashhide', 'Vorgath Stormcleaver', 'Urzaka Frostfang'],
  },
  Dragonborn: {
    name: 'Dragonborn',
    skinTone: '#9e5c47',
    skinShadow: '#693627',
    earStyle: 'horned',
    nameFirstParts: ['Bal', 'Rhog', 'Vyr', 'Kriv', 'Sora', 'Drax', 'Akra', 'Mish', 'Zyr', 'Tor', 'Ign', 'Kael'],
    nameSecondParts: ['asar', 'ax', 'ath', 'ann', 'esh', 'ir', 'ith', 'orn', 'yx', 'arion', 'os', 'ura'],
    singleNames: ['Balasar Embercrest', 'Soraith Ashwing', 'Rhogar Scaleborne', 'Vyrith Goldscale', 'Akrax Stormbreath'],
  },
  Fairy: {
    name: 'Fairy',
    skinTone: '#e5d4e8',
    skinShadow: '#b79ec2',
    earStyle: 'fairy',
    nameFirstParts: ['Lumi', 'Pip', 'Vesp', 'Nym', 'Tali', 'Fael', 'Bram', 'Zephy', 'Glim', 'Cora', 'Moth', 'Briar'],
    nameSecondParts: ['elle', 'wick', 'era', 'phie', 'lin', 'wing', 'mist', 'ra', 'glow', 'bell', 'ia', 'yn'],
    singleNames: ['Vespera Dewveil', 'Lumira Moonwing', 'Nymphia Briarspark', 'Zephyra Mistpetal', 'Talilin Glowreed'],
  },
};

export const RARITY_CONFIG: Record<
  Rarity,
  {
    label: Rarity;
    borderColor: string;
    accentColor: string;
    surfaceBg: string;
    glowClass: string;
    rankOrder: number;
  }
> = {
  Common: {
    label: 'Common',
    borderColor: 'border-slate-500/45',
    accentColor: 'text-slate-300',
    surfaceBg: 'bg-slate-800/45',
    glowClass: 'fantasy-card-glow-common',
    rankOrder: 1,
  },
  Rare: {
    label: 'Rare',
    borderColor: 'border-emerald-500/55',
    accentColor: 'text-emerald-300',
    surfaceBg: 'bg-emerald-950/35',
    glowClass: 'fantasy-card-glow-rare',
    rankOrder: 2,
  },
  Epic: {
    label: 'Epic',
    borderColor: 'border-violet-400/60',
    accentColor: 'text-violet-300',
    surfaceBg: 'bg-violet-950/35',
    glowClass: 'fantasy-card-glow-epic',
    rankOrder: 3,
  },
  Legendary: {
    label: 'Legendary',
    borderColor: 'border-[#d4a853]/80',
    accentColor: 'text-[#f0cb78]',
    surfaceBg: 'bg-[#2a1f10]/45',
    glowClass: 'fantasy-card-glow-legendary',
    rankOrder: 4,
  },
};

export const BACKSTORY_ORIGINS: Record<FantasyRace, string[]> = {
  Human: [
    'Born in the slate-roofed frontier city of Highwatch where river barges trade steel and salt',
    'Raised among the lantern-lit watchtowers of the Redcrest Marches',
    'Hailing from the windswept coastal barony of Oakhaven along the Western Reach',
  ],
  Elf: [
    'Born beneath the silver-leaved canopy of Lothalor during an autumn starfall',
    'Raised in the marble terraces of the Moonspire Academy above the mist',
    'Hailing from the timeless cedar sanctuaries bordering the Astral Veil',
  ],
  Dwarf: [
    'Born deep within the basalt halls of Kazad-Thrum where magma rivers warm the great bellows',
    'Raised in the terraced copper mines of Mount Ironcrown above the cloudline',
    'Hailing from the ancestral stone vaults of Grimhold beneath the Frostpeaks',
  ],
  Orc: [
    'Born in the storm-swept Red Steppe amidst migrating war-clans and drum-towers',
    'Raised along the obsidian canyons of Ashgarde where only the steadfast endure',
    'Hailing from the highland bastions of Craghold overlooking the Shattered Plains',
  ],
  Dragonborn: [
    'Hatched inside the Sun-Kiln Citadel where ancient draconic glyphs still smolder in brass',
    'Raised among the cliffside eyries of the Wyrmspine Range',
    'Hailing from the gilded spire-city of Ignis-Vael beside the Obsidian Sea',
  ],
  Fairy: [
    'Born within a hollowed moon-oak at the heart of the Whispering Fen',
    'Raised amidst the bioluminescent lantern-groves of the Sylvan Mirror',
    'Hailing from the high gossamer courts suspended above the Thornwood Mist',
  ],
};

export const BACKSTORY_CHILDHOODS: Record<CharacterClass, string[]> = {
  Warrior: [
    'apprenticed at dawn to a retired siege-captain, hauling shield-wood and memorizing battlefield formations before learning to read.',
    'spending youth guarding mountain caravans, mastering the weight of iron long before reaching full stature.',
  ],
  Mage: [
    'sneaking into restricted scriptoria by candlelight to copy fractured incantations onto salvaged parchment.',
    'serving as ink-bearer to an eccentric archivist who tested patience with shifting labyrinthine bookshelves.',
  ],
  Rogue: [
    'navigating chimney-tops and dockside smugglers’ alleys, trading whispered secrets for warm bread and forged passes.',
    'learning sleight of hand from traveling illusionists while keeping one eye fixed on every purse and bolted door.',
  ],
  Paladin: [
    'taking sanctuary vows inside a battered frontier abbey, tending wounded pilgrims and polishing tarnished reliquaries.',
    'training beside temple sentinels who taught that discipline of spirit outweighs the thickest breastplate.',
  ],
  Ranger: [
    'tracking winter wolves across silent pine ridges with nothing more than a yew bow and pine-resin fletching.',
    'living alongside borderland scouts, learning to read broken twigs, distant smoke, and shifts in the wind.',
  ],
  Druid: [
    'listening to the slow pulse of ancient standing stones while tending wounded beasts during harsh winters.',
    'wandering seasonal pilgrim trails, weaving herbal poultices and memorizing the forgotten names of rivers.',
  ],
  Necromancer: [
    'cataloguing weathered tombstones in fog-bound catacombs where echoes answered questions the living feared to ask.',
    'studying forbidden anatomical treatises in an isolated bell-tower after surviving a winter plague.',
  ],
  Assassin: [
    'drilled in complete silence inside a hidden courtyard where a single creaking floorboard meant beginning anew.',
    'surviving on rooftops as a nameless courier for rival guildhouses until blades replaced letters.',
  ],
};

export const BACKSTORY_ABILITIES: Record<ElementalAffinity, string[]> = {
  Fire: [
    'channels searing ember-arcs that ignite blades and turn defensive shields into blazing bulwarks',
    'summons disciplined tongues of hearth-flame capable of melting locks or scorching an advancing line',
  ],
  Frost: [
    'condenses biting glacial mist around every strike, slowing foes with crystalline rime',
    'weaves winter stillness into shields of pale ice that shatter incoming blows into harmless snow',
  ],
  Lightning: [
    'calls crackling arc-currents along metal and air, accelerating reflexes to blinding speeds',
    'strikes with sudden thunder-pulses that disrupt spellcasters and stun armored chargers',
  ],
  Shadow: [
    'folds ambient twilight around their silhouette, slipping between torchbeams unseen',
    'lashes out with blades of condensed dusk that bypass conventional steel',
  ],
  Nature: [
    'awakens dormant roots and briar-thorns in an instant, mending allies with verdant vitality',
    'commands wind-borne pollen and living bark to shield companions and entangle pursuers',
  ],
  Arcane: [
    'distorts raw leyline geometry into shimmering barriers and pinpoint force-lances',
    'unravels hostile enchantments mid-flight, bending ambient mana to their quiet will',
  ],
  Light: [
    'projects steady golden radiance that banishes dread and knits shattered morale on the field',
    'anchors consecrated wards of dawn-fire that sear corrupted creatures on contact',
  ],
  Earth: [
    'draws granite resilience from the ground beneath, anchoring their stance against monstrous impacts',
    'reshapes fractured stone into jagged bulwarks and tremor-charged strikes',
  ],
};

export const BACKSTORY_EVENTS: string[] = [
  'When the Crimson Eclipse shattered the border citadel, they held the eastern bridge alone until the last civilian crossed safely.',
  'During an expedition into the Sunken Vaults, an ancient seal bound itself to their pulse, marking them as its reluctant custodian.',
  'After uncovering a royal conspiracy etched into stolen tax ledgers, they fled into exile with a price forged in silver upon their name.',
  'In the aftermath of the Hollow Winter, they rescued a stranded vanguard using a forbidden relic that left an indelible mark on their craft.',
  'When a rogue leyline storm tore open the sky above their homeland, they stepped into the breach and emerged forever changed.',
  'Betrayed by a sworn mentor at the Siege of Ashspire, they survived the ruins and reclaimed the shattered insignia of their order.',
];

export const BACKSTORY_MISSIONS: string[] = [
  'Now they roam the fractured realms seeking the three lost keystone sigils before the sleeping titan beneath the shelf awakens.',
  'Today they walk the borderlands hunting the syndicate responsible for burning their home archive, swearing no oath left unfulfilled.',
  'Driven by a quiet vow, they gather scattered relics of the First Covenant to forge a sanctuary beyond the reach of warring crowns.',
  'Bound to an ancient compass that points only toward rising peril, they intervene wherever fragile kingdoms stand on the brink.',
  'They seek an audience with the High Conclave to expose the shadow-pact corrupting the realm’s oldest bloodlines.',
  'Until every captive comrade is returned from the Obsidian Reach, they refuse to lay down their arms or accept a quiet hearth.',
];
