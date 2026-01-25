import React from 'react';

function HomeworkStatusModal({ isOpen, onClose, homeworkStatus, totalStudents }) {
  if (!isOpen) return null;

  const actualCompletionsCount = homeworkStatus?.completionsCount ?? 0;
  const actualTotalStudents = homeworkStatus?.totalStudents ?? totalStudents;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-indigo-700 mb-4 text-center">
          Completion Status: {homeworkStatus?.title}
        </h2>

        <p className="text-center text-gray-600 text-sm sm:text-base mb-6">
          {actualCompletionsCount} out of {actualTotalStudents} students completed
        </p>

        <div className="mb-6">
          <h3 className="flex items-center text-green-700 font-semibold text-base sm:text-lg mb-3">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Completed Students ({homeworkStatus?.completedStudents.length || 0})
          </h3>

          {homeworkStatus?.completedStudents?.length > 0 ? (
            <div className="max-h-40 overflow-y-auto rounded-xl border border-green-300 bg-green-50 p-4">
              <ul className="space-y-2">
                {homeworkStatus.completedStudents.map(student => (
                  <li
                    key={student._id}
                    className="flex items-center text-green-800 text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {student.username}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm sm:text-base">
              No student has completed this homework yet
            </p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="flex items-center text-red-700 font-semibold text-base sm:text-lg mb-3">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Not Completed Students ({homeworkStatus?.notCompletedStudents.length || 0})
          </h3>

          {homeworkStatus?.notCompletedStudents?.length > 0 ? (
            <div className="max-h-40 overflow-y-auto rounded-xl border border-red-300 bg-red-50 p-4">
              <ul className="space-y-2">
                {homeworkStatus.notCompletedStudents.map(student => (
                  <li
                    key={student._id}
                    className="flex items-center text-red-800 text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {student.username}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm sm:text-base">
              All students have completed this homework
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeworkStatusModal;