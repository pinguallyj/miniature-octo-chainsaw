'use client';

import { motion } from 'framer-motion';
import { Memory } from '@/types';

interface MonthViewProps {
  month: number;
  year: number;
  memories: Memory[];
  onBack: () => void;
  onAddMemory: () => void;
  onEditMemory: (memory: Memory) => void;
  onDeleteMemory: (id: number) => void;
  onPhotoClick: (photo: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthView({
  month,
  year,
  memories,
  onBack,
  onAddMemory,
  onEditMemory,
  onDeleteMemory,
  onPhotoClick
}: MonthViewProps) {
  const monthName = MONTH_NAMES[month - 1];

  // Filter memories for this month/year
  const monthMemories = memories.filter(m => m.month === month && m.year === year);

  return (
    <div className="month-view-container">
      {/* Header */}
      <div className="month-view-header">
        <motion.button
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="back-btn"
        >
          ◀ Back
        </motion.button>
        <h1 className="month-view-title">
          {monthName} {year}
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddMemory}
          className="add-btn"
        >
          + Add
        </motion.button>
      </div>

      {/* Memories Grid */}
      {monthMemories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="month-view-empty"
        >
          <div className="month-view-empty-icon">📸</div>
          <p className="month-view-empty-text">No memories yet for {monthName} {year}</p>
          <p className="month-view-empty-hint">Click the "+ Add" button to create one!</p>
        </motion.div>
      ) : (
        <div className="month-view-grid">
          {monthMemories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              {/* Memory Card Header */}
              <div className="card-header">
                <div>
                  <h3>{memory.title}</h3>
                  {memory.date && <p className="card-date">{new Date(memory.date).toLocaleDateString()}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    className="edit-btn"
                    onClick={() => onEditMemory(memory)}
                  >
                    ✎
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => onDeleteMemory(memory.id)}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Memory Card Content */}
              {memory.location && (
                <p><strong>📍 {memory.location}</strong></p>
              )}
              {memory.description && (
                <p>{memory.description}</p>
              )}

              {/* Photos */}
              {memory.photos && memory.photos.length > 0 && (
                <div className="photo-gallery">
                  {memory.photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="photo-item"
                      onClick={() => onPhotoClick(photo)}
                    >
                      <img src={photo} alt={`Memory ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
