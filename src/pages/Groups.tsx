
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useGroups } from "@/contexts/GroupContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, MessageSquare, Calendar, ClipboardList, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Groups() {
  const {
    groups,
    currentGroup,
    setCurrentGroup,
    addGroup,
    sendMessage,
  } = useGroups();
  
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("groups");
  
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  
  const [messageInput, setMessageInput] = useState("");
  
  const createNewGroup = () => {
    if (!newGroupName.trim()) return;
    
    addGroup({
      name: newGroupName,
      description: newGroupDescription,
      members: [
        {
          id: "user1", // Mock user ID
          name: "You",
          avatar: "/avatar1.png",
          role: "admin",
          completionPercentage: 0,
        },
      ],
      tasks: [],
      messages: [],
    });
    
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupOpen(false);
  };
  
  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentGroup) return;
    
    sendMessage(currentGroup.id, {
      senderId: "user1", // Mock user ID
      text: messageInput,
    });
    
    setMessageInput("");
  };

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Groups</h1>
            <p className="text-muted-foreground">
              Collaborate with friends on assignments and studies
            </p>
          </div>
          <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2">
                <Plus size={18} />
                <span>New Group</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Study Group</DialogTitle>
                <DialogDescription>
                  Create a group to collaborate with others on assignments and study sessions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Group Name
                  </label>
                  <Input
                    id="name"
                    placeholder="e.g., Physics Study Group"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="What will this group focus on?"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createNewGroup}>Create Group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs
          defaultValue="groups"
          value={selectedTab}
          onValueChange={(val) => {
            setSelectedTab(val);
            if (val === "groups") {
              setCurrentGroup(null);
            }
          }}
          className="flex-1 flex flex-col"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="groups" className="flex gap-2">
                <Users size={16} />
                <span>All Groups</span>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex gap-2"
                disabled={!currentGroup}
              >
                <MessageSquare size={16} />
                <span>Group Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="flex gap-2"
                disabled={!currentGroup}
              >
                <ClipboardList size={16} />
                <span>Group Tasks</span>
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="flex gap-2"
                disabled={!currentGroup}
              >
                <UserPlus size={16} />
                <span>Members</span>
              </TabsTrigger>
            </TabsList>
            
            {currentGroup && (
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentGroup(null);
                  setSelectedTab("groups");
                }}
              >
                Back to All Groups
              </Button>
            )}
          </div>
          
          <TabsContent value="groups" className="flex-1 mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {groups.length === 0 ? (
                <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No study groups yet</h3>
                  <p>Create a group to start collaborating with others.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setNewGroupOpen(true)}
                  >
                    Create Your First Group
                  </Button>
                </div>
              ) : (
                groups.map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {group.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex -space-x-2 mb-4">
                        {group.members.slice(0, 4).map((member) => (
                          <Avatar key={member.id} className="border-2 border-background">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {group.members.length > 4 && (
                          <Avatar className="border-2 border-background">
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              +{group.members.length - 4}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          <span>{group.members.length} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClipboardList size={14} />
                          <span>{group.tasks.length} tasks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>Created {format(new Date(group.createdAt), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setCurrentGroup(group.id);
                          setSelectedTab("chat");
                        }}
                      >
                        View Group
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="flex-1 mt-6 flex flex-col">
            {currentGroup ? (
              <>
                <Card className="flex-1 flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle>{currentGroup.name} - Chat</CardTitle>
                    <CardDescription>
                      Discuss assignments and coordinate study sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto">
                    {currentGroup.messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mb-4" />
                        <p className="mb-2">No messages yet</p>
                        <p className="text-sm">Be the first to send a message to the group!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentGroup.messages.map((message) => {
                          const sender = currentGroup.members.find(
                            (m) => m.id === message.senderId
                          );
                          const isCurrentUser = message.senderId === "user1";
                          
                          return (
                            <div
                              key={message.id}
                              className={cn(
                                "flex gap-3 max-w-[80%]",
                                isCurrentUser ? "ml-auto" : ""
                              )}
                            >
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {sender?.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className="space-y-1">
                                {!isCurrentUser && (
                                  <p className="text-xs text-muted-foreground">
                                    {sender?.name}
                                  </p>
                                )}
                                <div
                                  className={cn(
                                    "rounded-lg p-3",
                                    isCurrentUser
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  )}
                                >
                                  <p>{message.text}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(message.timestamp), "h:mm a")}
                                </p>
                              </div>
                              {isCurrentUser && (
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-muted text-foreground">
                                    Y
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage}>Send</Button>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-1">No group selected</h3>
                <p>Select a group to view its chat.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tasks" className="flex-1 mt-6">
            {currentGroup ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{currentGroup.name} - Tasks</CardTitle>
                      <CardDescription>
                        Group assignments and study sessions
                      </CardDescription>
                    </div>
                    <Button size="sm">Add Task</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {currentGroup.tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <ClipboardList className="h-12 w-12 mb-4" />
                      <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
                      <p>Create tasks to collaborate with your group.</p>
                      <Button variant="outline" className="mt-4">
                        Create First Task
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentGroup.tasks.map((task) => (
                        <Card key={task.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle>{task.title}</CardTitle>
                              <Badge 
                                variant={task.completed ? "default" : "outline"}
                              >
                                {task.completed ? "Completed" : "In Progress"}
                              </Badge>
                            </div>
                            <CardDescription>
                              Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{task.description}</p>
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-1">Assigned to:</p>
                              <div className="flex -space-x-2">
                                {task.assignedTo.map((memberId) => {
                                  const member = currentGroup.members.find(m => m.id === memberId);
                                  return (
                                    <Avatar key={memberId} className="border-2 border-background">
                                      <AvatarFallback className="bg-primary text-primary-foreground">
                                        {member?.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  );
                                })}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant={task.completed ? "outline" : "default"} 
                              className="w-full"
                              disabled={task.completed}
                            >
                              {task.completed ? "Completed" : "Mark Complete"}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <ClipboardList className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-1">No group selected</h3>
                <p>Select a group to view tasks.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="members" className="flex-1 mt-6">
            {currentGroup ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{currentGroup.name} - Members</CardTitle>
                      <CardDescription>
                        {currentGroup.members.length} members in this group
                      </CardDescription>
                    </div>
                    <Button size="sm">Invite Members</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentGroup.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className={cn(
                              member.role === "admin" 
                                ? "bg-primary text-primary-foreground"  
                                : "bg-muted text-foreground"
                            )}>
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {member.role === "admin" ? "Admin" : "Member"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 pr-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Completion</span>
                              <span>{member.completionPercentage}%</span>
                            </div>
                            <Progress value={member.completionPercentage} className="h-2" />
                          </div>
                          {member.id !== "user1" && (
                            <Button variant="ghost" size="sm">
                              Message
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <Users className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-1">No group selected</h3>
                <p>Select a group to view members.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
