/**
 * <LessonListItem /> — Ligne cliquable d'une leçon dans la liste d'un niveau.
 * Composant purement présentationnel.
 */
import { Link } from "@tanstack/react-router";
import { FileText, PlayCircle } from "lucide-react";
import type { Lesson } from "@/lib/types";

interface LessonListItemProps {
  lesson: Lesson;
  /** Position 1-based affichée dans le badge à gauche. */
  index: number;
}

export function LessonListItem({ lesson, index }: LessonListItemProps) {
  return (
    <Link
      to="/levels/$levelId/$lessonSlug"
      params={{ levelId: lesson.levelId, lessonSlug: lesson.slug }}
      className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition hover:border-primary"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-medium text-secondary-foreground">
          {index}
        </span>
        <div>
          <h3 className="font-medium text-card-foreground">{lesson.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{lesson.description}</p>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            {lesson.duration && (
              <span className="inline-flex items-center gap-1">
                <PlayCircle className="h-3.5 w-3.5" /> {lesson.duration}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" /> PDF
            </span>
          </div>
        </div>
      </div>
      <span className="text-sm text-muted-foreground transition group-hover:text-primary">Open →</span>
    </Link>
  );
}
