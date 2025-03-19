// components/ui/SectionList.tsx
import React from 'react';

interface SectionListProps {
  title: string;
  items: string[];
}

const SectionList = ({ title, items }: SectionListProps) => (
  <div>
    <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {items?.length > 0 ? (
        items.map((item, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-indigo-50 text-indigo-800 border border-indigo-100 rounded-lg text-sm font-medium transition-all hover:bg-indigo-100"
          >
            {item}
          </span>
        ))
      ) : (
        <span className="text-gray-500 italic">No preferences set</span>
      )}
    </div>
  </div>
);

export default SectionList;