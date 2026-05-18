/**
 * <LevelCard /> — Carte cliquable représentant un niveau sur la home.
 * Composant purement présentationnel : aucune logique de données.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Level } from "@/lib/types";

/** Mapping niveau → tokens de couleur sémantiques (définis dans styles.css). */
const LEVEL_STYLES: Record<string, { dot: string; chip: string }> = {
  beginner: { dot: "bg-[var(--level-beginner)]", chip: "text-[var(--level-beginner)]" },
  intermediate: { dot: "bg-[var(--level-intermediate)]", chip: "text-[var(--level-intermediate)]" },
  advanced: { dot: "bg-[var(--level-advanced)]", chip: "text-[var(--level-advanced)]" },
};

interface LevelCardProps {
  level: Level;
  /** Position d'affichage (sert pour l'étiquette « Level 0X »). */
  index: number;
  /** Nombre de leçons à afficher en pied de carte. */
  lessonsCount: number;
}

export function LevelCard({ level, index, lessonsCount }: LevelCardProps) {
  const styles = LEVEL_STYLES[level.id] ?? LEVEL_STYLES.beginner;

  return (
    <Link
      to="/levels/$levelId"
      params={{ levelId: level.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
    >
      {/* Halo décoratif coloré selon le niveau */}
      <span
        aria-hidden
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl ${styles.dot}`}
      />
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
          Level 0{index + 1}
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      <h3 className="font-serif mt-6 text-3xl text-card-foreground">{level.name}</h3>
      <p className={`mt-1 text-sm font-medium ${styles.chip}`}>{level.tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{level.description}</p>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span>{lessonsCount} lessons</span>
        <span className="font-medium text-foreground">Explore →</span>
      </div>
    </Link>
  );
}
