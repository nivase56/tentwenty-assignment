import React, { useState } from 'react';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: {
    project: string;
    type: string;
    description: string;
    hours: number;
  }) => void;
}

const projectOptions = ['Web App', 'Mobile App', 'API', 'Design'];
const typeOptions = ['Development', 'Bug fixes', 'Testing', 'Design'];

export const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [project, setProject] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(8);

  if (!isOpen) return null;

        // Close modal when clicking outside
        const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        };

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm text-black bg-opacity-40"
            onClick={handleOverlayClick}
          >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-lg font-bold mb-4 border-b pb-2">Add New Entry</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave({ project, type, description, hours });
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Project *</label>
            <select
              className="w-full border px-3 py-2 rounded focus:outline-none"
              value={project}
              onChange={e => setProject(e.target.value)}
              required
            >
              <option value="">Project Name</option>
              {projectOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Type of Work *</label>
            <select
              className="w-full border px-3 py-2 rounded focus:outline-none"
              value={type}
              onChange={e => setType(e.target.value)}
              required
            >
              <option value="">Type of Work</option>
              {typeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Task description *</label>
            <textarea
              className="w-full border px-3 py-2 rounded focus:outline-none"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              placeholder="Write text here ..."
              rows={3}
            />
            <div className="text-xs text-gray-400 mt-1">A note for extra info</div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Hours *</label>
            <div className="flex items-center space-x-2">
              <button type="button" className="px-2 py-1 border rounded" onClick={() => setHours(h => Math.max(1, h - 1))}>-</button>
              <span className="px-3">{hours}</span>
              <button type="button" className="px-2 py-1 border rounded" onClick={() => setHours(h => h + 1)}>+</button>
            </div>
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">Add entry</button>
            <button type="button" className="flex-1 border py-2 rounded text-gray-600" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
