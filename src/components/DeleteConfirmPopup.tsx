'use client';

import React from 'react';
import { X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteConfirmationPopup: React.FC<Props> = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
        <div className="flex mb-6">
          <p className="text-black flex-1 font-bold">Are you sure that you wish to delete this task?</p>
          <div>

          <button 
            onClick={onCancel}
            className="text-black hover:text-gray-500 cursor-pointer font-bold flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-[#941B0F] text-[#941B0F] bg-white rounded cursor-pointer hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-white bg-[#941B0F] rounded cursor-pointer hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;