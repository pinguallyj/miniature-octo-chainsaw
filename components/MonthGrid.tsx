'use client';

import { motion } from 'framer-motion';

interface MonthGridProps {
  onMonthClick: (month: number, year: number) => void;
  currentYear: number;
  memoryCounts: { [key: string]: number };
}

const MONTHS = [
  { num: 1, short: 'Jan', full: 'January', color: '#FFE5E5' },
  { num: 2, short: 'Feb', full: 'February', color: '#FFD5E5' },
  { num: 3, short: 'Mar', full: 'March', color: '#E5F5FF' },
  { num: 4, short: 'Apr', full: 'April', color: '#E5FFE5' },
  { num: 5, short: 'May', full: 'May', color: '#FFFFE5' },
  { num: 6, short: 'Jun', full: 'June', color: '#FFE5D5' },
  { num: 7, short: 'Jul', full: 'July', color: '#FFE5E5' },
  { num: 8, short: 'Aug', full: 'August', color: '#E5E5FF' },
  { num: 9, short: 'Sep', full: 'September', color: '#FFE5F5' },
  { num: 10, short: 'Oct', full: 'October', color: '#E5FFF5' },
  { num: 11, short: 'Nov', full: 'November', color: '#F5E5FF' },
  { num: 12, short: 'Dec', full: 'December', color: '#E5F5E5' }
];

export default function MonthGrid({ onMonthClick, currentYear, memoryCounts }: MonthGridProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Year Selector */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onMonthClick(0, currentYear - 1)}
          className="px-4 py-2 bg-white border-4 border-black font-bold hover:bg-gray-100 transition-colors"
        >
          ◀ {currentYear - 1}
        </motion.button>
        <h2 className="text-3xl font-bold">{currentYear}</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onMonthClick(0, currentYear + 1)}
          className="px-4 py-2 bg-white border-4 border-black font-bold hover:bg-gray-100 transition-colors"
        >
          {currentYear + 1} ▶
        </motion.button>
      </div>

      {/* Month Grid - 3 rows x 4 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MONTHS.map((month, index) => {
          const key = `${currentYear}-${month.num}`;
          const count = memoryCounts[key] || 0;

          return (
            <motion.button
              key={month.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMonthClick(month.num, currentYear)}
              className="relative h-32 sm:h-40 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ backgroundColor: month.color }}
            >
              <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="text-4xl sm:text-5xl font-bold mb-2">{month.short}</div>
                <div className="text-xs sm:text-sm opacity-70">{month.full}</div>
                {count > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  >
                    {count}
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-8 text-center text-lg opacity-70">
        Total memories in {currentYear}: {Object.entries(memoryCounts)
          .filter(([key]) => key.startsWith(`${currentYear}-`))
          .reduce((sum, [_, count]) => sum + count, 0)}
      </div>
    </div>
  );
}
