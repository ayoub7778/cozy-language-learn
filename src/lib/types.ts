/**
 * Types du domaine métier — Linguava
 * ----------------------------------------------------------------
 * Modèles partagés entre le Frontend (React/TanStack) et la couche
 * d'accès aux données Supabase. Centraliser les types ici garantit
 * la cohérence et la sécurité de typage de bout en bout.
 */

/** Identifiant logique d'un niveau d'apprentissage (clé naturelle stockée en DB). */
export type LevelId = "beginner" | "intermediate" | "advanced";

/** Représentation d'un niveau (cours) tel qu'exposé au Frontend. */
export interface Level {
  id: LevelId;
  name: string;
  tagline: string;
  description: string;
  sortOrder: number;
}

/** Représentation d'une leçon, prête à être affichée dans l'UI. */
export interface Lesson {
  id: string;
  levelId: LevelId;
  slug: string;
  title: string;
  description: string;
  videoUrl: string;
  pdfUrl: string;
  duration: string | null;
  sortOrder: number;
}

/** Niveau enrichi de ses leçons — utilisé par les pages de détail. */
export interface LevelWithLessons extends Level {
  lessons: Lesson[];
}
