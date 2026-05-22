import { Link } from "@tanstack/react-router";
import { Languages, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Languages className="h-4 w-4" />
          </span>
          LevelUp
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/levels/$levelId" params={{ levelId: "beginner" }} className="hover:text-foreground transition-colors">
            Lessons
          </Link>

          {/* Auth bar : Sign In / Sign Out */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {user.email}
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
