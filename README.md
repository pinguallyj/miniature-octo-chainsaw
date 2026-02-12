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
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 19** - Latest React features
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **LocalStorage** - Client-side data persistence

### Browser Support
Works in all modern browsers that support:
- CSS Grid and Flexbox
- LocalStorage API
- ES6+ JavaScript

## Getting Started

### Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**: Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

This app is optimized for deployment on Vercel:

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** to complete deployment

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Vercel will automatically detect Next.js and configure the build settings
6. Click "Deploy"

Your app will be live with a production URL!

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
