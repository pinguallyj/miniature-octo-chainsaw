export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getSectionKey(type: string): string {
  const mapping: Record<string, string> = {
    'memory': 'memories',
    'memoryAlbum': 'memoryAlbums',
    'date': 'dates',
    'restaurant': 'restaurants',
    'place': 'places',
    'dateIdea': 'dateIdeas',
    'book': 'books',
    'watch': 'watch',
    'game': 'games',
    'thingToDo': 'thingsToDo'
  };
  return mapping[type] || type + 's';
}
