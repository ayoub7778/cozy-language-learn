/**
 * Couche d'accès aux données — Leçons & Niveaux
 * ----------------------------------------------------------------
 * Centralise tous les appels Supabase (lecture publique) via des
 * Server Functions TanStack Start. Cette approche :
 *   1. Maintient le code Frontend totalement découplé de la DB.
 *   2. Garantit que les requêtes SQL s'exécutent côté serveur
 *      (meilleure latence + bundle client plus léger).
 *   3. Permet l'optimisation : projection de colonnes, tri en SQL,
 *      et utilisation d'`.single()` / `.maybeSingle()` pour limiter
 *      les allers-retours réseau.
 *
 * Important : ce fichier ne contient QUE des `createServerFn`
 * (et leurs imports) pour préserver le découpage client/serveur
 * effectué par Vite.
 */

import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Level, LevelId, LevelWithLessons, Lesson } from "@/lib/types";

// ----------------------------------------------------------------
// Helpers de mapping DB → Domaine
// ----------------------------------------------------------------

/** Convertit une ligne `levels` brute en `Level` exposable au Frontend. */
function mapLevel(row: {
  id: string;
  name: string;
  tagline: string;
  description: string;
  sort_order: number;
}): Level {
  return {
    id: row.id as LevelId,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

/** Convertit une ligne `lessons` brute en `Lesson` exposable au Frontend. */
function mapLesson(row: {
  id: string;
  level_id: string;
  slug: string;
  title: string;
  description: string;
  video_url: string;
  pdf_url: string;
  duration: string | null;
  sort_order: number;
}): Lesson {
  return {
    id: row.id,
    levelId: row.level_id as LevelId,
    slug: row.slug,
    title: row.title,
    description: row.description,
    videoUrl: row.video_url,
    pdfUrl: row.pdf_url,
    duration: row.duration,
    sortOrder: row.sort_order,
  };
}

// ----------------------------------------------------------------
// Server Functions
// ----------------------------------------------------------------

/**
 * Récupère tous les niveaux triés par `sort_order`.
 * Utilisée par la page d'accueil pour afficher les cartes des cours.
 *
 * SQL optimisée : projection explicite + tri côté DB (index implicite
 * sur `sort_order`).
 */
export const fetchLevels = createServerFn({ method: "GET" }).handler(
  async (): Promise<Level[]> => {
    const { data, error } = await supabaseAdmin
      .from("levels")
      .select("id, name, tagline, description, sort_order")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapLevel);
  },
);

/**
 * Récupère un niveau et toutes ses leçons en UNE seule requête
 * (jointure implicite Supabase via la relation FK `lessons.level_id`).
 * Évite les patterns N+1 et limite les allers-retours réseau.
 */
export const fetchLevelWithLessons = createServerFn({ method: "GET" })
  .inputValidator((input: { levelId: string }) => {
    if (!input?.levelId || typeof input.levelId !== "string") {
      throw new Error("Invalid levelId");
    }
    return input;
  })
  .handler(async ({ data }): Promise<LevelWithLessons | null> => {
    const { data: row, error } = await supabaseAdmin
      .from("levels")
      .select(
        `
          id, name, tagline, description, sort_order,
          lessons:lessons (
            id, level_id, slug, title, description,
            video_url, pdf_url, duration, sort_order
          )
        `,
      )
      .eq("id", data.levelId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) return null;

    const level = mapLevel(row);
    const lessons = (row.lessons ?? [])
      .map(mapLesson)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return { ...level, lessons };
  });

/**
 * Récupère une leçon précise ainsi que le contexte de son niveau
 * (utilisé par la page de lecture vidéo + PDF, qui affiche aussi
 * la navigation latérale vers les autres leçons du même niveau).
 *
 * Une seule requête en base : jointure `lessons → levels` + ramène
 * la liste des leçons sœurs pour le bloc « More lessons ».
 */
export const fetchLessonBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { levelId: string; lessonSlug: string }) => {
    if (!input?.levelId || !input?.lessonSlug) {
      throw new Error("Invalid lesson identifiers");
    }
    return input;
  })
  .handler(
    async ({
      data,
    }): Promise<{ level: LevelWithLessons; lesson: Lesson } | null> => {
      const { data: row, error } = await supabaseAdmin
        .from("levels")
        .select(
          `
            id, name, tagline, description, sort_order,
            lessons:lessons (
              id, level_id, slug, title, description,
              video_url, pdf_url, duration, sort_order
            )
          `,
        )
        .eq("id", data.levelId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!row) return null;

      const level = mapLevel(row);
      const lessons = (row.lessons ?? [])
        .map(mapLesson)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const lesson = lessons.find((l) => l.slug === data.lessonSlug);
      if (!lesson) return null;

      return { level: { ...level, lessons }, lesson };
    },
  );
