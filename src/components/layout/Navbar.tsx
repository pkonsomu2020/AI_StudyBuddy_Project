import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/auth/AuthDialog";
import { cn } from "@/lib/utils";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  Brain, 
  Trophy, 
  Users, 
  Menu, 
  X, 
  Sun, 
  Moon,
  LogIn,
  UserPlus,
  User,
  LogOut
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, text, active, onClick }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
      active 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-muted text-foreground"
    )}
    onClick={onClick}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </Link>
);

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  
  const handleNavItemClick = (path: string) => {
    setActiveItem(path);
    setIsOpen(false);
  };

  const handleAuthClick = (view: "login" | "signup") => {
    setAuthView(view);
    setShowAuthDialog(true);
    setIsOpen(false); // Close the mobile menu when clicking login/signup
  };
  
  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };
  
  const handleOpenAuthDialog = useCallback((view: "login" | "signup") => {
    setAuthView(view);
    setShowAuthDialog(true);
  }, []);
  
  useAuthDialog({ onOpen: handleOpenAuthDialog });
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
          
          <Link to="/" className="flex items-center gap-2" onClick={() => handleNavItemClick("/")}>
            <span className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </span>
            <span className="text-xl font-bold">StudyBuddy</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <NavItem 
            to="/" 
            icon={<Calendar size={20} />} 
            text="Planner" 
            active={activeItem === "/"} 
            onClick={() => handleNavItemClick("/")}
          />
          <NavItem 
            to="/coach" 
            icon={<Brain size={20} />} 
            text="Coach" 
            active={activeItem === "/coach"} 
            onClick={() => handleNavItemClick("/coach")}
          />
          <NavItem 
            to="/rewards" 
            icon={<Trophy size={20} />} 
            text="Rewards" 
            active={activeItem === "/rewards"} 
            onClick={() => handleNavItemClick("/rewards")}
          />
          <NavItem 
            to="/groups" 
            icon={<Users size={20} />} 
            text="Groups" 
            active={activeItem === "/groups"} 
            onClick={() => handleNavItemClick("/groups")}
          />
        </nav>
        
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 p-4 bg-background border-b md:hidden z-20">
            <nav className="flex flex-col gap-1">
              <NavItem 
                to="/" 
                icon={<Calendar size={20} />} 
                text="Planner" 
                active={activeItem === "/"} 
                onClick={() => handleNavItemClick("/")}
              />
              <NavItem 
                to="/coach" 
                icon={<Brain size={20} />} 
                text="Coach" 
                active={activeItem === "/coach"} 
                onClick={() => handleNavItemClick("/coach")}
              />
              <NavItem 
                to="/rewards" 
                icon={<Trophy size={20} />} 
                text="Rewards" 
                active={activeItem === "/rewards"} 
                onClick={() => handleNavItemClick("/rewards")}
              />
              <NavItem 
                to="/groups" 
                icon={<Users size={20} />} 
                text="Groups" 
                active={activeItem === "/groups"} 
                onClick={() => handleNavItemClick("/groups")}
              />
              
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 py-2 px-4 text-sm font-medium">
                      <User size={16} />
                      <span>{user?.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() => handleAuthClick("login")}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="justify-start"
                      onClick={() => handleAuthClick("signup")}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {user?.level || 1}
              </span>
              <span className="hidden sm:inline">Level {user?.level || 1}</span>
            </div>
            <div className="h-4 bg-background rounded-full w-24 relative">
              <div 
                className="h-4 bg-primary rounded-full" 
                style={{ 
                  width: `${((user?.total_points || 0) % 100) / 100 * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {user?.email?.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAuthClick("login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAuthClick("signup")}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        initialView={authView}
      />
    </header>
  );
}
