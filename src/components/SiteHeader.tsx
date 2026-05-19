import { Link } from "@tanstack/react-router";
import { Languages } from "lucide-react";

export function SiteHeader() {
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
        </nav>
      </div>
    </header>
  );
}
