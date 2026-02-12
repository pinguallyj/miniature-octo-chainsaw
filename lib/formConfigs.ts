import { FormConfig } from '@/types';

export const formConfigs: Record<string, FormConfig> = {
  memory: {
    title: 'Add Memory',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'location', label: 'Location', type: 'text', required: false }
    ]
  },
  date: {
    title: 'Plan Date',
    fields: [
      { name: 'title', label: 'Date Title', type: 'text', required: true },
      { name: 'date', label: 'Date & Time', type: 'datetime-local', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'description', label: 'Details', type: 'textarea', required: false },
      { name: 'status', label: 'Status', type: 'select', options: ['Planned', 'Completed'], required: true }
    ]
  },
  restaurant: {
    title: 'Add Restaurant',
    fields: [
      { name: 'name', label: 'Restaurant Name', type: 'text', required: true },
      { name: 'cuisine', label: 'Cuisine Type', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'notes', label: 'Notes', type: 'textarea', required: false },
      { name: 'rating', label: 'Rating (1-5)', type: 'number', min: 1, max: 5, required: false }
    ]
  },
  dateIdea: {
    title: 'Add Date Idea',
    fields: [
      { name: 'title', label: 'Idea Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Indoor', 'Outdoor', 'Adventure', 'Relaxing', 'Creative', 'Other'], required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'estimatedCost', label: 'Estimated Cost', type: 'text', required: false }
    ]
  },
  book: {
    title: 'Add Book',
    fields: [
      { name: 'title', label: 'Book Title', type: 'text', required: true },
      { name: 'author', label: 'Author', type: 'text', required: true },
      { name: 'genre', label: 'Genre', type: 'text', required: false },
      { name: 'status', label: 'Status', type: 'select', options: ['Want to Read', 'Reading', 'Completed'], required: true },
      { name: 'notes', label: 'Notes', type: 'textarea', required: false }
    ]
  },
  watch: {
    title: 'Add Show/Movie',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['Movie', 'TV Show', 'Documentary', 'Anime', 'Other'], required: true },
      { name: 'genre', label: 'Genre', type: 'text', required: false },
      { name: 'status', label: 'Status', type: 'select', options: ['Want to Watch', 'Watching', 'Completed'], required: true },
      { name: 'platform', label: 'Platform', type: 'text', required: false },
      { name: 'notes', label: 'Notes', type: 'textarea', required: false }
    ]
  },
  game: {
    title: 'Add Game',
    fields: [
      { name: 'title', label: 'Game Title', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['Video Game', 'Board Game', 'Card Game', 'Outdoor Game', 'Party Game', 'Other'], required: true },
      { name: 'players', label: 'Players', type: 'text', required: false },
      { name: 'status', label: 'Status', type: 'select', options: ['Want to Play', 'Playing', 'Completed'], required: true },
      { name: 'notes', label: 'Notes', type: 'textarea', required: false }
    ]
  }
};
