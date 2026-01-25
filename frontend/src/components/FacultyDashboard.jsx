import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHomework } from '../context/HomeworkContext.jsx';
import { toast } from 'react-hot-toast';
import HomeworkPostModal from './HomeworkPostModal';
import HomeworkStatusModal from './HomeworkStatusModal';
import HomeworkCommentsModal from './HomeworkCommentsModal';
import api from '../services/api';

function FacultyDashboard() {
  const { user } = useAuth();
  const {
    allHomeworks,
    homeworksLoading,
    getHomeworkCompletionStatus,
    selectedHomeworkStatus,
    setSelectedHomeworkStatus
  } = useHomework();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [commentModal, setCommentModal] = useState({ isOpen: false, homework: null });

  const openComments = (homework) => {
    setCommentModal({ isOpen: true, homework });
  };

  const closeComments = () => {
    const updatedHomework = allHomeworks.find(hw => hw._id === commentModal.homework?._id);
    setCommentModal({ isOpen: false, homework: updatedHomework || null });
  };

  useEffect(() => {
    const fetchTotalStudents = async () => {
      if (user?.role === 'faculty') {
        try {
          const res = await api.get('/users/stats/students');
          setTotalStudents(res.data.totalStudents);
        } catch {
          toast.error('Failed to load student count.');
        }
      }
    };
    fetchTotalStudents();
  }, [user]);

  const handleViewStatus = (homeworkId) => {
    setSelectedHomeworkId(homeworkId);
    getHomeworkCompletionStatus(homeworkId);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedHomeworkId(null);
    setSelectedHomeworkStatus(null);
  };

  if (homeworksLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-lg sm:text-xl font-medium text-gray-600">Loading homeworks...</div>
      </div>
    );
  }

  const postedHomeworks = allHomeworks.filter(hw => hw.postedBy?._id === user._id);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-indigo-700 mb-8 text-center">
        Faculty Dashboard
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-8">
        <div className="bg-indigo-100 text-indigo-800 px-4 py-3 rounded-xl font-semibold text-center sm:text-left">
          Total Registered Students: {totalStudents}
        </div>
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition"
        >
          Post New Homework
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        Your Posted Homeworks
      </h2>

      {postedHomeworks.length === 0 ? (
        <p className="text-center text-gray-500 text-base sm:text-lg">
          You haven't posted any homework yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {postedHomeworks.map(homework => {
            const currentHomework =
              commentModal.isOpen && commentModal.homework?._id === homework._id
                ? commentModal.homework
                : homework;

            return (
              <div
                key={currentHomework._id}
                className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500 flex flex-col hover:shadow-xl transition"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {currentHomework.title}
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    {currentHomework.description}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">
                    Posted on: {new Date(currentHomework.datePosted).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    Completions: {currentHomework.completions.length} / {totalStudents}
                  </p>
                </div>

                <div className="mt-auto pt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleViewStatus(currentHomework._id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition"
                  >
                    View Status
                  </button>
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

      <HomeworkPostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      <HomeworkStatusModal
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        homeworkStatus={selectedHomeworkStatus}
        totalStudents={totalStudents}
      />
      <HomeworkCommentsModal
        isOpen={commentModal.isOpen}
        onClose={closeComments}
        homework={commentModal.homework}
      />
    </div>
  );
}

export default FacultyDashboard;