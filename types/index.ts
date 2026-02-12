export interface BaseItem {
  id: number;
  createdAt: string;
}

// Memory Album with photos
export interface MemoryAlbum extends BaseItem {
  title: string;
  photos: string[]; // Array of image URLs or base64 strings
  date?: string;
  description?: string;
}

// Date Plan for calendar
export interface DatePlan extends BaseItem {
  title: string;
  date: string; // ISO date string
  time?: string;
  location?: string;
  description?: string;
  status: 'Planned' | 'Completed';
}

// Place with dual ratings and photos
export interface Place extends BaseItem {
  name: string;
  type?: string; // restaurant, cafe, park, museum, etc.
  location?: string;
  photos?: string[];
  instagramPage?: string;
  visited: boolean;
  ratingZ?: number; // 1-5
  ratingS?: number; // 1-5
  description?: string;
}

// Simplified Things to Do items
export interface ThingToDo extends BaseItem {
  name: string;
  category: 'Book' | 'Movie' | 'TV Show' | 'Anime' | 'Game';
  status: 'Want to' | 'In Progress' | 'Completed';
  ratingZ?: number; // 1-5
  ratingS?: number; // 1-5
}

// Legacy types for backward compatibility
export interface Memory extends BaseItem {
  title: string;
  date?: string;
  description?: string;
  location?: string;
  photos?: string[]; // Array of image URLs or base64 strings
}

export interface Restaurant extends BaseItem {
  name: string;
  cuisine: string;
  location: string;
  notes?: string;
  rating?: number;
}

export interface DateIdea extends BaseItem {
  title: string;
  category: 'Indoor' | 'Outdoor' | 'Adventure' | 'Relaxing' | 'Creative' | 'Other';
  description: string;
  estimatedCost?: string;
}

export interface Book extends BaseItem {
  title: string;
  author: string;
  genre?: string;
  status: 'Want to Read' | 'Reading' | 'Completed';
  notes?: string;
}

export interface WatchItem extends BaseItem {
  title: string;
  type: 'Movie' | 'TV Show' | 'Documentary' | 'Anime' | 'Other';
  genre?: string;
  status: 'Want to Watch' | 'Watching' | 'Completed';
  platform?: string;
  notes?: string;
}

export interface Game extends BaseItem {
  title: string;
  type: 'Video Game' | 'Board Game' | 'Card Game' | 'Outdoor Game' | 'Party Game' | 'Other';
  players?: string;
  status: 'Want to Play' | 'Playing' | 'Completed';
  notes?: string;
}

export interface AppData {
  memories: Memory[];
  memoryAlbums?: MemoryAlbum[];
  dates: DatePlan[];
  restaurants: Restaurant[];
  places?: Place[];
  dateIdeas: DateIdea[];
  books: Book[];
  watch: WatchItem[];
  games: Game[];
  thingsToDo?: ThingToDo[];
}

export type SectionKey = keyof AppData;
export type ItemType = 'memory' | 'memoryAlbum' | 'date' | 'restaurant' | 'place' | 'dateIdea' | 'book' | 'watch' | 'game' | 'thingToDo';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'date' | 'datetime-local' | 'textarea' | 'select' | 'number';
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface FormConfig {
  title: string;
  fields: FormField[];
}
