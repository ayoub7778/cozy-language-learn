/**
 * Query Options — TanStack Query
 * ----------------------------------------------------------------
 * Définit les clés de cache et les fonctions de fetch pour chaque
 * ressource. Centralisé ici pour :
 *   - éviter la duplication des `queryKey` (source de bugs de cache),
 *   - permettre une invalidation ciblée depuis n'importe où,
 *   - documenter les dépendances entre routes et données.
 */

import { queryOptions } from "@tanstack/react-query";
import {
  fetchLevels,
  fetchLevelWithLessons,
  fetchLessonBySlug,
} from "./lessons.functions";

/** Liste de tous les niveaux (page d'accueil). */
export const levelsQuery = () =>
  queryOptions({
    queryKey: ["levels"] as const,
    queryFn: () => fetchLevels(),
    staleTime: 1000 * 60 * 5, // 5 min — contenu pédagogique peu volatile
  });

/** Détail d'un niveau + ses leçons. */
export const levelWithLessonsQuery = (levelId: string) =>
  queryOptions({
    queryKey: ["levels", levelId, "lessons"] as const,
    queryFn: () => fetchLevelWithLessons({ data: { levelId } }),
    staleTime: 1000 * 60 * 5,
  });

/** Détail d'une leçon (vidéo + PDF + contexte du niveau). */
export const lessonQuery = (levelId: string, lessonSlug: string) =>
  queryOptions({
    queryKey: ["levels", levelId, "lessons", lessonSlug] as const,
    queryFn: () => fetchLessonBySlug({ data: { levelId, lessonSlug } }),
    staleTime: 1000 * 60 * 5,
  });
