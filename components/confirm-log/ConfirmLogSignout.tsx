import React from 'react';

interface ConfirmLogSignoutProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmLogSignout: React.FC<ConfirmLogSignoutProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white p-6 h-[200px] w-[400px] text-center rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Sign out Confirmation</h2>
        <p className="mb-6">Are you sure you want to do sign out?</p>
        <div className="flex justify-center mt-4">
          <button
            className="bg-[#6FBC44] text-white px-6 py-2 rounded mr-4"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-gray-300 text-black px-6 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogSignout;