
import { createContext, useContext, useState, useEffect } from "react";

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "member";
  completionPercentage: number;
}

export interface GroupTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string[];
  completed: boolean;
  createdAt: Date;
}

export interface GroupMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  tasks: GroupTask[];
  messages: GroupMessage[];
  createdAt: Date;
}

interface GroupContextType {
  groups: StudyGroup[];
  currentGroup: StudyGroup | null;
  setCurrentGroup: (groupId: string | null) => void;
  addGroup: (group: Omit<StudyGroup, "id" | "createdAt">) => void;
  updateGroup: (id: string, updates: Partial<StudyGroup>) => void;
  deleteGroup: (id: string) => void;
  addGroupTask: (groupId: string, task: Omit<GroupTask, "id" | "createdAt">) => void;
  updateGroupTask: (groupId: string, taskId: string, updates: Partial<GroupTask>) => void;
  deleteGroupTask: (groupId: string, taskId: string) => void;
  sendMessage: (groupId: string, message: Omit<GroupMessage, "id" | "timestamp">) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

// Mock user for demo purposes
const CURRENT_USER_ID = "user1";

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize groups from localStorage or with demo data
  const [groups, setGroups] = useState<StudyGroup[]>(() => {
    const savedGroups = localStorage.getItem("studyGroups");
    if (savedGroups) {
      try {
        // Convert string dates back to Date objects
        const parsedGroups = JSON.parse(savedGroups);
        return parsedGroups.map((group: any) => ({
          ...group,
          createdAt: new Date(group.createdAt),
          tasks: group.tasks.map((task: any) => ({
            ...task,
            dueDate: new Date(task.dueDate),
            createdAt: new Date(task.createdAt),
          })),
          messages: group.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      } catch (e) {
        return getDemoGroups();
      }
    }
    return getDemoGroups();
  });

  const [currentGroup, setCurrentGroupState] = useState<StudyGroup | null>(null);

  // Save groups to localStorage when they change
  useEffect(() => {
    localStorage.setItem("studyGroups", JSON.stringify(groups));
  }, [groups]);

  const setCurrentGroup = (groupId: string | null) => {
    if (!groupId) {
      setCurrentGroupState(null);
      return;
    }
    
    const group = groups.find((g) => g.id === groupId) || null;
    setCurrentGroupState(group);
  };

  const addGroup = (group: Omit<StudyGroup, "id" | "createdAt">) => {
    const newGroup: StudyGroup = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  const updateGroup = (id: string, updates: Partial<StudyGroup>) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === id ? { ...group, ...updates } : group
      )
    );
    
    // Update current group if it's the one being updated
    if (currentGroup?.id === id) {
      setCurrentGroupState((prev) => prev ? { ...prev, ...updates } : prev);
    }
  };

  const deleteGroup = (id: string) => {
    setGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
    
    // Reset current group if it's the one being deleted
    if (currentGroup?.id === id) {
      setCurrentGroupState(null);
    }
  };

  const addGroupTask = (groupId: string, task: Omit<GroupTask, "id" | "createdAt">) => {
    const newTask: GroupTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, tasks: [...group.tasks, newTask] }
          : group
      )
    );
    
    // Update current group if needed
    if (currentGroup?.id === groupId) {
      setCurrentGroupState((prev) => 
        prev ? { ...prev, tasks: [...prev.tasks, newTask] } : prev
      );
    }
  };

  const updateGroupTask = (groupId: string, taskId: string, updates: Partial<GroupTask>) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            }
          : group
      )
    );
    
    // Update current group if needed
    if (currentGroup?.id === groupId) {
      setCurrentGroupState((prev) => 
        prev ? {
          ...prev, 
          tasks: prev.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        } : prev
      );
    }
  };

  const deleteGroupTask = (groupId: string, taskId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.filter((task) => task.id !== taskId),
            }
          : group
      )
    );
    
    // Update current group if needed
    if (currentGroup?.id === groupId) {
      setCurrentGroupState((prev) => 
        prev ? {
          ...prev, 
          tasks: prev.tasks.filter((task) => task.id !== taskId)
        } : prev
      );
    }
  };

  const sendMessage = (groupId: string, message: Omit<GroupMessage, "id" | "timestamp">) => {
    const newMessage: GroupMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, messages: [...group.messages, newMessage] }
          : group
      )
    );
    
    // Update current group if needed
    if (currentGroup?.id === groupId) {
      setCurrentGroupState((prev) => 
        prev ? { ...prev, messages: [...prev.messages, newMessage] } : prev
      );
    }
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        currentGroup,
        setCurrentGroup,
        addGroup,
        updateGroup,
        deleteGroup,
        addGroupTask,
        updateGroupTask,
        deleteGroupTask,
        sendMessage,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = (): GroupContextType => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
};

// Demo data for initial state
function getDemoGroups(): StudyGroup[] {
  return [
    {
      id: "group1",
      name: "Math Buddies",
      description: "Group for calculus and algebra study sessions",
      members: [
        {
          id: "user1",
          name: "You",
          avatar: "/avatar1.png",
          role: "admin",
          completionPercentage: 75,
        },
        {
          id: "user2",
          name: "Alex Johnson",
          avatar: "/avatar2.png",
          role: "member",
          completionPercentage: 60,
        },
        {
          id: "user3",
          name: "Taylor Swift",
          avatar: "/avatar3.png",
          role: "member",
          completionPercentage: 90,
        },
      ],
      tasks: [
        {
          id: "task1",
          title: "Calculus Chapter 5 Problems",
          description: "Complete problems 5-15 from the textbook",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          assignedTo: ["user1", "user2"],
          completed: false,
          createdAt: new Date(),
        },
      ],
      messages: [
        {
          id: "msg1",
          senderId: "user2",
          text: "Hey everyone! Should we meet on Thursday for the study session?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          id: "msg2",
          senderId: "user3",
          text: "Thursday works for me. What time?",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        },
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    },
    {
      id: "group2",
      name: "History Study Group",
      description: "For the upcoming World History exam",
      members: [
        {
          id: "user1",
          name: "You",
          avatar: "/avatar1.png",
          role: "member",
          completionPercentage: 50,
        },
        {
          id: "user4",
          name: "Jamie Smith",
          avatar: "/avatar4.png",
          role: "admin",
          completionPercentage: 80,
        },
      ],
      tasks: [],
      messages: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ];
}
