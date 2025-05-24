import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
type ReactNode = React.ReactNode;
import { v4 as uuidv4 } from 'uuid';
import { Message, UserContext, ChatConfig, MoodType, Gender, QuickReply } from '../types';

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => void;
  isOpen: boolean;
  toggleChat: () => void;
  userContext: UserContext;
  updateUserContext: (updates: Partial<UserContext>) => void;
  config: ChatConfig;
  quickReplies: QuickReply[];
  isTyping: boolean;
}

const defaultUserContext: UserContext = {
  gender: 'neutral',
  name: 'Friend',
  mood: 'neutral',
  wisdomLevel: 1,
  xp: 0,
};

const defaultConfig: ChatConfig = {
  isOpen: false,
  assistantName: 'Chanakya',
  assistantGender: 'neutral',
  theme: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: 'rgba(255, 255, 255, 0.1)',
    text: '#1f2937',
  },
};

const defaultQuickReplies: QuickReply[] = [
  { id: '1', text: 'How can I save money?', emoji: '💰' },
  { id: '2', text: 'I\'m feeling stressed', emoji: '😫' },
  { id: '3', text: 'Tell me a tip', emoji: '💡' },
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  defaultGender?: Gender;
  userName?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ 
  children, 
  defaultGender = 'neutral',
  userName = 'Friend'
}) => {
  console.log('Rendering ChatProvider with:', { defaultGender, userName });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const isInitialized = React.useRef(false);

  // Initialize state after first render to handle Strict Mode
  React.useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      try {
        // Log the current state of localStorage for debugging
        const savedIsOpen = localStorage.getItem('chatIsOpen');
        console.log('Chat initialization - Initial localStorage chatIsOpen:', savedIsOpen);
        
        // Force chat to be closed on initial load
        console.log('Forcing chat to closed state');
        localStorage.removeItem('chatIsOpen'); // Clear any saved state
        console.log('After clearing, localStorage chatIsOpen:', localStorage.getItem('chatIsOpen'));
        
        setIsOpen(false);
        console.log('Chat state set to closed');
      } catch (error) {
        console.error('Error initializing chat state:', error);
        setIsOpen(false);
      }
      return () => {
        console.log('ChatProvider cleanup');
      };
    }
  }, []);
  
  // Initialize user context with props or saved data
  const [userContext, setUserContext] = useState<UserContext>(() => {
    const saved = localStorage.getItem('chatUserContext');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure gender is a valid Gender type
        const gender = ['male', 'female', 'neutral'].includes(parsed.gender) 
          ? parsed.gender as Gender 
          : defaultGender;
        
        return {
          ...defaultUserContext,
          ...parsed,
          gender,
          name: parsed.name || userName
        };
      } catch (e) {
        console.error('Failed to parse saved user context', e);
      }
    }
    // Return default context with provided props
    return {
      ...defaultUserContext,
      gender: defaultGender as Gender,
      name: userName
    };
  });
  
  const [config, setConfig] = useState<ChatConfig>(() => {
    const saved = localStorage.getItem('chatConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const quickReplies = defaultQuickReplies;

  // Update config when user's gender changes
  useEffect(() => {
    console.log('User gender changed:', userContext.gender);
    
    // Set assistant name and gender based on user's gender
    // Rukmini for female users, Krishna for male users, Chanakya for neutral/unspecified
    const assistantName = userContext.gender === 'female' ? 'Rukmini' : 
                         userContext.gender === 'male' ? 'Krishna' : 'Chanakya';
    const assistantGender = (userContext.gender === 'female' ? 'female' : 
                            userContext.gender === 'male' ? 'male' : 'neutral') as Gender;
    
    console.log('Setting assistant:', { assistantName, assistantGender });
    
    setConfig(prev => {
      console.log('Previous config:', prev);
      const newConfig = {
        ...prev,
        assistantName,
        assistantGender,
      };
      console.log('New config:', newConfig);
      return newConfig;
    });
    
    // Save to localStorage
    const newConfig = {
      ...config,
      assistantName,
      assistantGender,
    };
    localStorage.setItem('chatConfig', JSON.stringify(newConfig));
    console.log('Saved to localStorage:', newConfig);
  }, [userContext.gender]);

  // Add welcome message if no messages exist
  useEffect(() => {
    console.log('Checking welcome message:', { messagesLength: messages.length, assistantName: config.assistantName });
    
    if (messages.length === 0 && config.assistantName) {
      let welcomeText = '';
      
      // Set different welcome messages based on user's gender
      if (userContext.gender === 'male') {
        welcomeText = "Hi, I'm Rukmini. How can I help you today?";
      } else if (userContext.gender === 'female') {
        welcomeText = "Hi, I'm Krishna. How can I help you today?";
      } else {
        welcomeText = "Hi, I'm Chanakya. How can I help you today?";
      }
      
      console.log('Creating welcome message:', welcomeText);
      
      const welcomeMessage = {
        id: uuidv4(),
        text: welcomeText,
        sender: 'assistant' as const,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [userContext.gender, config.assistantName]);

  const updateUserContext = (updates: Partial<UserContext>) => {
    setUserContext(prev => {
      const newContext = { ...prev, ...updates };
      localStorage.setItem('chatUserContext', JSON.stringify(newContext));
      return newContext;
    });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          gender: userContext.gender,
          mood: userContext.mood,
          // Add any other required fields
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      
      // Only add the assistant's response, not the entire history
      const responseMessage: Message = {
        id: uuidv4(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date(data.timestamp || new Date().toISOString()),
      };
      
      // Use functional update to ensure we have the latest state
      setMessages(prev => {
        // Filter out any existing assistant messages that might be duplicates
        const filtered = prev.filter(msg => 
          !(msg.sender === 'assistant' && msg.timestamp > new Date(Date.now() - 1000))
        );
        return [...filtered, responseMessage];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'assistant',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateResponse = (text: string): string => {
    // Simple response logic - in a real app, this would call your AI backend
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      return `Hello${userContext.name !== 'Friend' ? ' ' + userContext.name : ''}! How can I assist you today?`;
    } else if (lowerText.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help with?';
    } else if (lowerText.includes('money') || lowerText.includes('save')) {
      return 'A great way to save money is to follow the 50/30/20 rule: 50% needs, 30% wants, and 20% savings.';
    } else if (lowerText.includes('stressed') || lowerText.includes('anxious')) {
      updateUserContext({ mood: 'stressed' });
      return 'I\'m sorry to hear you\'re feeling stressed. Try taking a few deep breaths. Would you like me to guide you through a quick breathing exercise?';
    } else {
      return 'That\'s an interesting thought. I\'m here to help with financial advice and wellness tips. Could you tell me more about what you\'re looking for?';
    }
  };

  // Update the assistant's name based on user's gender
  useEffect(() => {
    const assistantName = userContext.gender === 'female' ? 'Krishna' : 
                         userContext.gender === 'male' ? 'Rukmini' : 'Chanakya';
    
    setConfig(prev => ({
      ...prev,
      assistantName,
      assistantGender: userContext.gender === 'female' ? 'male' : 
                      userContext.gender === 'male' ? 'female' : 'neutral'
    }));
  }, [userContext.gender]);

  const toggleChat = useCallback((forceState?: boolean) => {
    console.log('=== toggleChat called ===', { 
      forceState,
      currentState: isOpen,
      localStorageValue: localStorage.getItem('chatIsOpen')
    });
    
    // Always use the functional update form to ensure we have the latest state
    setIsOpen(prevState => {
      // If forceState is provided, use that, otherwise toggle the current state
      const newState = forceState !== undefined ? forceState : !prevState;
      
      console.log('Toggling chat from', prevState, 'to', newState);
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem('chatIsOpen', String(newState));
        console.log('Saved to localStorage:', newState);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      return newState;
    });
  }, []); // Remove isOpen from dependencies since we're using functional updates
  
  // Removed auto-open effect to allow chat to stay closed until user interaction
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    messages,
    sendMessage,
    isOpen,
    toggleChat,
    userContext,
    updateUserContext,
    config,
    quickReplies,
    isTyping,
  }), [messages, isOpen, userContext, config, quickReplies, isTyping, toggleChat, updateUserContext]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
