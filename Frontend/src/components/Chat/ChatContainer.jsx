import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { IoSend, IoImage, IoHappy, IoAttach, IoCheckmarkDone } from 'react-icons/io5';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { socketService } from '../../services/socket';
import { getMessages, sendMessage } from '../../lib/api';
import { setMessages, addMessage } from '../../store/slices/chatSlice';
import { toast } from 'react-hot-toast';

const Message = ({ message, isOwn }) => {
  const hasAttachment = message.attachment?.url;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[70%] ${isOwn ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'} rounded-2xl px-4 py-2`}>
        {hasAttachment && (
          <div className="mb-2">
            {message.attachment.type?.startsWith('image') ? (
              <img 
                src={message.attachment.url} 
                alt="attachment" 
                className="rounded-lg max-w-full h-auto"
              />
            ) : (
              <a 
                href={message.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:underline"
              >
                <IoAttach />
                <span>{message.attachment.name}</span>
              </a>
            )}
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <p className="text-xs opacity-70">
            {format(new Date(message.timestamp), 'HH:mm')}
          </p>
          {isOwn && (
            <IoCheckmarkDone 
              className={message.read ? 'text-blue-400' : 'opacity-70'} 
              size={16} 
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ChatContainer = ({ selectedChat }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const user = useSelector((state) => state.auth.user);
  const messages = useSelector((state) => state.chat.messages[selectedChat?.id] || []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat?.id) {
        try {
          const data = await getMessages(selectedChat.id);
          dispatch(setMessages({ chatId: selectedChat.id, messages: data }));
        } catch (error) {
          toast.error('Failed to load messages');
        }
      }
    };

    fetchMessages();
  }, [selectedChat?.id, dispatch]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }
      setAttachment({
        file,
        preview: file.type.startsWith('image') ? URL.createObjectURL(file) : null,
      });
    }
  };

  const handleTyping = () => {
    socketService.typing(selectedChat.id, true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.typing(selectedChat.id, false);
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !attachment) return;

    try {
      const formData = new FormData();
      if (message.trim()) {
        formData.append('content', message.trim());
      }
      if (attachment) {
        formData.append('attachment', attachment.file);
      }

      const response = await sendMessage(selectedChat.id, formData);
      dispatch(addMessage({
        chatId: selectedChat.id,
        message: response.message,
      }));

      setMessage('');
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
            {selectedChat?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{selectedChat?.name}</h3>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50"
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <Message 
              key={msg.id || index}
              message={msg}
              isOwn={msg.senderId === user?.id}
            />
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-sm">Typing...</p>
          </div>
        )}
      </div>

      {/* Attachment Preview */}
      {attachment && (
        <div className="px-6 py-2 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {attachment.preview ? (
                <img 
                  src={attachment.preview} 
                  alt="attachment preview" 
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <IoAttach size={24} className="text-gray-500" />
                </div>
              )}
              <span className="text-sm text-gray-600 truncate max-w-xs">
                {attachment.file.name}
              </span>
            </div>
            <button
              onClick={() => setAttachment(null)}
              className="text-red-500 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="px-6 py-4 border-t bg-white">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <IoImage size={24} />
          </button>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 hover:text-indigo-600 transition-colors relative"
          >
            <IoHappy size={24} />
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2">
                <Picker 
                  data={data} 
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                  previewPosition="none"
                />
              </div>
            )}
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 focus:outline-none"
          >
            <IoSend size={20} />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ChatContainer; 