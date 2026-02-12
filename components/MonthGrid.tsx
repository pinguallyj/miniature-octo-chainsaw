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
  const totalMemories = Object.entries(memoryCounts)
    .filter(([key]) => key.startsWith(`${currentYear}-`))
    .reduce((sum, [_, count]) => sum + count, 0);

  return (
    <div className="month-grid-container">
      {/* Year Selector */}
      <div className="year-selector">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMonthClick(0, currentYear - 1)}
          className="year-btn"
        >
          ◀ {currentYear - 1}
        </motion.button>
        <h2 className="year-title">{currentYear}</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMonthClick(0, currentYear + 1)}
          className="year-btn"
        >
          {currentYear + 1} ▶
        </motion.button>
      </div>

      {/* Month Grid - 3 rows x 4 columns */}
      <div className="month-grid">
        {MONTHS.map((month, index) => {
          const key = `${currentYear}-${month.num}`;
          const count = memoryCounts[key] || 0;

          return (
            <motion.button
              key={month.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onMonthClick(month.num, currentYear)}
              className="month-button"
              style={{ backgroundColor: month.color }}
            >
              <div className="month-short">{month.short}</div>
              <div className="month-full">{month.full}</div>
              {count > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="month-count-badge"
                >
                  {count}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="month-stats">
        Total memories in {currentYear}: {totalMemories}
      </div>
    </div>
  );
}
