// components/modals/DeleteConfirmation.tsx
'use client';
import { useState } from 'react';
import Button from '@/components/ui/button/Button';
import { Modal } from '../ui/modal';

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this carer? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button color="error" onClick={onConfirm}>
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}