
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useTasks } from "@/contexts/TaskContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Define theme and avatar types
interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  pointsRequired: number;
  unlocked: boolean;
}

interface Avatar {
  id: string;
  name: string;
  description: string;
  image: string;
  streakRequired: number;
  unlocked: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: string;
  unlocked: boolean;
}

export default function Rewards() {
  const { userStats } = useTasks();
  
  // Themes that can be unlocked
  const [themes] = useState<Theme[]>([
    {
      id: "default",
      name: "Default Theme",
      description: "The standard study interface",
      preview: "bg-gradient-to-br from-study-500 to-study-700",
      pointsRequired: 0,
      unlocked: true,
    },
    {
      id: "ocean",
      name: "Ocean Breeze",
      description: "Calming blue theme for relaxed studying",
      preview: "bg-gradient-to-br from-blue-400 to-teal-500",
      pointsRequired: 100,
      unlocked: userStats.totalPoints >= 100,
    },
    {
      id: "sunset",
      name: "Sunset Mode",
      description: "Warm orange and pink gradients",
      preview: "bg-gradient-to-br from-orange-400 to-pink-500",
      pointsRequired: 300,
      unlocked: userStats.totalPoints >= 300,
    },
    {
      id: "forest",
      name: "Forest Focus",
      description: "Natural green tones for deep concentration",
      preview: "bg-gradient-to-br from-green-400 to-emerald-600",
      pointsRequired: 600,
      unlocked: userStats.totalPoints >= 600,
    },
    {
      id: "galaxy",
      name: "Galaxy Mind",
      description: "Space-themed dark mode with purple accents",
      preview: "bg-gradient-to-br from-purple-800 to-violet-900",
      pointsRequired: 1000,
      unlocked: userStats.totalPoints >= 1000,
    },
  ]);
  
  // Avatars that can be unlocked
  const [avatars] = useState<Avatar[]>([
    {
      id: "rookie",
      name: "Study Rookie",
      description: "Just starting your study journey",
      image: "👨‍🎓",
      streakRequired: 0,
      unlocked: true,
    },
    {
      id: "consistent",
      name: "Consistent Learner",
      description: "Maintained a 3-day study streak",
      image: "👩‍💻",
      streakRequired: 3,
      unlocked: userStats.currentStreak >= 3,
    },
    {
      id: "dedicated",
      name: "Dedicated Scholar",
      description: "Maintained a 7-day study streak",
      image: "🧠",
      streakRequired: 7,
      unlocked: userStats.currentStreak >= 7,
    },
    {
      id: "master",
      name: "Study Master",
      description: "Maintained a 14-day study streak",
      image: "👨‍🔬",
      streakRequired: 14,
      unlocked: userStats.currentStreak >= 14,
    },
    {
      id: "genius",
      name: "Study Genius",
      description: "Maintained a 30-day study streak",
      image: "🦉",
      streakRequired: 30,
      unlocked: userStats.currentStreak >= 30,
    },
  ]);
  
  // Achievement badges
  const [badges] = useState<Badge[]>([
    {
      id: "first-task",
      name: "First Steps",
      description: "Completed your first task",
      icon: <Check className="h-6 w-6 text-green-500" />,
      condition: "Complete 1 task",
      unlocked: userStats.completedTasks >= 1,
    },
    {
      id: "task-master",
      name: "Task Master",
      description: "Completed 10 tasks",
      icon: <Check className="h-6 w-6 text-blue-500" />,
      condition: "Complete 10 tasks",
      unlocked: userStats.completedTasks >= 10,
    },
    {
      id: "study-champion",
      name: "Study Champion",
      description: "Completed 50 tasks",
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      condition: "Complete 50 tasks",
      unlocked: userStats.completedTasks >= 50,
    },
    {
      id: "first-streak",
      name: "Consistency Begins",
      description: "Achieved a 3-day streak",
      icon: <Star className="h-6 w-6 text-purple-500" />,
      condition: "Achieve a 3-day streak",
      unlocked: userStats.currentStreak >= 3,
    },
    {
      id: "streaker",
      name: "Streaker",
      description: "Achieved a 7-day streak",
      icon: <Star className="h-6 w-6 text-orange-500" />,
      condition: "Achieve a 7-day streak",
      unlocked: userStats.currentStreak >= 7,
    },
  ]);
  
  // For demo purposes - would handle theme selection in a real app
  const [selectedTheme, setSelectedTheme] = useState<string>("default");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("rookie");

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Rewards</h1>
          <p className="text-muted-foreground">
            Unlock themes, avatars, and badges as you study
          </p>
        </div>
      </div>

      {/* Stats Banner */}
      <Card className="mb-8 bg-gradient-to-r from-primary/80 to-primary text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium opacity-80">Total Points</span>
              <span className="text-3xl font-bold">{userStats.totalPoints} XP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium opacity-80">Current Level</span>
              <span className="text-3xl font-bold">{userStats.level}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium opacity-80">Current Streak</span>
              <span className="text-3xl font-bold">{userStats.currentStreak} days</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium opacity-80">Tasks Completed</span>
              <span className="text-3xl font-bold">{userStats.completedTasks}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Themes Section */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10"/>
                <path d="m16 12-4-4-4 4"/>
                <path d="m16 12-4 4-4-4"/>
              </svg>
              Themes
            </CardTitle>
            <CardDescription>
              Personalize your study experience with different themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={cn(
                    "border rounded-lg overflow-hidden",
                    theme.unlocked
                      ? "cursor-pointer hover:border-primary"
                      : "opacity-70"
                  )}
                  onClick={() => {
                    if (theme.unlocked) setSelectedTheme(theme.id);
                  }}
                >
                  <div
                    className={cn(
                      "h-24 w-full",
                      theme.preview
                    )}
                  ></div>
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold">{theme.name}</h4>
                      {theme.id === selectedTheme && theme.unlocked && (
                        <Badge variant="outline" className="bg-primary/20">
                          Active
                        </Badge>
                      )}
                      {!theme.unlocked && (
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <Lock size={12} /> {theme.pointsRequired} XP
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                    {!theme.unlocked && (
                      <Progress
                        className="mt-2 h-1"
                        value={(userStats.totalPoints / theme.pointsRequired) * 100}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Avatars Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="8" r="5"/>
                <path d="M20 21a8 8 0 1 0-16 0"/>
              </svg>
              Avatars
            </CardTitle>
            <CardDescription>
              Unlock avatars with consecutive day streaks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className={cn(
                    "border rounded-lg overflow-hidden text-center",
                    avatar.unlocked
                      ? "cursor-pointer hover:border-primary"
                      : "opacity-70"
                  )}
                  onClick={() => {
                    if (avatar.unlocked) setSelectedAvatar(avatar.id);
                  }}
                >
                  <div className="p-4 flex items-center justify-center">
                    <span className="text-5xl">{avatar.image}</span>
                  </div>
                  <div className="p-3 bg-muted/30">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-xs">{avatar.name}</h4>
                      {avatar.id === selectedAvatar && avatar.unlocked && (
                        <Badge variant="outline" className="bg-primary/20 text-[10px]">
                          Active
                        </Badge>
                      )}
                    </div>
                    {!avatar.unlocked && (
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                        <Lock size={10} /> {avatar.streakRequired}-day streak
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Achievement Badges
            </CardTitle>
            <CardDescription>
              Earn badges by completing study milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    "border rounded-lg p-4 text-center",
                    !badge.unlocked && "opacity-70"
                  )}
                >
                  <div className="flex items-center justify-center h-16 mb-2">
                    {badge.unlocked ? (
                      badge.icon
                    ) : (
                      <div className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                        <Lock size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.unlocked ? badge.description : badge.condition}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Achievements
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
}
