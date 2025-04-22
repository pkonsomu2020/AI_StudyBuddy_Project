
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Button } from "@/components/ui/button";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup";
}

export default function AuthDialog({ isOpen, onClose, initialView = "login" }: AuthDialogProps) {
  const [view, setView] = useState<"login" | "signup">(initialView);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {view === "login" ? "Login to StudyBuddy" : "Create an Account"}
          </DialogTitle>
        </DialogHeader>

        {view === "login" ? (
          <div className="space-y-4">
            <LoginForm onClose={onClose} />
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setView("signup")}
              >
                Sign up
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <SignupForm onClose={onClose} />
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setView("login")}
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
