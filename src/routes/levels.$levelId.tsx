/**
 * Route : /levels/$levelId
 * ----------------------------------------------------------------
 * Page d'un niveau : liste de toutes ses leçons.
 * Données chargées depuis Supabase via une Server Function unique
 * (jointure `levels → lessons`, pas de N+1).
 */
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { LessonListItem } from "@/components/LessonListItem";
import { levelsQuery, levelWithLessonsQuery } from "@/lib/api/queries";

export const Route = createFileRoute("/levels/$levelId")({
  head: ({ params }) => {
    const title = `Lessons — Linguava`;
    const desc = "Browse language lessons by level.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `/levels/${params.levelId}` },
      ],
    };
  },
  // Le loader préchauffe à la fois la liste des niveaux (pour la nav
  // de bascule en haut) et le détail du niveau courant.
  loader: async ({ params, context }) => {
    const [, level] = await Promise.all([
      context.queryClient.ensureQueryData(levelsQuery()),
      context.queryClient.ensureQueryData(levelWithLessonsQuery(params.levelId)),
    ]);
    if (!level) throw notFound();
    return { level };
  },
  component: LevelPage,
  notFoundComponent: NotFoundView,
  errorComponent: ErrorView,
});

function LevelPage() {
  const { levelId } = Route.useParams();
  const { data: levels } = useSuspenseQuery(levelsQuery());
  const { data: level } = useSuspenseQuery(levelWithLessonsQuery(levelId));

  // Garde-fou : si le cache renvoie null, on déclenche le NotFound.
  if (!level) return <NotFoundView />;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="container mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-accent">{level.tagline}</p>
            <h1 className="font-serif mt-1 text-5xl text-foreground sm:text-6xl">{level.name}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{level.description}</p>
          </div>

          {/* Bascule rapide entre niveaux */}
          <div className="flex gap-2">
            {levels.map((l) => (
              <Link
                key={l.id}
                to="/levels/$levelId"
                params={{ levelId: l.id }}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  l.id === level.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4">
          {level.lessons.map((lesson, idx) => (
            <LessonListItem key={lesson.id} lesson={lesson} index={idx + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NotFoundView() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold">Level not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary">Back home</Link>
      </div>
    </div>
  );
}

function ErrorView({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="container mx-auto px-6 py-24 text-center">
      <p className="text-muted-foreground">{error.message}</p>
      <button
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        Retry
      </button>
    </div>
  );
}
