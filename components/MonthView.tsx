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
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-4 py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold"
        >
          ◀ Back
        </motion.button>
        <h1 className="text-3xl sm:text-4xl font-bold text-center flex-1">
          {monthName} {year}
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddMemory}
          className="px-4 py-2 bg-green-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold"
        >
          + Add
        </motion.button>
      </div>

      {/* Memories Grid */}
      {monthMemories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">📸</div>
          <p className="text-xl opacity-70">No memories yet for {monthName} {year}</p>
          <p className="text-sm opacity-50 mt-2">Click the "+ Add" button to create one!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthMemories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden"
            >
              {/* Memory Card Header */}
              <div className="p-4 bg-pink-200 border-b-4 border-black flex justify-between items-start">
                <h3 className="font-bold text-lg flex-1">{memory.title}</h3>
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

              {/* Memory Card Content */}
              <div className="p-4">
                {memory.date && (
                  <p className="text-sm opacity-70 mb-2">📅 {new Date(memory.date).toLocaleDateString()}</p>
                )}
                {memory.location && (
                  <p className="text-sm opacity-70 mb-2">📍 {memory.location}</p>
                )}
                {memory.description && (
                  <p className="text-sm mb-4">{memory.description}</p>
                )}

                {/* Photos */}
                {memory.photos && memory.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {memory.photos.map((photo, idx) => (
                      <motion.img
                        key={idx}
                        src={photo}
                        alt={`Memory ${idx + 1}`}
                        className="w-full h-24 object-cover border-2 border-black cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onPhotoClick(photo)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
