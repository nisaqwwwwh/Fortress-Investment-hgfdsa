import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { SortKey, SortOrder } from '../types';

interface SortButtonProps {
  columnKey: SortKey;
  label: string;
  currentSortKey: SortKey;
  currentSortOrder: SortOrder;
  setSortKey: (key: SortKey) => void;
  setSortOrder: (order: SortOrder) => void;
}

const SortButton: React.FC<SortButtonProps> = ({
  columnKey,
  label,
  currentSortKey,
  currentSortOrder,
  setSortKey,
  setSortOrder,
}) => {
  const handleClick = () => {
    if (currentSortKey === columnKey) {
      setSortOrder(currentSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(columnKey);
      setSortOrder('asc');
    }
  };

  const isActive = currentSortKey === columnKey;

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-colors"
    >
      {label}
      {isActive && (
        currentSortOrder === 'asc' ? (
          <ChevronUp size={16} className="text-purple-400" />
        ) : (
          <ChevronDown size={16} className="text-purple-400" />
        )
      )}
    </button>
  );
};

export default SortButton;
