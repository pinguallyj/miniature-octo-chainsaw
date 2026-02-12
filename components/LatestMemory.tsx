'use client';

import { motion } from 'framer-motion';
import { Memory } from '@/types';

interface LatestMemoryProps {
  memory: Memory | null;
  onViewMemories: () => void;
}

export default function LatestMemory({ memory, onViewMemories }: LatestMemoryProps) {
  if (!memory) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div className="p-4 bg-gray-200 border-b-4 border-black">
          <h3 className="font-bold text-xl">Latest Memory</h3>
        </div>
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-lg opacity-70">No memories yet</p>
          <p className="text-sm opacity-50 mt-2">Create your first memory to see it here!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewMemories}
            className="mt-4 px-6 py-2 bg-pink-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold"
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
      whileHover={{ scale: 1.02 }}
      className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden cursor-pointer"
      onClick={onViewMemories}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-pink-300 to-purple-300 border-b-4 border-black">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl">Latest Memory ✨</h3>
          <span className="text-xs opacity-70">
            {new Date(memory.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Text Content */}
          <div>
            <h4 className="font-bold text-2xl mb-2">{memory.title}</h4>
            {memory.date && (
              <p className="text-sm opacity-70 mb-2">
                📅 {new Date(memory.date).toLocaleDateString()}
              </p>
            )}
            {memory.location && (
              <p className="text-sm opacity-70 mb-2">📍 {memory.location}</p>
            )}
            {memory.description && (
              <p className="text-sm mt-4 line-clamp-3">{memory.description}</p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewMemories();
              }}
              className="mt-4 px-4 py-2 bg-blue-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold text-sm"
            >
              View All Memories →
            </motion.button>
          </div>

          {/* Photo Preview */}
          {memory.photos && memory.photos.length > 0 && (
            <div className="relative">
              <img
                src={memory.photos[0]}
                alt={memory.title}
                className="w-full h-48 md:h-full object-cover border-4 border-black"
              />
              {memory.photos.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black text-white px-3 py-1 text-sm font-bold">
                  +{memory.photos.length - 1} more
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
