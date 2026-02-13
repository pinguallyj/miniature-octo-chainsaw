'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  const [galleryMemoryId, setGalleryMemoryId] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Filter memories for this month/year
  const monthMemories = memories.filter(m => m.month === month && m.year === year);

  const openGallery = (memoryId: number) => {
    setGalleryMemoryId(memoryId);
    setCurrentPhotoIndex(0);
  };

  const closeGallery = () => {
    setGalleryMemoryId(null);
    setCurrentPhotoIndex(0);
  };

  const galleryMemory = monthMemories.find(m => m.id === galleryMemoryId);

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
                <div
                  className="memory-photo-thumbnail"
                  onClick={() => openGallery(memory.id)}
                  style={{ cursor: 'pointer', position: 'relative', aspectRatio: '16/9' }}
                >
                  <Image src={memory.photos[0]} alt={memory.title} fill style={{ objectFit: 'cover' }} />
                  {memory.photos.length > 1 && (
                    <div className="memory-photo-badge">
                      +{memory.photos.length - 1} photo{memory.photos.length - 1 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Photo Gallery Modal */}
      <AnimatePresence>
        {galleryMemory && galleryMemory.photos && galleryMemory.photos.length > 0 && (
          <motion.div
            className="photo-gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGallery}
          >
            <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="gallery-modal-header">
                <h3>{galleryMemory.title}</h3>
                <button className="gallery-close-btn" onClick={closeGallery}>×</button>
              </div>
              <div className="gallery-modal-body">
                <div className="gallery-image-container" style={{ position: 'relative', width: '100%', height: '65vh' }}>
                  <Image
                    src={galleryMemory.photos[currentPhotoIndex]}
                    alt={`${galleryMemory.title} ${currentPhotoIndex + 1}`}
                    className="gallery-modal-image"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                {galleryMemory.photos.length > 1 && (
                  <div className="gallery-controls">
                    <button
                      className="gallery-nav-btn gallery-nav-prev"
                      onClick={() => setCurrentPhotoIndex((prev) =>
                        prev === 0 ? galleryMemory.photos!.length - 1 : prev - 1
                      )}
                    >
                      ◀
                    </button>
                    <div className="gallery-photo-counter">
                      {currentPhotoIndex + 1} / {galleryMemory.photos.length}
                    </div>
                    <button
                      className="gallery-nav-btn gallery-nav-next"
                      onClick={() => setCurrentPhotoIndex((prev) =>
                        prev === galleryMemory.photos!.length - 1 ? 0 : prev + 1
                      )}
                    >
                      ▶
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
