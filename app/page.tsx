'use client';

import { useState } from 'react';
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
  const [currentSection, setCurrentSection] = useState<string>('memories');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<ItemType | null>(null);

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

  const renderSection = (type: ItemType) => {
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
    { id: 'memories', label: 'Memories', type: 'memory' as ItemType, title: 'Our Memories', button: '+ Add Memory' },
    { id: 'dates', label: 'Date Plans', type: 'date' as ItemType, title: 'Upcoming Dates', button: '+ Plan Date' },
    { id: 'restaurants', label: 'Restaurants', type: 'restaurant' as ItemType, title: 'Places to Eat', button: '+ Add Restaurant' },
    { id: 'date-ideas', label: 'Date Ideas', type: 'dateIdea' as ItemType, title: 'Date Ideas', button: '+ Add Idea' },
    { id: 'books', label: 'Books', type: 'book' as ItemType, title: 'Books to Read', button: '+ Add Book' },
    { id: 'watch', label: 'Watch Together', type: 'watch' as ItemType, title: 'Watch Together', button: '+ Add Show/Movie' },
    { id: 'games', label: 'Games', type: 'game' as ItemType, title: 'Games to Play', button: '+ Add Game' }
  ];

  const activeSection = sections.find(s => s.id === currentSection);

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Our Space</h1>
        <p className="subtitle">Where our moments live together</p>
      </header>

      <nav className="nav">
        {sections.map(section => (
          <button
            key={section.id}
            className={`nav-btn ${currentSection === section.id ? 'active' : ''}`}
            onClick={() => setCurrentSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeSection && (
          <section className="section active">
            <div className="section-header">
              <h2>{activeSection.title}</h2>
              <button className="add-btn" onClick={() => openModal(activeSection.type)}>
                {activeSection.button}
              </button>
            </div>
            {renderSection(activeSection.type)}
          </section>
        )}
      </main>

      {isModalOpen && currentType && (
        <div className="modal active" onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains('modal')) {
            closeModal();
          }
        }}>
          <div className="modal-content">
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
          </div>
        </div>
      )}
    </div>
  );
}
