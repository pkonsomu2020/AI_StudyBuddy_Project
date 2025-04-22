import { ReactNode } from "react";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";
import { Mail, Phone, Book, Info } from "lucide-react";
import { Link } from "react-router-dom";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className={cn("flex-1 container py-8", className)}>
        {children}
      </main>
      <footer className="border-t py-6 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">StudyBuddy</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your personal academic productivity platform to help organize, plan, and track your educational journey.
              </p>
              <div className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                  <Book size={16} />
                </span>
                <span className="font-semibold">StudyBuddy</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Task Management</Link></li>
                <li><Link to="/coach" className="hover:text-primary transition-colors">AI Study Coach</Link></li>
                <li><Link to="/rewards" className="hover:text-primary transition-colors">Rewards System</Link></li>
                <li><Link to="/groups" className="hover:text-primary transition-colors">Study Groups</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Study Tips</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Learning Techniques</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Time Management</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Exam Preparation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Contact Us</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  <a href="mailto:support@studybuddy.com" className="hover:text-primary transition-colors">
                    info@studybuddy.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                    (+254) 745 343-256
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Info size={16} className="text-primary" />
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 StudyBuddy. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
              <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
