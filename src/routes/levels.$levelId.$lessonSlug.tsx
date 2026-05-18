/**
 * Route : /levels/$levelId/$lessonSlug
 * ----------------------------------------------------------------
 * Page de lecture d'une leçon : vidéo intégrée + lien PDF.
 * URL basée sur le `slug` (lisible, SEO-friendly) plutôt que sur l'UUID.
 */
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { lessonQuery } from "@/lib/api/queries";

export const Route = createFileRoute("/levels/$levelId/$lessonSlug")({
  head: ({ params }) => {
    const title = "Lesson — Linguava";
    const desc = "Lesson video and PDF.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `/levels/${params.levelId}/${params.lessonSlug}` },
      ],
    };
  },
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(
      lessonQuery(params.levelId, params.lessonSlug),
    );
    if (!data) throw notFound();
    return data;
  },
  component: LessonPage,
  notFoundComponent: NotFoundView,
  errorComponent: ErrorView,
});

function LessonPage() {
  const { levelId, lessonSlug } = Route.useParams();
  const { data } = useSuspenseQuery(lessonQuery(levelId, lessonSlug));
  if (!data) return <NotFoundView />;
  const { level, lesson } = data;

  // Autres leçons du même niveau (exclut la leçon courante).
  const siblings = level.lessons.filter((l) => l.id !== lesson.id);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="container mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/levels/$levelId"
          params={{ levelId: level.id }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {level.name}
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-accent">{level.name}</p>
          <h1 className="font-serif mt-1 text-4xl text-foreground sm:text-5xl">{lesson.title}</h1>
          <p className="mt-3 text-muted-foreground">{lesson.description}</p>
        </div>

        {/* Lecteur vidéo intégré */}
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="aspect-video w-full bg-black">
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Actions PDF */}
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={lesson.pdfUrl}
            download
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
          <a
            href={lesson.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition"
          >
            <ExternalLink className="h-4 w-4" /> View PDF
          </a>
        </div>

        {/* Navigation contextuelle vers les leçons sœurs */}
        {siblings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-medium text-muted-foreground">
              More lessons in {level.name}
            </h2>
            <div className="mt-3 grid gap-2">
              {siblings.map((l) => (
                <Link
                  key={l.id}
                  to="/levels/$levelId/$lessonSlug"
                  params={{ levelId: level.id, lessonSlug: l.slug }}
                  className="rounded-lg border border-border px-4 py-3 text-sm text-foreground transition hover:border-primary"
                >
                  {l.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NotFoundView() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold">Lesson not found</h1>
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
