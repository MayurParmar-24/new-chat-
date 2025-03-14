import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Chat/Sidebar';
import ChatContainer from '../../components/Chat/ChatContainer';
import { motion } from 'framer-motion';

const ChatLayout = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Fetch chats logic will be implemented here
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        chats={chats}
        activeChat={selectedChat}
        onChatSelect={setSelectedChat}
      />
      {selectedChat ? (
        <div className="flex-1">
          <ChatContainer selectedChat={selectedChat} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome, {user?.name}!
            </h3>
            <p className="text-gray-600">
              Select a chat to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout; 