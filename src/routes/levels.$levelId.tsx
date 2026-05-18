import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, PlayCircle, FileText } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getLevel, levels } from "@/lib/lessons";

export const Route = createFileRoute("/levels/$levelId")({
  head: ({ params }) => {
    const level = getLevel(params.levelId);
    const title = level ? `${level.name} lessons — Linguava` : "Lessons — Linguava";
    const desc = level?.description ?? "Browse language lessons by level.";
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
    if (!level) throw notFound();
    return { level };
  },
  component: LevelPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold">Level not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary">Back home</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto px-6 py-24 text-center text-muted-foreground">{error.message}</div>
  ),
});

function LevelPage() {
  const { level } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-accent">{level.tagline}</p>
            <h1 className="font-serif mt-1 text-5xl text-foreground sm:text-6xl">{level.name}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{level.description}</p>
          </div>

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
          {level.lessons.map((lesson: typeof level.lessons[number], idx: number) => (
            <Link
              key={lesson.id}
              to="/levels/$levelId/$lessonId"
              params={{ levelId: level.id, lessonId: lesson.id }}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition hover:border-primary"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-medium text-secondary-foreground">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="font-medium text-card-foreground">{lesson.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{lesson.description}</p>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" /> {lesson.duration}</span>
                    <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> PDF</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-muted-foreground transition group-hover:text-primary">Open →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
