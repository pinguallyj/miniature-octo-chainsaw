'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Memory } from '@/types';
import { formatDateShort } from '@/lib/utils';

interface LatestMemoryProps {
  memory: Memory | null;
  onViewMemories: () => void;
}

export default function LatestMemory({ memory, onViewMemories }: LatestMemoryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!memory) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="latest-memory-widget"
      >
        <div className="latest-memory-header">
          <h3 className="latest-memory-header-title">Latest Memory</h3>
        </div>
        <div className="latest-memory-empty">
          <div className="latest-memory-empty-icon">📸</div>
          <p className="latest-memory-empty-text">No memories yet</p>
          <p className="latest-memory-empty-hint">Create your first memory to see it here!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewMemories}
            className="view-all-btn"
          >
            Go to Memories
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="latest-memory-widget"
      onClick={onViewMemories}
      style={{ cursor: 'pointer' }}
    >
      {/* Header */}
      <div className="latest-memory-header">
        <div>
          <h3 className="latest-memory-header-title">Latest Memory ✨</h3>
        </div>
        <span className="latest-memory-date">
          {memory.date
            ? formatDateShort(memory.date)
            : formatDateShort(memory.createdAt)
          }
        </span>
      </div>

      {/* Content */}
      <div className="latest-memory-content">
        <div className="latest-memory-grid">
          {/* Text Content */}
          <div className="latest-memory-text">
            <h4>{memory.title}</h4>
            {memory.date && (
              <p>
                📅 {formatDateShort(memory.date)}
              </p>
            )}
            {memory.location && (
              <p>📍 {memory.location}</p>
            )}
            {memory.description && (
              <p className="latest-memory-desc">{memory.description}</p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewMemories();
              }}
              className="view-all-btn"
            >
              View All Memories →
            </motion.button>
          </div>

          {/* Photo Preview */}
          {memory.photos && memory.photos.length > 0 && (
            <div className="latest-memory-photo-container">
              <div className="latest-memory-photo">
                <img
                  src={memory.photos[currentPhotoIndex]}
                  alt={`${memory.title} ${currentPhotoIndex + 1}`}
                />
              </div>
              {memory.photos.length > 1 && (
                <div className="latest-memory-controls">
                  <button
                    className="latest-memory-nav-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPhotoIndex((prev) =>
                        prev === 0 ? memory.photos!.length - 1 : prev - 1
                      );
                    }}
                    title="Previous photo"
                  >
                    ◀
                  </button>
                  <div className="latest-memory-photo-count">
                    {currentPhotoIndex + 1} / {memory.photos.length}
                  </div>
                  <button
                    className="latest-memory-nav-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPhotoIndex((prev) =>
                        prev === memory.photos!.length - 1 ? 0 : prev + 1
                      );
                    }}
                    title="Next photo"
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
