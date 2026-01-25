import React, { useState } from 'react';
import { useHomework } from '../context/HomeWorkContext';

function HomeworkPostModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createHomework } = useHomework();

  const handleFileChange = e => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      setFile(null);
      setFileName('No file chosen');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (dueDate) formData.append('dueDate', dueDate);
    if (file) formData.append('homeworkFile', file);

    const success = await createHomework(formData);
    if (success) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setFile(null);
      setFileName('No file chosen');
      onClose();
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-indigo-700 mb-6 text-center">
          Post New Homework
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
            placeholder="Homework title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm sm:text-base"
            placeholder="Homework description"
            rows="4"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            disabled={isSubmitting}
          />

          <label
            htmlFor="homeworkFile"
            className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition text-sm sm:text-base"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="truncate text-gray-600">{fileName}</span>
          </label>

          <input
            type="file"
            id="homeworkFile"
            className="hidden"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
            >
              {isSubmitting ? 'Posting...' : 'Post Homework'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HomeworkPostModal;