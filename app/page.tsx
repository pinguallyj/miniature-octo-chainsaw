'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { formConfigs } from '@/lib/formConfigs';
import { formatDate, formatDateTime, getSectionKey } from '@/lib/utils';
import { AppData, ItemType, Memory, DatePlan, Restaurant, DateIdea, Book, WatchItem, Game } from '@/types';

const initialData: AppData = {
  memories: [],
  dates: [],
  restaurants: [],
  dateIdeas: [],
  books: [],
  watch: [],
  games: []
};

export default function Home() {
  const [data, setData, isLoaded] = useLocalStorage<AppData>('coupleAppData', initialData);
  const [currentView, setCurrentView] = useState<'landing' | 'content'>('landing');
  const [currentSection, setCurrentSection] = useState<string>('memories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<ItemType | null>(null);

  const navigateToSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    setCurrentView('content');
  };

  const openModal = (type: ItemType) => {
    setCurrentType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentType(null);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentType) return;

    const formData = new FormData(e.currentTarget);
    const item: any = {
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    for (let [key, value] of formData.entries()) {
      item[key] = value;
    }

    const sectionKey = getSectionKey(currentType) as keyof AppData;
    setData({
      ...data,
      [sectionKey]: [...data[sectionKey], item]
    });

    closeModal();
    e.currentTarget.reset();
  };

  const deleteItem = (type: ItemType, id: number) => {
    const sectionKey = getSectionKey(type) as keyof AppData;
    setData({
      ...data,
      [sectionKey]: data[sectionKey].filter((item: any) => item.id !== id)
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
                <p className="card-date">{formatDate(memory.date)}</p>
              </div>
              <button className="delete-btn" onClick={() => deleteItem(type, memory.id)}>×</button>
            </div>
            <p>{memory.description}</p>
            {memory.location && <p><strong>📍 {memory.location}</strong></p>}
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
              <button className="delete-btn" onClick={() => deleteItem(type, restaurant.id)}>×</button>
            </div>
            <p>📍 {restaurant.location}</p>
            {restaurant.rating && <p>⭐ {restaurant.rating}/5</p>}
            {restaurant.notes && <p>{restaurant.notes}</p>}
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
              <button className="delete-btn" onClick={() => deleteItem(type, dateIdea.id)}>×</button>
            </div>
            <p>{dateIdea.description}</p>
            {dateIdea.estimatedCost && <p><strong>💰 {dateIdea.estimatedCost}</strong></p>}
          </>
        );
        break;

      case 'book':
        const book = item as Book;
        content = (
          <>
            <div className="card-header">
              <div>
                <h3>{book.title}</h3>
                <p className="card-date">by {book.author}</p>
              </div>
              <button className="delete-btn" onClick={() => deleteItem(type, book.id)}>×</button>
            </div>
            {book.genre && <p>📚 {book.genre}</p>}
            <span className={`card-status ${book.status === 'Completed' ? 'completed' : 'pending'}`}>
              {book.status}
            </span>
            {book.notes && <p style={{ marginTop: '0.8rem' }}>{book.notes}</p>}
          </>
        );
        break;

      case 'watch':
        const watch = item as WatchItem;
        content = (
          <>
            <div className="card-header">
              <div>
                <h3>{watch.title}</h3>
                <p className="card-date">{watch.type}</p>
              </div>
              <button className="delete-btn" onClick={() => deleteItem(type, watch.id)}>×</button>
            </div>
            {watch.genre && <p>🎬 {watch.genre}</p>}
            {watch.platform && <p>📺 {watch.platform}</p>}
            <span className={`card-status ${watch.status === 'Completed' ? 'completed' : 'pending'}`}>
              {watch.status}
            </span>
            {watch.notes && <p style={{ marginTop: '0.8rem' }}>{watch.notes}</p>}
          </>
        );
        break;

      case 'game':
        const game = item as Game;
        content = (
          <>
            <div className="card-header">
              <div>
                <h3>{game.title}</h3>
                <p className="card-date">{game.type}</p>
              </div>
              <button className="delete-btn" onClick={() => deleteItem(type, game.id)}>×</button>
            </div>
            {game.players && <p>👥 {game.players}</p>}
            <span className={`card-status ${game.status === 'Completed' ? 'completed' : 'pending'}`}>
              {game.status}
            </span>
            {game.notes && <p style={{ marginTop: '0.8rem' }}>{game.notes}</p>}
          </>
        );
        break;

      default:
        content = null;
    }

    return <div key={item.id} className="card">{content}</div>;
  };

  const renderDateItem = (item: DatePlan) => {
    return (
      <div key={item.id} className="list-item">
        <div className="list-item-content">
          <h3>{item.title}</h3>
          <p>📅 {formatDateTime(item.date)} | 📍 {item.location}</p>
          {item.description && <p>{item.description}</p>}
          <span className={`card-status ${item.status === 'Completed' ? 'completed' : 'pending'}`}>
            {item.status}
          </span>
        </div>
        <button className="delete-btn" onClick={() => deleteItem('date', item.id)}>×</button>
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

    const sectionKey = getSectionKey(type) as keyof AppData;
    const items = data[sectionKey];

    if (!items || items.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">♡</div>
          <p>No items yet. Click the button above to add your first one!</p>
        </div>
      );
    }

    if (type === 'date') {
      return (
        <div className="list">
          {items.map((item: any) => renderDateItem(item))}
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
    { id: 'dates', label: 'Date Plans', type: 'date' as ItemType, title: 'Upcoming Dates', button: '+ Plan Date', icon: '📅', description: 'Plan together' },
    { id: 'restaurants', label: 'Places', type: 'restaurant' as ItemType, title: 'Places to Eat', button: '+ Add Restaurant', icon: '📍', description: 'Discover spots' },
    { id: 'things', label: 'Things to Do', type: 'book' as ItemType, title: 'Things to Do', button: '+ Add Item', icon: '✨', description: 'Books, games & more' }
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
                  <span className="gif-text">Add GIF</span>
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
                  <span className="gif-text">Add GIF</span>
                </div>
              </div>

              <motion.div
                className="nav-buttons"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    className="nav-button"
                    onClick={() => navigateToSection(section.id)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="nav-button-icon">{section.icon}</span>
                    <span className="nav-button-label">{section.label}</span>
                    <span className="nav-button-desc">{section.description}</span>
                  </motion.button>
                ))}
              </motion.div>
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
              <motion.button
                className="back-btn"
                onClick={() => setCurrentView('landing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Home
              </motion.button>
              <h1 className="title">{activeSection?.title}</h1>
            </header>

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
                        <button className="add-btn" onClick={() => openModal('book')}>+ Add Book</button>
                        <button className="add-btn" onClick={() => openModal('watch')}>+ Add Show/Movie</button>
                        <button className="add-btn" onClick={() => openModal('game')}>+ Add Game</button>
                      </div>
                    ) : (
                      <button className="add-btn" onClick={() => openModal(activeSection.type)}>
                        {activeSection.button}
                      </button>
                    )}
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
              <span className="close" onClick={closeModal}>&times;</span>
              <h3 className="modal-title">{formConfigs[currentType].title}</h3>
              <form onSubmit={handleFormSubmit}>
                <div>
                  {formConfigs[currentType].fields.map((field) => (
                    <div key={field.name} className="form-group">
                      <label htmlFor={field.name}>
                        {field.label}{field.required ? ' *' : ''}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.name}
                          name={field.name}
                          required={field.required}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          id={field.name}
                          name={field.name}
                          required={field.required}
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
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Save</button>
                  <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
