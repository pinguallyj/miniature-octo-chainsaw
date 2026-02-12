'use client';

import { motion } from 'framer-motion';
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

  // Sort memories from earliest to latest
  const sortedMemories = [...memories].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });

  // Group memories by month/year and create timeline items
  const timelineItems: TimelineItem[] = [];
  let currentMonthYear = '';

  sortedMemories.forEach((memory) => {
    const date = new Date(memory.createdAt);
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
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-10 pb-4 border-b-4 border-black">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-4 py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold"
        >
          ◀ Back
        </motion.button>
        <h1 className="text-3xl sm:text-4xl font-bold text-center flex-1">
          Memory Timeline
        </h1>
        <div className="w-24"></div>
      </div>

      {/* Timeline */}
      {timelineItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">⏰</div>
          <p className="text-xl opacity-70">No memories yet</p>
          <p className="text-sm opacity-50 mt-2">Start creating memories to see your timeline!</p>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-black"></div>

          {/* Timeline Items */}
          <div className="space-y-8">
            {timelineItems.slice(0, visibleItems).map((item, index) => {
              if (item.type === 'marker') {
                return (
                  <motion.div
                    key={`marker-${item.monthYear}-${index}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-20"
                  >
                    {/* Month Marker Dot */}
                    <div className="absolute left-4 w-9 h-9 bg-pink-400 border-4 border-black rounded-full flex items-center justify-center">
                      📅
                    </div>
                    <div className="bg-pink-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block px-6 py-2">
                      <h3 className="font-bold text-xl">{item.monthYear}</h3>
                    </div>
                  </motion.div>
                );
              }

              if (item.type === 'memory' && item.memory) {
                const memory = item.memory;
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={`memory-${memory.id}-${index}`}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-20"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-6 w-5 h-5 bg-blue-400 border-2 border-black rounded-full"></div>

                    {/* Memory Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden"
                    >
                      {/* Memory Header */}
                      <div className="p-4 bg-blue-200 border-b-4 border-black flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{memory.title}</h4>
                          {memory.date && (
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(memory.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEditMemory(memory)}
                            className="hover:scale-110 transition-transform"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => onDeleteMemory(memory.id)}
                            className="hover:scale-110 transition-transform"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      {/* Memory Content */}
                      <div className="p-4">
                        {memory.location && (
                          <p className="text-sm opacity-70 mb-2">📍 {memory.location}</p>
                        )}
                        {memory.description && (
                          <p className="text-sm mb-4">{memory.description}</p>
                        )}

                        {/* Photos */}
                        {memory.photos && memory.photos.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {memory.photos.map((photo, idx) => (
                              <motion.img
                                key={idx}
                                src={photo}
                                alt={`Memory ${idx + 1}`}
                                className="w-full h-24 object-cover border-2 border-black cursor-pointer"
                                whileHover={{ scale: 1.1 }}
                                onClick={() => onPhotoClick(photo)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              }

              return null;
            })}
          </div>

          {/* Loading indicator */}
          {visibleItems < timelineItems.length && (
            <div ref={observerRef} className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block text-4xl"
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
              className="text-center py-8 relative pl-20"
            >
              <div className="absolute left-4 w-9 h-9 bg-green-400 border-4 border-black rounded-full flex items-center justify-center">
                ✨
              </div>
              <p className="text-lg opacity-70">You've reached the beginning!</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
