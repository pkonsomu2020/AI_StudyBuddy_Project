import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AICoach from "./pages/AICoach";
import Rewards from "./pages/Rewards";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TaskProvider } from "./contexts/TaskContext";
import { GroupProvider } from "./contexts/GroupContext";
import { AICoachProvider } from "./contexts/AICoachContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TaskProvider>
            <GroupProvider>
              <AICoachProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route
                        path="/coach"
                        element={
                          <ProtectedRoute>
                            <AICoach />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/rewards"
                        element={
                          <ProtectedRoute>
                            <Rewards />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/groups"
                        element={
                          <ProtectedRoute>
                            <Groups />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </AICoachProvider>
            </GroupProvider>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;