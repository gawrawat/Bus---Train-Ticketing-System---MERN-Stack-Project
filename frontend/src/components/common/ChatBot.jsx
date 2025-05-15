import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: '👋 Hello! I can help you with information about public transportation in Sri Lanka. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Navigation related queries
    if (lowerQuery.includes('bus ticket') || lowerQuery.includes('book bus')) {
      handleNavigation('/bus');
      return '🚌 Taking you to bus booking page...';
    }
    if (lowerQuery.includes('train ticket') || lowerQuery.includes('book train')) {
      handleNavigation('/train');
      return '🚂 Taking you to train booking page...';
    }
    if (lowerQuery.includes('my booking') || lowerQuery.includes('my tickets')) {
      handleNavigation('/profile');
      return '🎫 Taking you to your bookings...';
    }
    if (lowerQuery.includes('contact') || lowerQuery.includes('contact us') || lowerQuery.includes('how to reach you')) {
      handleNavigation('/#contact');
      return '📞 Taking you to our contact section...';
    }
    if (lowerQuery.includes('services') || lowerQuery.includes('what services') || lowerQuery.includes('offerings')) {
      handleNavigation('/#services');
      return '✨ Taking you to our services section...';
    }
    if (lowerQuery.includes('gallery') || lowerQuery.includes('photos') || lowerQuery.includes('images')) {
      handleNavigation('/#gallery');
      return '🖼️ Taking you to our gallery section...';
    }
    if (lowerQuery.includes('history') || lowerQuery.includes('about us') || lowerQuery.includes('story')) {
      handleNavigation('/#history');
      return '📚 Taking you to our history section...';
    }

    // Sri Lanka transportation related queries
    if (lowerQuery.includes('bus routes') || lowerQuery.includes('bus schedule')) {
      return '🚌 Sri Lanka has an extensive bus network operated by both government (SLTB) and private operators. Major routes connect Colombo with all major cities. You can check specific routes and schedules on our booking page.';
    }
    if (lowerQuery.includes('train routes') || lowerQuery.includes('train schedule')) {
      return '🚂 Sri Lanka Railways operates trains across the island. Major routes include Colombo to Kandy, Badulla, Galle, and Jaffna. You can view all schedules and book tickets on our train booking page.';
    }
    if (lowerQuery.includes('bus fare') || lowerQuery.includes('bus price')) {
      return '💰 Bus fares in Sri Lanka vary based on distance and bus type. Regular buses are cheaper, while luxury buses (A/C) cost more. You can check exact fares when booking on our website.';
    }
    if (lowerQuery.includes('train fare') || lowerQuery.includes('train price')) {
      return '💰 Train fares depend on the class (1st, 2nd, or 3rd) and distance. 1st class is most expensive but most comfortable, while 3rd class is most economical. Check our booking page for current fares.';
    }

    return "🤔 I can help you with information about bus and train services in Sri Lanka, including routes, schedules, fares, and booking. You can also ask me to take you to specific sections like contact, services, gallery, or history. Please ask a specific question about public transportation in Sri Lanka.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    
    // Get bot response
    const response = handleQuery(input);
    
    // Add bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', content: response }]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col border border-blue-200 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Transportation Assistant
              </h3>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)} 
                className="hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Chat Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=2128&auto=format&fit=crop")',
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about transportation in Sri Lanka..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-sm"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all transform"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </div>
  );
};

export default ChatBot; 