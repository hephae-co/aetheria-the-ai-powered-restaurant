
import React, { useState, useRef, useEffect, PropsWithChildren } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { processChatbotMessage } from '../services/geminiService';
import Loader from './Loader';

const CHATBOT_BACKGROUND_IMAGE = 'https://storage.googleapis.com/hephae/aetheria/data/restaurant1.png';

const MenuChatbot: React.FC<PropsWithChildren> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Welcome to Aetheria. I am your AI Concierge. I can assist you with menu recommendations, restaurant details, or even booking a table. How may I serve you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "What are your vegetarian options?",
    "I'd like to book a table for 2 on Friday at 7 PM.",
    "What are your opening hours?",
    "Suggest a dessert for chocolate lovers."
  ];

  const handleSamplePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const currentHistory = [...messages, userMessage];
      const aiResponseText = await processChatbotMessage(input, currentHistory);
      
      const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { sender: 'ai', text: "I apologize, but I am momentarily unable to process your request. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="rounded-lg border border-secondary relative overflow-hidden max-w-2xl mx-auto h-[calc(100vh-80px)] flex flex-col"
      style={CHATBOT_BACKGROUND_IMAGE ? { backgroundImage: `url(${CHATBOT_BACKGROUND_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <div className="absolute top-0 right-0 z-10 p-2">{children}</div> {/* AIInsight button */}
      {CHATBOT_BACKGROUND_IMAGE && <div className="absolute inset-0 bg-black opacity-10 z-0"></div>} {/* Reduced Overlay for debugging */}
      <div
        ref={chatContainerRef}
        className="p-4 overflow-y-auto flex flex-col space-y-4 relative z-10 flex-grow"
      >
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md ${msg.sender === 'user' ? 'bg-accent text-primary rounded-br-none' : 'bg-secondary text-text-primary rounded-bl-none'}`}>
              {msg.sender === 'user' ? (
                <p>{msg.text}</p>
              ) : (
                <ReactMarkdown
                  components={{
                    strong: ({ node, ...props }) => <span className="font-bold text-accent" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc ml-4 space-y-1" {...props} />,
                    li: ({ node, ...props }) => <li className="text-text-primary" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="px-4 py-2 rounded-lg bg-secondary text-text-primary rounded-bl-none">
                <Loader text="Thinking..." />
             </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-secondary relative z-10">
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {samplePrompts.map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSamplePromptClick(prompt)}
              className="px-5 py-2.5 bg-secondary/90 backdrop-blur-md border border-white/10 text-white font-medium text-sm rounded-xl hover:bg-accent hover:text-primary hover:border-accent hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 shadow-md"
              disabled={isLoading}
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex items-center bg-secondary rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'Something vegetarian and light...'"
            className="w-full bg-transparent p-3 focus:outline-none text-text-primary"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="p-3 text-accent disabled:text-gray-500 hover:text-yellow-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 12h14" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuChatbot;
