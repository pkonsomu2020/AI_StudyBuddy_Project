
import { useState, useRef, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useAICoach } from "@/contexts/AICoachContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Send, Brain, Bot, User } from "lucide-react";

export default function AICoach() {
  const { messages, sending, suggestedPrompts, sendMessage } = useAICoach();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !sending) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Study Coach</h1>
            <p className="text-muted-foreground">
              Get personalized study guidance and answers to your questions
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4" style={{ minHeight: "calc(100vh - 16rem)" }}>
          {/* Chat area - takes up more space */}
          <Card className="md:col-span-3 flex flex-col">
            {/* Messages container */}
            <CardContent className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "calc(100vh - 20rem)" }}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 max-w-[80%]",
                      message.role === "user" ? "ml-auto" : ""
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                        <AvatarFallback>
                          <Bot size={16} />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "rounded-lg p-3",
                        message.role === "assistant"
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 bg-muted text-foreground">
                        <AvatarFallback>
                          <User size={16} />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {sending && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                      <AvatarFallback>
                        <Bot size={16} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3 flex items-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input area */}
            <div className="p-4 border-t mt-auto">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask your study coach..."
                  className="flex-1"
                  disabled={sending}
                />
                <Button onClick={handleSend} disabled={!input.trim() || sending}>
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </Card>

          {/* Suggested prompts sidebar */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={20} className="text-primary" />
                  <h3 className="font-semibold">Suggested Questions</h3>
                </div>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt) => (
                    <Button
                      key={prompt.id}
                      variant="outline"
                      className="w-full justify-start h-auto whitespace-normal text-left"
                      onClick={() => {
                        setInput(prompt.text);
                      }}
                    >
                      {prompt.text}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M7 22a5 5 0 0 1-2-4" />
                    <path d="M7 16.93c.96.43 1.96.74 2.99.91" />
                    <path d="M3.34 14A6.8 6.8 0 0 1 2 10c0-4.42 4.48-8 10-8s10 3.58 10 8a7.19 7.19 0 0 1-.33 2" />
                    <path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                    <path d="M14.88 22a4 4 0 0 0-2.47-1.76" />
                    <path d="M11.65 22H12a10 10 0 0 0 10-10" />
                    <path d="M20 22v-1a5 5 0 0 0-5-5" />
                  </svg>
                  <h3 className="font-semibold">How can I help?</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2 items-start">
                    <span className="text-primary">•</span> 
                    <span>Break down complex topics</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary">•</span> 
                    <span>Create personalized study plans</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary">•</span> 
                    <span>Provide learning strategies</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary">•</span> 
                    <span>Help with time management</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary">•</span> 
                    <span>Offer motivational support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
