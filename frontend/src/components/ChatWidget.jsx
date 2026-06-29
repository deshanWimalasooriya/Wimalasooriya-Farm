import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, X, Send, Minimize2 } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';

let socket;

const ChatWidget = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const audio = new Audio('https://actions.google.com/sounds/v1/water/pop.ogg');

  // Only standard users get the chat widget (admins use the dashboard)
  const isEligible = user && !user.isAdmin;

  useEffect(() => {
    if (isEligible) {
      // Connect to socket
      socket = io('http://localhost:5001');
      
      socket.emit('join_room', user._id);

      socket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
        if (!isOpen) {
          audio.play().catch(e => console.log('Audio play failed:', e));
        }
      });

      // Fetch history
      const fetchHistory = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const res = await axios.get(`/api/chat/${user._id}`, config);
          setMessages(res.data);
        } catch (error) {
          console.error('Failed to fetch chat history', error);
        }
      };
      fetchHistory();

      return () => {
        socket.disconnect();
      };
    }
  }, [user, isEligible]);

  useEffect(() => {
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      sender: user._id,
      receiver: null, // To Admin
      content: input,
      isAdminMessage: false,
      createdAt: new Date().toISOString()
    };

    // Optimistically add to UI
    setMessages((prev) => [...prev, messageData]);
    setInput('');

    // Emit via socket
    socket.emit('send_message', { room: user._id, message: messageData });
    socket.emit('send_message', { room: 'admin_room', message: messageData }); // Alert admins

    // Save to DB
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/chat', messageData, config);
    } catch (error) {
      console.error('Failed to save message', error);
    }
  };

  if (!isEligible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-mountain-moss text-white p-4 rounded-full shadow-2xl hover:bg-mountain-brown hover:scale-105 transition-all animate-bounce"
        >
          <MessageSquare className="w-8 h-8" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] h-[500px] rounded-3xl shadow-2xl border border-mountain-gray/20 flex flex-col overflow-hidden animate-slide-up transform origin-bottom-right">
          
          {/* Header */}
          <div className="bg-mountain-brown text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-bold">Support Chat</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-mountain-sand hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto bg-mountain-sand/20 space-y-3">
            <p className="text-xs text-center text-mountain-gray mb-4">You are now chatting with Wimalasooriya Farm Support.</p>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isAdminMessage ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.isAdminMessage 
                    ? 'bg-white text-mountain-brown border border-mountain-gray/20 rounded-tl-sm' 
                    : 'bg-mountain-moss text-white rounded-tr-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-mountain-gray/20">
            <form onSubmit={sendMessage} className="flex gap-2 items-center">
              <input 
                type="text" 
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 rounded-full border border-mountain-gray/30 focus:outline-none focus:border-mountain-moss bg-mountain-sand/10 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="p-2 bg-mountain-gold text-white rounded-full hover:bg-mountain-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default ChatWidget;
