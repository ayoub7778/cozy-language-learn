import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getLesson, getLevel } from "@/lib/lessons";

export const Route = createFileRoute("/levels/$levelId/$lessonId")({
  head: ({ params }) => {
    const lesson = getLesson(params.levelId, params.lessonId);
    const title = lesson ? `${lesson.title} — Linguava` : "Lesson — Linguava";
    const desc = lesson?.description ?? "Lesson video and PDF.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const level = getLevel(params.levelId);
    const lesson = getLesson(params.levelId, params.lessonId);
    if (!level || !lesson) throw notFound();
    return { level, lesson };
  },
  component: LessonPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold">Lesson not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary">Back home</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-6 py-24 text-center text-muted-foreground">{error.message}</div>
  ),
});

function LessonPage() {
  const { level, lesson } = Route.useLoaderData();

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
          <p className="text-sm text-primary">{level.name}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-2 text-muted-foreground">{lesson.description}</p>
        </div>

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

        <div className="mt-12">
          <h2 className="text-sm font-medium text-muted-foreground">More lessons in {level.name}</h2>
          <div className="mt-3 grid gap-2">
            {level.lessons
              .filter((l: typeof level.lessons[number]) => l.id !== lesson.id)
              .map((l: typeof level.lessons[number]) => (
                <Link
                  key={l.id}
                  to="/levels/$levelId/$lessonId"
                  params={{ levelId: level.id, lessonId: l.id }}
                  className="rounded-lg border border-border px-4 py-3 text-sm text-foreground transition hover:border-primary"
                >
                  {l.title}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
