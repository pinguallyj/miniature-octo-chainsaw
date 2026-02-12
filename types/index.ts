export interface BaseItem {
  id: number;
  createdAt: string;
}

export interface Memory extends BaseItem {
  title: string;
  date: string;
  description: string;
  location?: string;
}

export interface DatePlan extends BaseItem {
  title: string;
  date: string;
  location: string;
  description?: string;
  status: 'Planned' | 'Completed';
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
  dates: DatePlan[];
  restaurants: Restaurant[];
  dateIdeas: DateIdea[];
  books: Book[];
  watch: WatchItem[];
  games: Game[];
}

export type SectionKey = keyof AppData;
export type ItemType = 'memory' | 'date' | 'restaurant' | 'dateIdea' | 'book' | 'watch' | 'game';

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
