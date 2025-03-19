// components/ui/DetailItem.tsx
import React from 'react';

interface DetailItemProps {
  label: string;
  value: string | number;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-3">
    <dt className="text-gray-600 font-medium mb-1 sm:mb-0">{label}</dt>
    <dd className="text-gray-900 font-semibold">{value || '-'}</dd>
  </div>
);

export default DetailItem;