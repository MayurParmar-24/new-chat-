import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IoSearch, IoLogOut } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const ChatItem = ({ chat, isActive, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors ${
      isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'
    }`}
  >
    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
      {chat.name[0].toUpperCase()}
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-gray-800">{chat.name}</h3>
      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
    </div>
    {chat.unreadCount > 0 && (
      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
        <span className="text-xs text-white font-medium">{chat.unreadCount}</span>
      </div>
    )}
  </motion.div>
);

const Sidebar = ({ chats, activeChat, onChatSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    // Logout logic will be implemented here
    navigate('/login');
  };

  return (
    <div className="w-80 h-screen bg-white border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Chats</h2>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredChats.map(chat => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={activeChat?.id === chat.id}
            onClick={() => onChatSelect(chat)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <IoLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 