'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherApprovalRequest } from '@/types';

interface TeacherApprovalListProps {
  requests: TeacherApprovalRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
  isLoading?: boolean;
}

export default function TeacherApprovalList({ 
  requests, 
  onApprove, 
  onReject,
  isLoading = false 
}: TeacherApprovalListProps) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleRejectClick = (requestId: string) => {
    setRejectingId(requestId);
    setRejectionReason('');
  };

  const handleRejectConfirm = (requestId: string) => {
    onReject(requestId, rejectionReason);
    setRejectingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yoruba-green"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No pending teacher approval requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
              <p className="text-gray-600">{request.email}</p>
              {request.qualifications && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Qualifications:</span> {request.qualifications}
                </p>
              )}
              {request.experience && (
                <p className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">Experience:</span> {request.experience}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Requested on {new Date(request.requestedAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onApprove(request.id)}
                className="px-4 py-2 bg-yoruba-green text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              
              {rejectingId === request.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRejectConfirm(request.id)}
                      disabled={!rejectionReason.trim()}
                      className={`px-3 py-1 text-sm rounded-md ${
                        rejectionReason.trim() 
                          ? 'bg-yoruba-red text-white hover:bg-red-700' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setRejectingId(null)}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleRejectClick(request.id)}
                  className="px-4 py-2 border border-yoruba-red text-yoruba-red rounded-md hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
