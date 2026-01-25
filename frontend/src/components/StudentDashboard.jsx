import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHomework } from '../context/HomeworkContext.jsx';
import HomeworkCommentsModal from './HomeworkCommentsModal';

const BACKEND_URL = process.env.VITE_API_URL || 'http://localhost:5000';

function StudentDashboard() {
  const { user } = useAuth();
  const { allHomeworks, homeworksLoading, completeHomework } = useHomework();
  const [loadingCompletion, setLoadingCompletion] = useState({});
  const [commentModal, setCommentModal] = useState({ isOpen: false, homework: null });

  const openComments = homework => {
    setCommentModal({ isOpen: true, homework });
  };

  const closeComments = () => {
    const updatedHomework = allHomeworks.find(hw => hw._id === commentModal.homework?._id);
    setCommentModal({ isOpen: false, homework: updatedHomework || null });
  };

  const handleCompleteHomework = async homeworkId => {
    setLoadingCompletion(prev => ({ ...prev, [homeworkId]: true }));
    await completeHomework(homeworkId);
    setLoadingCompletion(prev => ({ ...prev, [homeworkId]: false }));
  };

  const getHomeworkStatus = homework => {
    const isCompleted = homework.completions.includes(user._id);
    if (isCompleted) return { text: 'Completed', color: 'green' };
    if (!homework.dueDate) return { text: 'Pending', color: 'blue' };
    const today = new Date();
    const dueDate = new Date(homework.dueDate);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    if (dueDate < today) return { text: 'Overdue', color: 'red' };
    if (dueDate.getTime() === today.getTime()) return { text: 'Due Today', color: 'yellow' };
    return { text: 'Pending', color: 'blue' };
  };

  if (homeworksLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-lg sm:text-xl font-medium text-gray-600">Loading homeworks...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo-700 mb-8 text-center">
        Your Homework Assignments
      </h1>

      {allHomeworks.length === 0 ? (
        <div className="text-center mt-16 text-gray-500 text-base sm:text-lg">
          No homework assignments posted yet. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allHomeworks.map(homework => {
            const status = getHomeworkStatus(homework);
            const isCompleted = status.text === 'Completed';

            const borderColor =
              status.color === 'green' ? 'border-green-500' :
                status.color === 'red' ? 'border-red-500' :
                  status.color === 'yellow' ? 'border-yellow-500' :
                    'border-blue-500';

            const badgeColor =
              status.color === 'green' ? 'bg-green-100 text-green-800' :
                status.color === 'red' ? 'bg-red-100 text-red-800' :
                  status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800';

            const currentHomework =
              commentModal.isOpen && commentModal.homework?._id === homework._id
                ? commentModal.homework
                : homework;

            return (
              <div
                key={currentHomework._id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-t-4 ${borderColor} flex flex-col hover:shadow-xl transition`}
              >
                <div className="flex justify-between items-start mb-3 gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {currentHomework.title}
                  </h2>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeColor}`}>
                    {status.text}
                  </span>
                </div>

                <div className="flex-grow">
                  <p className="text-gray-700 text-sm sm:text-base mb-4 break-words break-all">
                    {currentHomework.description}
                  </p>


                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    Posted by <span className="font-medium">{currentHomework.postedBy?.username || 'Unknown'}</span> on{' '}
                    {new Date(currentHomework.datePosted).toLocaleDateString()}
                  </p>

                  {currentHomework.dueDate && (
                    <p
                      className={`text-sm font-medium mb-4 ${status.color === 'red'
                          ? 'text-red-600'
                          : status.color === 'yellow'
                            ? 'text-yellow-600'
                            : 'text-gray-500'
                        }`}
                    >
                      Due on: {new Date(currentHomework.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
                  {isCompleted ? (
                    <span className="flex items-center text-green-600 font-semibold">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCompleteHomework(currentHomework._id)}
                      disabled={loadingCompletion[currentHomework._id]}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition"
                    >
                      {loadingCompletion[currentHomework._id] ? 'Marking...' : 'Mark as Complete'}
                    </button>
                  )}

                  {currentHomework.filePath && (
                    <a
                      href={`${BACKEND_URL}/${currentHomework.filePath.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  )}

                  <button
                    onClick={() => openComments(currentHomework)}
                    className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10z" />
                    </svg>
                    ({currentHomework.comments.length})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <HomeworkCommentsModal
        isOpen={commentModal.isOpen}
        onClose={closeComments}
        homework={commentModal.homework}
      />
    </div>
  );
}

export default StudentDashboard;