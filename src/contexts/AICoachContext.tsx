
import { createContext, useContext, useState, useEffect } from "react";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface SuggestedPrompt {
  id: string;
  text: string;
}

interface AICoachContextType {
  messages: AIMessage[];
  sending: boolean;
  suggestedPrompts: SuggestedPrompt[];
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const AICoachContext = createContext<AICoachContextType | undefined>(undefined);

export const AICoachProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize chat history from localStorage
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    const savedMessages = localStorage.getItem("aiCoachMessages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        return parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      } catch (e) {
        return getInitialMessages();
      }
    }
    return getInitialMessages();
  });

  const [sending, setSending] = useState<boolean>(false);
  
  // Dynamic suggested prompts based on context
  const [suggestedPrompts, setSuggestedPrompts] = useState<SuggestedPrompt[]>([
    { id: "1", text: "I have a math exam tomorrow. How should I prepare?" },
    { id: "2", text: "Can you break down this big project into smaller tasks?" },
    { id: "3", text: "I'm feeling unmotivated. How can I get back on track?" },
    { id: "4", text: "What's a good study schedule for 3 hours?" },
  ]);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem("aiCoachMessages", JSON.stringify(messages));
  }, [messages]);

  // In a real app, this would call an API with your OpenAI key
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setSending(true);
    
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would call the OpenAI API here
      // const response = await callOpenAIAPI(content);
      
      // Generate AI response based on user input
      let aiResponse = "";
      
      const lowercaseContent = content.toLowerCase();
      
      if (lowercaseContent.includes("exam") || lowercaseContent.includes("test")) {
        aiResponse = "For exam preparation, I recommend:\n\n1. Create a study schedule with specific topics\n2. Use active recall techniques rather than passive reading\n3. Take practice tests under timed conditions\n4. Get enough sleep the night before\n\nWould you like me to create a detailed study plan?";
      } 
      else if (lowercaseContent.includes("schedule") || lowercaseContent.includes("plan")) {
        aiResponse = "Here's a suggested study schedule:\n\n• 25 minutes focused study + 5 minute break (Pomodoro technique)\n• Alternate between different subjects to maintain interest\n• Include brief review sessions of previous material\n• Schedule harder topics during your peak energy hours\n\nShall I customize this for your specific subjects?";
      } 
      else if (lowercaseContent.includes("motivation") || lowercaseContent.includes("focus")) {
        aiResponse = "When motivation is low, try these strategies:\n\n• Set very small, achievable goals to build momentum\n• Use the 5-minute rule: commit to just 5 minutes of work\n• Change your environment to reduce distractions\n• Remind yourself of your long-term goals\n• Consider a study buddy for accountability";
      }
      else if (lowercaseContent.includes("task") || lowercaseContent.includes("organizing")) {
        aiResponse = "Here are tips for organizing tasks effectively:\n\n• Break large tasks into smaller, manageable chunks\n• Prioritize tasks based on importance and deadlines\n• Use a task management system (digital or physical)\n• Set specific time blocks for different types of tasks\n• Review and adjust your task list regularly\n\nWould you like more specific advice on organizing study tasks?";
      }
      else if (lowercaseContent.includes("purpose") || lowercaseContent.includes("website")) {
        aiResponse = "This website is designed to be your personal study companion. It helps you:\n\n• Organize your study tasks and assignments\n• Create effective study plans tailored to your needs\n• Track your learning progress over time\n• Get personalized advice on study techniques\n• Connect with study groups for collaborative learning\n\nIs there a specific feature you'd like to learn more about?";
      }
      else if (lowercaseContent.includes("hello") || lowercaseContent.includes("hi")) {
        aiResponse = "Hello! 👋 I'm your AI study coach. I'm here to help you with:\n\n• Creating effective study plans\n• Breaking down complex topics\n• Suggesting learning techniques\n• Managing your study time\n• Staying motivated\n\nWhat would you like help with today?";
      }
      else {
        aiResponse = "I'm your AI study coach! I can help you create study plans, break down complex topics, suggest learning strategies, or provide motivation when you're stuck. What specifically would you like help with today?";
      }
      
      // Add AI response
      const assistantMessage: AIMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Update suggested prompts based on the conversation
      updateSuggestedPrompts(content, aiResponse);
      
    } catch (error) {
      console.error("Error sending message to AI coach:", error);
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    setMessages(getInitialMessages());
  };
  
  const updateSuggestedPrompts = (userMessage: string, aiResponse: string) => {
    // Logic to generate contextual prompts based on the conversation
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes("exam")) {
      setSuggestedPrompts([
        { id: "1", text: "What study techniques work best for memorization?" },
        { id: "2", text: "How do I manage test anxiety?" },
        { id: "3", text: "Can you quiz me on this topic?" },
        { id: "4", text: "What should I do the night before an exam?" },
      ]);
    } else if (lowercaseMessage.includes("schedule") || lowercaseMessage.includes("plan")) {
      setSuggestedPrompts([
        { id: "1", text: "How do I balance multiple subjects?" },
        { id: "2", text: "What's the optimal break time between study sessions?" },
        { id: "3", text: "How can I track my progress?" },
        { id: "4", text: "Should I study in the morning or at night?" },
      ]);
    } else if (lowercaseMessage.includes("motivation")) {
      setSuggestedPrompts([
        { id: "1", text: "How can I make studying more enjoyable?" },
        { id: "2", text: "What are some good reward systems for completing tasks?" },
        { id: "3", text: "How do I build a consistent study habit?" },
        { id: "4", text: "I'm procrastinating. How do I start?" },
      ]);
    } else if (lowercaseMessage.includes("task") || lowercaseMessage.includes("organizing")) {
      setSuggestedPrompts([
        { id: "1", text: "How do I prioritize tasks effectively?" },
        { id: "2", text: "What tools can help with task management?" },
        { id: "3", text: "How do I avoid feeling overwhelmed by tasks?" },
        { id: "4", text: "How often should I review my task list?" },
      ]);
    } else if (lowercaseMessage.includes("purpose") || lowercaseMessage.includes("website")) {
      setSuggestedPrompts([
        { id: "1", text: "How can I get the most out of this platform?" },
        { id: "2", text: "Are there any study groups I can join?" },
        { id: "3", text: "How do I track my progress over time?" },
        { id: "4", text: "Can you help me create a study plan?" },
      ]);
    }
  };

  return (
    <AICoachContext.Provider
      value={{
        messages,
        sending,
        suggestedPrompts,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </AICoachContext.Provider>
  );
};

export const useAICoach = (): AICoachContextType => {
  const context = useContext(AICoachContext);
  if (context === undefined) {
    throw new Error("useAICoach must be used within an AICoachProvider");
  }
  return context;
};

// Initial welcome messages
function getInitialMessages(): AIMessage[] {
  return [
    {
      id: "assistant-1",
      role: "assistant",
      content: "👋 Hi there! I'm your AI Study Coach. I'm here to help you organize your study schedule, break down complex topics, and keep you motivated.",
      timestamp: new Date(),
    },
    {
      id: "assistant-2",
      role: "assistant",
      content: "What would you like help with today?",
      timestamp: new Date(),
    },
  ];
}
