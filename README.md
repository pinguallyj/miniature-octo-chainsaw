# Our Space ♡

A minimalistic and aesthetic couple sharing app where two people can share memories, plan dates, and keep track of activities they want to do together.

## Features

### 📸 Memories
- Store and cherish your favorite moments together
- Add titles, dates, descriptions, and locations
- Beautiful card-based layout for easy browsing

### 📅 Date Plans
- Plan upcoming dates with date, time, and location
- Track date status (Planned/Completed)
- Add detailed notes for each date

### 🍽️ Restaurants
- Keep a list of restaurants you want to try
- Organize by cuisine type
- Add ratings and personal notes

### 💡 Date Ideas
- Brainstorm and save creative date ideas
- Categorize by type (Indoor, Outdoor, Adventure, etc.)
- Track estimated costs

### 📚 Books to Read
- Maintain a shared reading list
- Track reading status (Want to Read, Reading, Completed)
- Add notes and genres

### 🎬 Watch Together
- List movies and TV shows to watch together
- Organize by type and genre
- Track viewing status and streaming platforms

### 🎮 Games
- Keep track of games to play together
- Support for video games, board games, card games, and more
- Track game status and player information

## Design Philosophy

The app features a **minimalistic and aesthetic design** with:
- Soft pastel color palette (pinks, greens, and creams)
- Clean typography and generous white space
- Smooth animations and transitions
- Responsive design for mobile and desktop
- Card-based layouts for easy content browsing

## Technical Details

### Built With
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** - No frameworks or dependencies
- **LocalStorage** - Client-side data persistence

### Browser Support
Works in all modern browsers that support:
- CSS Grid and Flexbox
- LocalStorage API
- ES6 JavaScript

## Getting Started

1. **Open the app**: Simply open `index.html` in your web browser
2. **Start adding content**: Click any navigation button and use the "+" button to add items
3. **Your data is saved**: All data is automatically saved to your browser's local storage

## Usage

### Adding Items
1. Click on any category in the navigation bar
2. Click the "+ Add" button
3. Fill out the form
4. Click "Save"

### Deleting Items
- Click the "×" button on any card to remove it

### Navigation
- Use the navigation buttons at the top to switch between categories
- All sections are accessible with smooth transitions

## Data Storage

All data is stored locally in your browser using LocalStorage. This means:
- ✅ Your data persists between sessions
- ✅ No server or account required
- ✅ Complete privacy - data never leaves your device
- ⚠️ Data is browser-specific (won't sync across devices)
- ⚠️ Clearing browser data will delete all saved items

## Customization

### Colors
The color scheme can be easily customized by modifying CSS variables in `styles.css`:

```css
:root {
    --primary: #f4a6b8;      /* Soft pink */
    --secondary: #d4a5a5;    /* Rose */
    --accent: #9ec5ab;       /* Sage green */
    --bg-primary: #fefefe;   /* White */
    --bg-secondary: #faf8f6; /* Cream */
}
```

### Adding New Categories
To add new categories, update:
1. Navigation buttons in `index.html`
2. Form configuration in `script.js` (formConfigs object)
3. Data structure in `script.js` (data object)

## Mobile Responsive

The app is fully responsive and works beautifully on:
- Desktop computers
- Tablets
- Mobile phones

## Future Enhancements

Possible features to add:
- Image uploads for memories
- Export/import data functionality
- Dark mode toggle
- Cloud sync between devices
- Collaborative features for real-time updates
- Photo galleries
- Calendar view for dates

## License

This project is open source and available for personal use.

## Credits

Created with ♡ for couples who want to cherish their moments together.
