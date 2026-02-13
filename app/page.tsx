'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useServerStorage} from "@/lib/useServerStorage";
import { formConfigs } from '@/lib/formConfigs';
import { formatDate, formatDateTime, getSectionKey } from '@/lib/utils';
import { AppData, ItemType, Memory, DatePlan, Restaurant, DateIdea, Book, WatchItem, Game } from '@/types';
import MonthGrid from '@/components/MonthGrid';
import MonthView from '@/components/MonthView';
import Timeline from '@/components/Timeline';
import LatestMemory from '@/components/LatestMemory';

const initialData: AppData = {
  memories: [],
  memoryAlbums: [],
  dates: [],
  restaurants: [],
  places: [],
  dateIdeas: [],
  books: [],
  watch: [],
  games: [],
  thingsToDo: []
};

export default function Home() {
    const [data, setData, isLoaded] = useServerStorage<AppData>(initialData);
  const [currentView, setCurrentView] = useState<'landing' | 'content'>('landing');
  const [currentSection, setCurrentSection] = useState<string>('memories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<ItemType | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [deletedPhotoIndices, setDeletedPhotoIndices] = useState<number[]>([]);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

  // New state for memories reorganization
  const [memoryView, setMemoryView] = useState<'grid' | 'month' | 'timeline'>('grid');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const navigateToSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    setCurrentView('content');
    // Reset memory view when navigating to memories section
    if (sectionId === 'memories') {
      setMemoryView('grid');
      setSelectedMonth(null);
    }
  };

  const openModal = (type: ItemType, item?: any) => {
    setCurrentType(type);
    setEditingItem(item || null);
    setUploadedPhotos([]);
    setDeletedPhotoIndices([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentType(null);
    setSelectedDate(null);
    setEditingItem(null);
    setUploadedPhotos([]);
    setDeletedPhotoIndices([]);
    // Don't reset selectedMonth/selectedYear here - keep them so we stay in the month view
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const photoPromises = Array.from(files).map(async (file) => {
        let fileToUpload = file;

        // Compress image if it's larger than 1MB
        if (file.size > 1024 * 1024) {
          const compressionOptions = {
            maxSizeMB: 1, // Target 1MB max
            maxWidthOrHeight: 1920, // Max dimension
            useWebWorker: true,
            fileType: file.type as any,
          };

          try {
            fileToUpload = await imageCompression(file, compressionOptions);
            console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
          } catch (compressionError) {
            console.error('Compression error:', compressionError);
            // If compression fails, try to upload original if under 4MB
            if (file.size > 4 * 1024 * 1024) {
              throw new Error(`File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)}MB) and compression failed`);
            }
          }
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
        return data.url;
      });

      const photos = await Promise.all(photoPromises);
      setUploadedPhotos(prev => [...prev, ...photos]);
    } catch (error) {
      console.error('Photo upload error:', error);
      alert('Failed to upload photos. Please make sure Vercel Blob is configured.');
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentType) return;

    const formData = new FormData(e.currentTarget);
    const item: any = editingItem ? { ...editingItem } : {
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    // Add selected date if it exists (from calendar)
    if (selectedDate && currentType === 'date') {
      item.date = selectedDate;
    }

    for (let [key, value] of formData.entries()) {
      if (key === 'visited') {
        item[key] = value === 'Yes';
      } else if (key === 'ratingZ' || key === 'ratingS' || key === 'rating') {
        item[key] = value ? Number(value) : undefined;
      } else {
        item[key] = value;
      }
    }

    // Add photos for memories
    if (currentType === 'memory') {
      const existingPhotos = editingItem?.photos || [];
      // Filter out deleted photos
      const remainingPhotos = existingPhotos.filter((_: string, idx: number) => !deletedPhotoIndices.includes(idx));
      item.photos = [...remainingPhotos, ...uploadedPhotos];

      // Set month/year based on selected month or current date
      if (selectedMonth && selectedYear) {
        item.month = selectedMonth;
        item.year = selectedYear;
      } else if (!item.month || !item.year) {
        const now = new Date();
        item.month = now.getMonth() + 1;
        item.year = now.getFullYear();
      }
    }

    const sectionKey = getSectionKey(currentType) as keyof AppData;
    const currentArray = data[sectionKey] || [];

    if (editingItem) {
      // Update existing item
      setData({
        ...data,
        [sectionKey]: currentArray.map((i: any) => i.id === item.id ? item : i)
      });
    } else {
      // Add new item
      setData({
        ...data,
        [sectionKey]: [...currentArray, item]
      });
    }

    closeModal();
    e.currentTarget.reset();
  };

  const deleteItem = (type: ItemType, id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    const sectionKey = getSectionKey(type) as keyof AppData;
    const currentArray = data[sectionKey] || [];
    setData({
      ...data,
      [sectionKey]: currentArray.filter((item: any) => item.id !== id)
    });
  };

  const renderCard = (item: any, type: ItemType) => {
    let content;

    switch (type) {
      case 'memory':
        const memory = item as Memory;
        content = (
          <>
            <div className="card-header">
              <div>
                <h3>{memory.title}</h3>
                {memory.date && <p className="card-date">{formatDate(memory.date)}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button className="edit-btn" onClick={() => openModal(type, memory)}>✎</button>
                <button className="delete-btn" onClick={() => deleteItem(type, memory.id)}>×</button>
              </div>
            </div>
            {memory.description && <p>{memory.description}</p>}
            {memory.location && <p><strong>📍 {memory.location}</strong></p>}
            {memory.photos && memory.photos.length > 0 && (
              <div className="photo-gallery">
                {memory.photos.map((photo, idx) => (
                  <div key={idx} className="photo-item" onClick={() => setZoomedPhoto(photo)}>
                    <img src={photo} alt={`${memory.title} ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </>
        );
        break;

      case 'restaurant':
        const restaurant = item as Restaurant;
        content = (
          <>
            <div className="card-header">
              <div>
                <h3>{restaurant.name}</h3>
                <p className="card-date">{restaurant.cuisine}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button className="edit-btn" onClick={() => openModal(type, restaurant)}>✎</button>
                <button className="delete-btn" onClick={() => deleteItem(type, restaurant.id)}>×</button>
              </div>
            </div>
            <p>📍 {restaurant.location}</p>
            {restaurant.rating && <p>⭐ {restaurant.rating}/5</p>}
            {restaurant.notes && <p>{restaurant.notes}</p>}
          </>
        );
        break;

      case 'place':
        const place = item as any;
        const placeAvgRating = place.ratingZ && place.ratingS ?
          ((Number(place.ratingZ) + Number(place.ratingS)) / 2).toFixed(1) : null;
        content = (
          <>
            <div className="card-header">
              <div>
                <h3>{place.name}</h3>
                <p className="card-date">{place.type || 'Place'}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button className="edit-btn" onClick={() => openModal(type, place)}>✎</button>
                <button className="delete-btn" onClick={() => deleteItem(type, place.id)}>×</button>
              </div>
            </div>
            {place.location && <p>📍 {place.location}</p>}
            {place.instagramPage && <p>📸 <a href={`https://instagram.com/${place.instagramPage.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{color: 'var(--retro-purple)', textDecoration: 'underline'}}>{place.instagramPage}</a></p>}
            <span className={`card-status ${place.visited ? 'completed' : 'pending'}`}>
              {place.visited ? 'Visited ✓' : 'Not Visited'}
            </span>
            {place.visited && (place.ratingZ || place.ratingS) && (
              <div style={{ marginTop: '0.8rem', fontSize: '0.9rem' }}>
                {place.ratingZ && <p>⭐ Z: {place.ratingZ}/5</p>}
                {place.ratingS && <p>⭐ S: {place.ratingS}/5</p>}
                {placeAvgRating && <p><strong>📊 Avg: {placeAvgRating}/5</strong></p>}
              </div>
            )}
            {place.description && <p style={{ marginTop: '0.8rem' }}>{place.description}</p>}
          </>
        );
        break;

      case 'dateIdea':
        const dateIdea = item as DateIdea;
        content = (
          <>
            <div className="card-header">
              <div>
                <h3>{dateIdea.title}</h3>
                <span className="card-status">{dateIdea.category}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button className="edit-btn" onClick={() => openModal(type, dateIdea)}>✎</button>
                <button className="delete-btn" onClick={() => deleteItem(type, dateIdea.id)}>×</button>
              </div>
            </div>
            <p>{dateIdea.description}</p>
            {dateIdea.estimatedCost && <p><strong>💰 {dateIdea.estimatedCost}</strong></p>}
          </>
        );
        break;

      case 'book':
      case 'watch':
      case 'game':
        const thingItem = item as any;
        const avgRating = thingItem.ratingZ && thingItem.ratingS ?
          ((Number(thingItem.ratingZ) + Number(thingItem.ratingS)) / 2).toFixed(1) : null;
        content = (
          <>
            <div className="card-header">
              <div>
                <h3>{thingItem.name || thingItem.title}</h3>
                <p className="card-date">{thingItem.category || thingItem.type}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button className="edit-btn" onClick={() => openModal(type, thingItem)}>✎</button>
                <button className="delete-btn" onClick={() => deleteItem(type, thingItem.id)}>×</button>
              </div>
            </div>
            <span className={`card-status ${thingItem.status === 'Completed' || thingItem.status.includes('Completed') ? 'completed' : 'pending'}`}>
              {thingItem.status}
            </span>
            {(thingItem.ratingZ || thingItem.ratingS) && (
              <div style={{ marginTop: '0.8rem', fontSize: '0.9rem' }}>
                {thingItem.ratingZ && <p>⭐ Z: {thingItem.ratingZ}/5</p>}
                {thingItem.ratingS && <p>⭐ S: {thingItem.ratingS}/5</p>}
                {avgRating && <p><strong>📊 Avg: {avgRating}/5</strong></p>}
              </div>
            )}
          </>
        );
        break;

      default:
        content = null;
    }

    return <div key={item.id} className="card">{content}</div>;
  };

  const renderDateItem = (item: DatePlan) => {
    const displayDate = item.date ? formatDate(item.date) : '';
    const displayTime = item.time || '';
    return (
      <div key={item.id} className="list-item">
        <div className="list-item-content">
          <h3>{item.title}</h3>
          <p>
            📅 {displayDate} {displayTime && `| 🕐 ${displayTime}`}
            {item.location && ` | 📍 ${item.location}`}
          </p>
          {item.description && <p>{item.description}</p>}
          <span className={`card-status ${item.status === 'Completed' ? 'completed' : 'pending'}`}>
            {item.status}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button className="edit-btn" onClick={() => openModal('date', item)}>✎</button>
          <button className="delete-btn" onClick={() => deleteItem('date', item.id)}>×</button>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const prevMonth = () => {
      setCurrentMonth(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
      setCurrentMonth(new Date(year, month + 1, 1));
    };

    const getDatesWithEvents = () => {
      const dates = new Set<string>();
      (data.dates || []).forEach((date: DatePlan) => {
        const dateStr = date.date.split('T')[0];
        dates.add(dateStr);
      });
      return dates;
    };

    const datesWithEvents = getDatesWithEvents();
    const today = new Date().toISOString().split('T')[0];

    const handleDayClick = (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDate(dateStr);
      openModal('date');
    };

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -i).getDate();
      days.push(
        <div key={`prev-${i}`} className="calendar-day other-month">
          {prevMonthDay}
        </div>
      );
    }
    days.reverse();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEvent = datesWithEvents.has(dateStr);
      const isToday = dateStr === today;

      days.push(
        <motion.div
          key={day}
          className={`calendar-day ${hasEvent ? 'has-event' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(day)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {day}
        </motion.div>
      );
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div key={`next-${i}`} className="calendar-day other-month">
          {i}
        </div>
      );
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button className="calendar-nav-btn" onClick={prevMonth}>◀</button>
          <h3>{monthNames[month]} {year}</h3>
          <button className="calendar-nav-btn" onClick={nextMonth}>▶</button>
        </div>
        <div className="calendar-grid">
          {dayNames.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderThingsToDoSection = () => {
    const books = data.books || [];
    const watch = data.watch || [];
    const games = data.games || [];
    const allItems = [
      ...books.map((item: any) => ({ ...item, itemType: 'book' as ItemType })),
      ...watch.map((item: any) => ({ ...item, itemType: 'watch' as ItemType })),
      ...games.map((item: any) => ({ ...item, itemType: 'game' as ItemType }))
    ];

    if (allItems.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">♡</div>
          <p>No items yet. Add books, games, shows, or movies!</p>
        </div>
      );
    }

    return (
      <div className="grid">
        {allItems.map((item: any) => renderCard(item, item.itemType))}
      </div>
    );
  };

  const renderSection = (type: ItemType, sectionId?: string) => {
    if (sectionId === 'things') {
      return renderThingsToDoSection();
    }

    if (sectionId === 'dates') {
      const items = data.dates || [];
      return (
        <>
          {renderCalendar()}
          {items.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-retro)' }}>
                Upcoming Events
              </h3>
              <div className="list">
                {items.map((item: any) => renderDateItem(item))}
              </div>
            </div>
          )}
        </>
      );
    }

    // Special handling for memories section with new monthly layout
    if (sectionId === 'memories') {
      const memories = data.memories || [];

      // Timeline view
      if (memoryView === 'timeline') {
        return (
          <Timeline
            memories={memories}
            onBack={() => setMemoryView('grid')}
            onEditMemory={(memory) => openModal('memory', memory)}
            onDeleteMemory={(id) => deleteItem('memory', id)}
            onPhotoClick={(photo) => setZoomedPhoto(photo)}
          />
        );
      }

      // Month-specific view
      if (memoryView === 'month' && selectedMonth && selectedYear) {
        return (
          <MonthView
            month={selectedMonth}
            year={selectedYear}
            memories={memories}
            onBack={() => {
              setMemoryView('grid');
              setSelectedMonth(null);
            }}
            onAddMemory={() => openModal('memory')}
            onEditMemory={(memory) => openModal('memory', memory)}
            onDeleteMemory={(id) => deleteItem('memory', id)}
            onPhotoClick={(photo) => setZoomedPhoto(photo)}
          />
        );
      }

      // Month grid view (default)
      const memoryCounts: { [key: string]: number } = {};
      memories.forEach((memory: Memory) => {
        if (memory.month && memory.year) {
          const key = `${memory.year}-${memory.month}`;
          memoryCounts[key] = (memoryCounts[key] || 0) + 1;
        }
      });

      return (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMemoryView('timeline')}
              className="timeline-view-btn"
            >
              📜 Timeline View
            </motion.button>
          </div>
          <MonthGrid
            onMonthClick={(month, year) => {
              if (month === 0) {
                // Year change
                setSelectedYear(year);
              } else {
                // Month click
                setSelectedMonth(month);
                setSelectedYear(year);
                setMemoryView('month');
              }
            }}
            currentYear={selectedYear}
            memoryCounts={memoryCounts}
          />
        </>
      );
    }

    const sectionKey = getSectionKey(type) as keyof AppData;
    const items = data[sectionKey] || [];

    if (items.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">♡</div>
          <p>No items yet. Click the button above to add your first one!</p>
        </div>
      );
    }

    return (
      <div className="grid">
        {items.map((item: any) => renderCard(item, type))}
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">Loading...</h1>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'memories', label: 'Memories', type: 'memory' as ItemType, title: 'Our Memories', button: '+ Add Memory', icon: '📸', description: 'Gallery of moments' },
    { id: 'dates', label: 'Date Plans', type: 'date' as ItemType, title: 'Date Calendar', button: '+ Plan Date', icon: '📅', description: 'Plan together' },
    { id: 'places', label: 'Places', type: 'place' as ItemType, title: 'Places to Visit', button: '+ Add Place', icon: '📍', description: 'Discover spots' },
    { id: 'things', label: 'Things to Do', type: 'thingToDo' as ItemType, title: 'Things to Do', button: '+ Add Item', icon: '✨', description: 'Books, games & more' }
  ];

  const activeSection = sections.find(s => s.id === currentSection);

  return (
    <>
      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="landing-container"
          >
            <div className="background-animation">
              <div className="floating-heart">♡</div>
              <div className="floating-heart">♡</div>
              <div className="floating-heart">♡</div>
              <div className="floating-heart">♡</div>
              <div className="floating-heart">♡</div>
            </div>

            <motion.div
              className="hero-section"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="hero-letters">
                  <div className="gif-placeholder left">
                      <img src="/bulb.gif" alt="Character Z" />
                  </div>
                <div className="letters-container">
                  <motion.span
                    className="letter letter-z"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Z
                  </motion.span>
                  <span className="letter-divider">/</span>
                  <motion.span
                    className="letter letter-s"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    S
                  </motion.span>
                </div>
                  <div className="gif-placeholder right">
                      <img src="/milk.gif" alt="Character S" />
                  </div>
              </div>

              {/* Latest Memory Widget */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                style={{ maxWidth: '800px', margin: '0 auto 2rem' }}
              >
                <LatestMemory
                  memory={data.memories && data.memories.length > 0
                    ? data.memories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                    : null
                  }
                  onViewMemories={() => navigateToSection('memories')}
                />
              </motion.div>

              <motion.div
                className="nav-buttons"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    className="nav-button"
                    onClick={() => navigateToSection(section.id)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="nav-button-icon">{section.icon}</span>
                    <span className="nav-button-label">{section.label}</span>
                    <span className="nav-button-desc">{section.description}</span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Upcoming Dates Widget at the end */}
              {data.dates && data.dates.filter((d: DatePlan) => d.status === 'Planned').length > 0 && (
                <motion.div
                  className="landing-dates"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  style={{ marginTop: '2rem' }}
                >
                  <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.8rem', marginBottom: '0.8rem', color: 'var(--dark-green)', textAlign: 'center' }}>
                    📅 Upcoming Dates
                  </h3>
                  <div className="landing-dates-list">
                    {data.dates
                      .filter((d: DatePlan) => d.status === 'Planned')
                      .sort((a: DatePlan, b: DatePlan) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 3)
                      .map((date: DatePlan) => (
                        <motion.div
                          key={date.id}
                          className="landing-date-item"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => navigateToSection('dates')}
                        >
                          <span className="landing-date-title">{date.title}</span>
                          <span className="landing-date-date">
                            {formatDate(date.date)} {date.time && `• ${date.time}`}
                          </span>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="container"
          >
            <header className="header">
              <h1 className="title">{activeSection?.title}</h1>
              <motion.button
                className="back-btn"
                onClick={() => setCurrentView('landing')}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
                title="Back to Home"
              >
                ← Back
              </motion.button>
            </header>

            <nav className="mobile-nav">
              {sections.map(section => (
                <button
                  key={section.id}
                  className={`mobile-nav-btn ${currentSection === section.id ? 'active' : ''}`}
                  onClick={() => setCurrentSection(section.id)}
                  title={section.label}
                >
                  {section.icon}
                </button>
              ))}
            </nav>

            <nav className="nav">
              {sections.map(section => (
                <button
                  key={section.id}
                  className={`nav-btn ${currentSection === section.id ? 'active' : ''}`}
                  onClick={() => setCurrentSection(section.id)}
                >
                  {section.icon} {section.label}
                </button>
              ))}
            </nav>

            <main className="main-content">
              {activeSection && (
                <motion.section
                  className="section active"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="section-header">
                    <h2>{activeSection.title}</h2>
                    {currentSection === 'things' ? (
                      <div className="multi-add-btns">
                        <button className="icon-add-btn" onClick={() => openModal('book')} title="Add Book">+ 📚</button>
                        <button className="icon-add-btn" onClick={() => openModal('watch')} title="Add Show/Movie">+ 🎬</button>
                        <button className="icon-add-btn" onClick={() => openModal('game')} title="Add Game">+ 🎮</button>
                      </div>
                    ) : currentSection === 'memories' && memoryView === 'grid' ? (
                      null
                    ) : currentSection !== 'dates' && currentSection !== 'memories' ? (
                      <button className="add-btn" onClick={() => openModal(activeSection.type)}>
                        {activeSection.button}
                      </button>
                    ) : null}
                  </div>
                  {renderSection(activeSection.type, currentSection)}
                </motion.section>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && currentType && (
          <motion.div
            className="modal active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              if ((e.target as HTMLElement).classList.contains('modal')) {
                closeModal();
              }
            }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="modal-title-bar">
                <span>{editingItem ? `Edit ${formConfigs[currentType].title.replace('Add ', '')}` : formConfigs[currentType].title}</span>
                <span className="close" onClick={closeModal}>×</span>
              </div>
              {selectedDate && currentType === 'date' && (
                <div style={{ padding: '1rem', background: 'var(--retro-lavender)', borderBottom: '2px solid var(--win98-dark)' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>📅 Date: {formatDate(selectedDate)}</p>
                </div>
              )}
              <form onSubmit={handleFormSubmit}>
                <div>
                  {formConfigs[currentType].fields.map((field) => {
                    const fieldValue = editingItem ? editingItem[field.name] : '';
                    const selectValue = field.name === 'visited' && editingItem ?
                      (editingItem.visited ? 'Yes' : 'No') : fieldValue;

                    return (
                      <div key={field.name} className="form-group">
                        <label htmlFor={field.name}>
                          {field.label}{field.required ? ' *' : ''}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            defaultValue={fieldValue}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            defaultValue={selectValue}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            min={field.min}
                            max={field.max}
                            defaultValue={fieldValue}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                {currentType === 'memory' && (
                  <div className="form-group">
                    <label htmlFor="photo-upload">Photos</label>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    {(uploadedPhotos.length > 0 || (editingItem?.photos && editingItem.photos.length > 0)) && (
                      <div className="photo-preview-grid">
                        {editingItem?.photos && editingItem.photos.map((photo: string, idx: number) => (
                          !deletedPhotoIndices.includes(idx) && (
                            <div key={`existing-${idx}`} className="photo-preview-item">
                              <img src={photo} alt={`Existing ${idx + 1}`} />
                              <button
                                type="button"
                                className="photo-remove-btn"
                                onClick={() => setDeletedPhotoIndices(prev => [...prev, idx])}
                              >
                                ×
                              </button>
                            </div>
                          )
                        ))}
                        {uploadedPhotos.map((photo, idx) => (
                          <div key={`new-${idx}`} className="photo-preview-item">
                            <img src={photo} alt={`New ${idx + 1}`} />
                            <button
                              type="button"
                              className="photo-remove-btn"
                              onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== idx))}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {zoomedPhoto && (
        <motion.div
          className="photo-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setZoomedPhoto(null)}
        >
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={() => setZoomedPhoto(null)}>×</button>
            <img src={zoomedPhoto} alt="Zoomed" />
          </div>
        </motion.div>
      )}
    </>
  );
}
