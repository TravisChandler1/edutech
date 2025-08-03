'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthUser } from '@/lib/auth';
import { StudyGroup, GroupMessage } from '@/types';
import { 
  FaUsers, FaSearch, FaPaperPlane, FaFile, 
  FaCalendarAlt, FaArrowLeft, FaEllipsisV
} from 'react-icons/fa';

interface GroupDetailProps {
  group: StudyGroup;
  currentUser: AuthUser;
  onBack: () => void;
}

export default function GroupDetail({ group, currentUser, onBack }: GroupDetailProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'events' | 'files'>('chat');
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGroupData();
  }, [group.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/groups/${group.id}/details`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Group data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      groupId: group.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      messageType: 'text' as const,
      content: newMessage.trim()
    };

    try {
      const response = await fetch(`/api/groups/${group.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('groupId', group.id);
    formData.append('uploaderId', currentUser.id);
    formData.append('uploaderName', currentUser.name);

    try {
      const response = await fetch(`/api/groups/${group.id}/files`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        // Add file message to chat
        const fileMessage: GroupMessage = {
          id: Date.now().toString(),
          groupId: group.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          messageType: 'file',
          content: `Shared a file: ${file.name}`,
          fileUrl: data.fileUrl,
          fileName: file.name,
          fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          isEdited: false,
          sentAt: new Date().toISOString(),
          readBy: []
        };
        setMessages(prev => [...prev, fileMessage]);
      }
    } catch (err) {
      console.error('Failed to upload file:', err);
    }
  };

  const renderChatTab = () => (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yoruba-gold"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <FaUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
            <p className="text-white/70">Start the conversation by sending the first message!</p>
          </div>
        ) : (
          messages.map((message, _index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === currentUser.id
                  ? 'bg-yoruba-gold text-yoruba-navy'
                  : 'bg-white/10 text-white'
              }`}>
                {message.senderId !== currentUser.id && (
                  <p className="text-xs opacity-70 mb-1">{message.senderName}</p>
                )}
                
                {message.messageType === 'file' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FaFile className="w-4 h-4" />
                      <span className="text-sm">{message.fileName}</span>
                    </div>
                    <p className="text-xs opacity-70">{message.fileSize}</p>
                    {message.fileUrl && (
                      <a 
                        href={message.fileUrl} 
                        download 
                        className="text-xs underline hover:no-underline"
                      >
                        Download
                      </a>
                    )}
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
                
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <FaFile className="w-5 h-5" />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
          />
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded-lg border border-white/20 focus:border-yoruba-gold focus:outline-none"
          />
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-yoruba-gold text-yoruba-navy p-2 rounded-lg hover:bg-yoruba-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMembersTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Members ({group.members.length})</h3>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-yoruba-gold text-yoruba-navy px-4 py-2 rounded-lg hover:bg-yoruba-gold/90 transition-colors flex items-center space-x-2"
        >
          <FaUsers className="w-4 h-4" />
          <span>Invite</span>
        </button>
      </div>

      <div className="space-y-3">
        {group.members.map((member) => (
          <div key={member.userId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yoruba-gold rounded-full flex items-center justify-center">
                <span className="text-yoruba-navy font-semibold">
                  {member.userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{member.userName}</p>
                <p className="text-white/60 text-sm">{member.userEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {member.role === 'admin' && (
                <span className="bg-yoruba-blue text-white px-2 py-1 rounded text-xs">Admin</span>
              )}
              <div className={`w-3 h-3 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Events</h3>
        <button
          onClick={() => setShowEventModal(true)}
          className="bg-yoruba-gold text-yoruba-navy px-4 py-2 rounded-lg hover:bg-yoruba-gold/90 transition-colors flex items-center space-x-2"
        >
          <FaCalendarAlt className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      <div className="text-center py-12">
        <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No events scheduled</h3>
        <p className="text-white/70">Create your first group event to get started!</p>
      </div>
    </div>
  );

  const renderFilesTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Shared Files</h3>
      </div>

      <div className="text-center py-12">
        <FaFile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No files shared</h3>
        <p className="text-white/70">Share documents, images, and other files in the chat!</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-yoruba-navy via-yoruba-navy/95 to-yoruba-blue min-h-screen">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-white hover:text-yoruba-gold transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{group.name}</h1>
              <p className="text-white/70 text-sm">{group.members.length} members</p>
            </div>
          </div>
          <button className="text-white hover:text-yoruba-gold transition-colors">
            <FaEllipsisV className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/5 border-b border-white/10">
        <div className="flex">
          {[
            { id: 'chat', label: 'Chat', icon: FaUsers },
            { id: 'members', label: 'Members', icon: FaUsers },
            { id: 'events', label: 'Events', icon: FaCalendarAlt },
            { id: 'files', label: 'Files', icon: FaFile }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 transition-colors ${
                activeTab === tab.id
                  ? 'bg-yoruba-gold text-yoruba-navy'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 h-[calc(100vh-140px)]">
        {activeTab === 'chat' && renderChatTab()}
        {activeTab === 'members' && renderMembersTab()}
        {activeTab === 'events' && renderEventsTab()}
        {activeTab === 'files' && renderFilesTab()}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteModal
            group={group}
            currentUser={currentUser}
            onClose={() => setShowInviteModal(false)}
          />
        )}
        {showEventModal && (
          <EventModal
            group={group}
            currentUser={currentUser}
            onClose={() => setShowEventModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Invite Modal Component
function InviteModal({ group, currentUser, onClose }: { group: StudyGroup; currentUser: AuthUser; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        // Filter out users already in the group
        const existingMemberIds = group.members.map(m => m.userId);
        const filteredResults = data.users.filter((user: any) => 
          !existingMemberIds.includes(user.id) && user.id !== currentUser.id
        );
        setSearchResults(filteredResults);
      }
    } catch (err) {
      console.error('Failed to search users:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendInvite = async (userId: string, userName: string, userEmail: string) => {
    try {
      const response = await fetch(`/api/groups/${group.id}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteeId: userId,
          inviteeName: userName,
          inviteeEmail: userEmail,
          inviterId: currentUser.id,
          inviterName: currentUser.name
        })
      });

      const data = await response.json();
      if (data.success) {
        // Remove user from search results
        setSearchResults(prev => prev.filter(user => user.id !== userId));
      }
    } catch (err) {
      console.error('Failed to send invite:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-yoruba-navy mb-4">Invite Members</h2>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
              placeholder="Search by name or email..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-yoruba-gold focus:outline-none"
            />
            <button
              onClick={searchUsers}
              disabled={loading || !searchQuery.trim()}
              className="bg-yoruba-gold text-yoruba-navy px-4 py-2 rounded-lg hover:bg-yoruba-gold/90 transition-colors disabled:opacity-50"
            >
              <FaSearch className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yoruba-gold mx-auto"></div>
              </div>
            ) : searchResults.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {searchQuery ? 'No users found' : 'Search for users to invite'}
              </p>
            ) : (
              searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yoruba-navy">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Plan: {user.selectedPlan || 'Novice'}</p>
                  </div>
                  <button
                    onClick={() => sendInvite(user.id, user.name, user.email)}
                    className="bg-yoruba-blue text-white px-3 py-1 rounded text-sm hover:bg-yoruba-blue/90 transition-colors"
                  >
                    Invite
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Event Modal Component
function EventModal({ group, currentUser, onClose }: { group: StudyGroup; currentUser: AuthUser; onClose: () => void }) {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    eventType: 'study_session' as const,
    scheduledDate: '',
    duration: 60,
    location: '',
    meetingLink: ''
  });

  const createEvent = async () => {
    try {
      const response = await fetch(`/api/groups/${group.id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventData,
          creatorId: currentUser.id,
          creatorName: currentUser.name
        })
      });

      const data = await response.json();
      if (data.success) {
        onClose();
      }
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-yoruba-navy mb-4">Create Event</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yoruba-gold focus:outline-none"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={eventData.description}
              onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yoruba-gold focus:outline-none"
              rows={3}
              placeholder="Event description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select
              value={eventData.eventType}
              onChange={(e) => setEventData(prev => ({ ...prev, eventType: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yoruba-gold focus:outline-none"
            >
              <option value="study_session">Study Session</option>
              <option value="discussion">Discussion</option>
              <option value="meeting">Meeting</option>
              <option value="social">Social</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              value={eventData.scheduledDate}
              onChange={(e) => setEventData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yoruba-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={eventData.duration}
              onChange={(e) => setEventData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yoruba-gold focus:outline-none"
              min="15"
              step="15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link (optional)</label>
            <input
              type="url"
              value={eventData.meetingLink}
              onChange={(e) => setEventData(prev => ({ ...prev, meetingLink: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yoruba-gold focus:outline-none"
              placeholder="https://meet.google.com/..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={createEvent}
            disabled={!eventData.title || !eventData.scheduledDate}
            className="bg-yoruba-gold text-yoruba-navy px-4 py-2 rounded-lg hover:bg-yoruba-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Event
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
