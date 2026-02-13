'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '@/types';
import { useEffect, useState, useRef } from 'react';

interface TimelineProps {
  memories: Memory[];
  onBack: () => void;
  onEditMemory: (memory: Memory) => void;
  onDeleteMemory: (id: number) => void;
  onPhotoClick: (photo: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface TimelineItem {
  type: 'marker' | 'memory';
  monthYear?: string;
  memory?: Memory;
}

export default function Timeline({
  memories,
  onBack,
  onEditMemory,
  onDeleteMemory,
  onPhotoClick
}: TimelineProps) {
  const [visibleItems, setVisibleItems] = useState(10);
  const observerRef = useRef<HTMLDivElement>(null);
  const [galleryMemoryId, setGalleryMemoryId] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openGallery = (memoryId: number) => {
    setGalleryMemoryId(memoryId);
    setCurrentPhotoIndex(0);
  };

  const closeGallery = () => {
    setGalleryMemoryId(null);
    setCurrentPhotoIndex(0);
  };

  // Sort memories from earliest to latest
  const sortedMemories = [...memories].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt).getTime();
    const dateB = new Date(b.date || b.createdAt).getTime();
    return dateA - dateB;
  });

  const galleryMemory = sortedMemories.find(m => m.id === galleryMemoryId);

  // Group memories by month/year and create timeline items
  const timelineItems: TimelineItem[] = [];
  let currentMonthYear = '';

  sortedMemories.forEach((memory) => {
    const date = new Date(memory.date || memory.createdAt);
    const monthYear = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;

    if (monthYear !== currentMonthYear) {
      currentMonthYear = monthYear;
      timelineItems.push({ type: 'marker', monthYear });
    }

    timelineItems.push({ type: 'memory', memory });
  });

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleItems < timelineItems.length) {
          setVisibleItems((prev) => Math.min(prev + 10, timelineItems.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [visibleItems, timelineItems.length]);

  return (
    <div className="timeline-container">
      {/* Header */}
      <div className="timeline-header">
        <motion.button
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="back-btn"
        >
          ◀ Back
        </motion.button>
        <h1 className="timeline-title">
          Memory Timeline
        </h1>
        <div style={{ width: '80px' }}></div>
      </div>

      {/* Timeline */}
      {timelineItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="timeline-empty"
        >
          <div className="timeline-empty-icon">⏰</div>
          <p className="timeline-empty-text">No memories yet</p>
          <p className="timeline-empty-hint">Start creating memories to see your timeline!</p>
        </motion.div>
      ) : (
        <div className="timeline-content">
          {/* Timeline Line */}
          <div className="timeline-line"></div>

          {/* Timeline Items */}
          <div className="timeline-items">
            {timelineItems.slice(0, visibleItems).map((item, index) => {
              if (item.type === 'marker') {
                return (
                  <motion.div
                    key={`marker-${item.monthYear}-${index}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="timeline-item"
                  >
                    {/* Month Marker Dot */}
                    <div className="timeline-marker">
                      📅
                    </div>
                    <div className="timeline-marker-card">
                      <h3 className="timeline-marker-text">{item.monthYear}</h3>
                    </div>
                  </motion.div>
                );
              }

              if (item.type === 'memory' && item.memory) {
                const memory = item.memory;

                return (
                  <motion.div
                    key={`memory-${memory.id}-${index}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="timeline-item"
                  >
                    {/* Timeline Dot */}
                    <div className="timeline-dot"></div>

                    {/* Memory Card */}
                    <div className="timeline-memory-card">
                      {/* Memory Header */}
                      <div className="card-header">
                        <div>
                          <h4>{memory.title}</h4>
                          {memory.date && (
                            <p className="card-date">
                              {new Date(memory.date).toLocaleDateString()}
                            </p>
                          )}
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

                      {/* Memory Content */}
                      <div style={{ padding: '1rem' }}>
                        {memory.location && (
                          <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem' }}>📍 {memory.location}</p>
                        )}
                        {memory.description && (
                          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{memory.description}</p>
                        )}

                        {/* Photos */}
                        {memory.photos && memory.photos.length > 0 && (
                          <div
                            className="memory-photo-thumbnail"
                            onClick={() => openGallery(memory.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img src={memory.photos[0]} alt={memory.title} />
                            {memory.photos.length > 1 && (
                              <div className="memory-photo-badge">
                                +{memory.photos.length - 1} photo{memory.photos.length - 1 !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return null;
            })}
          </div>

          {/* Loading indicator */}
          {visibleItems < timelineItems.length && (
            <div ref={observerRef} className="timeline-loading">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ⏳
              </motion.div>
            </div>
          )}

          {/* End of timeline */}
          {visibleItems >= timelineItems.length && timelineItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="timeline-end"
            >
              <div className="timeline-end-marker">
                ✨
              </div>
              <p className="timeline-end-text">You've reached the beginning!</p>
            </motion.div>
          )}
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
                <div className="gallery-image-container">
                  <img
                    src={galleryMemory.photos[currentPhotoIndex]}
                    alt={`${galleryMemory.title} ${currentPhotoIndex + 1}`}
                    className="gallery-modal-image"
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
