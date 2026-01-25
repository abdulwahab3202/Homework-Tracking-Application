import React, { useState, useRef, useEffect } from 'react';
import { useHomework } from '../context/HomeworkContext.jsx';
import { timeAgo } from '../utils/timeAgo';

function HomeworkCommentsModal({ isOpen, onClose, homework }) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useHomework();
  const commentsEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [homework?.comments.length, isOpen]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    const success = await addComment(homework._id, commentText);
    if (success) setCommentText('');
    setIsSubmitting(false);
  };

  if (!isOpen || !homework) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col max-h-[90vh]">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">
          Comments for: {homework.title}
        </h2>

        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-xl border p-4 space-y-4">
          {homework.comments?.length > 0 ? (
            homework.comments.map(comment => (
              <div
                key={comment._id}
                className="bg-white rounded-xl p-3 shadow-sm border"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1">
                  <span className="font-semibold text-gray-800 capitalize text-sm sm:text-base">
                    {comment.username} ({comment.role})
                  </span>
                  <span className="text-xs text-gray-500">
                    {timeAgo(comment.date)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  {comment.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm sm:text-base">
              No comments yet. Be the first to add one!
            </p>
          )}
          <div ref={commentsEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm sm:text-base"
            rows="3"
            placeholder="Type your question or comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            disabled={isSubmitting}
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HomeworkCommentsModal;