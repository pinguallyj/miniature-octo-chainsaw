import { FormConfig } from '@/types';

export const formConfigs: Record<string, FormConfig> = {
  memory: {
    title: 'Add Memory',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'location', label: 'Location', type: 'text', required: false }
    ]
  },
  date: {
    title: 'Plan Date',
    fields: [
      { name: 'title', label: 'Date Title', type: 'text', required: true },
      { name: 'time', label: 'Time', type: 'text', required: false },
      { name: 'location', label: 'Location', type: 'text', required: false },
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
  place: {
    title: 'Add Place',
    fields: [
      { name: 'name', label: 'Place Name', type: 'text', required: true },
      { name: 'type', label: 'Type (restaurant, cafe, park, etc.)', type: 'text', required: false },
      { name: 'location', label: 'Location/Address', type: 'text', required: false },
      { name: 'instagramPage', label: 'Instagram Page', type: 'text', required: false },
      { name: 'visited', label: 'Visited?', type: 'select', options: ['No', 'Yes'], required: true },
      { name: 'ratingZ', label: "Z's Rating (1-5)", type: 'number', min: 1, max: 5, required: false },
      { name: 'ratingS', label: "S's Rating (1-5)", type: 'number', min: 1, max: 5, required: false },
      { name: 'description', label: 'Description/Notes', type: 'textarea', required: false }
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
      { name: 'name', label: 'Book Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Book'], required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Want to', 'In Progress', 'Completed'], required: true },
      { name: 'ratingZ', label: "Z's Rating (1-5)", type: 'number', min: 1, max: 5, required: false },
      { name: 'ratingS', label: "S's Rating (1-5)", type: 'number', min: 1, max: 5, required: false }
    ]
  },
  watch: {
    title: 'Add Show/Movie',
    fields: [
      { name: 'name', label: 'Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Movie', 'TV Show', 'Anime'], required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Want to', 'In Progress', 'Completed'], required: true },
      { name: 'ratingZ', label: "Z's Rating (1-5)", type: 'number', min: 1, max: 5, required: false },
      { name: 'ratingS', label: "S's Rating (1-5)", type: 'number', min: 1, max: 5, required: false }
    ]
  },
  game: {
    title: 'Add Game',
    fields: [
      { name: 'name', label: 'Game Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Game'], required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Want to', 'In Progress', 'Completed'], required: true },
      { name: 'ratingZ', label: "Z's Rating (1-5)", type: 'number', min: 1, max: 5, required: false },
      { name: 'ratingS', label: "S's Rating (1-5)", type: 'number', min: 1, max: 5, required: false }
    ]
  },
  thingToDo: {
    title: 'Add Thing to Do',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Book', 'Movie', 'TV Show', 'Anime', 'Game'], required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Want to', 'In Progress', 'Completed'], required: true },
      { name: 'ratingZ', label: "Z's Rating (1-5)", type: 'number', min: 1, max: 5, required: false },
      { name: 'ratingS', label: "S's Rating (1-5)", type: 'number', min: 1, max: 5, required: false }
    ]
  }
};
