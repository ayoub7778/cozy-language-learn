import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, PlayCircle, FileText } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { levels } from "@/lib/lessons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linguava — Learn a new language, simply" },
      { name: "description", content: "Clean, simple lessons across Beginner, Intermediate, and Advanced levels. Video + PDF for every lesson." },
      { property: "og:title", content: "Linguava — Learn a new language, simply" },
      { property: "og:description", content: "Clean, simple language lessons with video and PDF for every step." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="container mx-auto px-6 py-24 text-center">
        <span className="inline-block rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          Simple. Focused. Effective.
        </span>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Learn a language,<br />one clean lesson at a time.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Pick your level and start learning with short videos and downloadable PDFs.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/levels/$levelId"
            params={{ levelId: "beginner" }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            Start learning <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
          {[
            { icon: BookOpen, title: "3 levels", text: "Beginner to Advanced" },
            { icon: PlayCircle, title: "Video lessons", text: "Watch and learn at your pace" },
            { icon: FileText, title: "PDF guides", text: "Download notes for every lesson" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border border-border p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-medium text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <h2 className="text-2xl font-semibold text-foreground">Choose your level</h2>
        <p className="mt-1 text-muted-foreground">Start anywhere — you can always switch.</p>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {levels.map((level, i) => (
            <Link
              key={level.id}
              to="/levels/$levelId"
              params={{ levelId: level.id }}
              className="group rounded-xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Level {i + 1}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-card-foreground">{level.name}</h3>
              <p className="mt-1 text-sm text-primary">{level.tagline}</p>
              <p className="mt-3 text-sm text-muted-foreground">{level.description}</p>
              <p className="mt-4 text-xs text-muted-foreground">{level.lessons.length} lessons</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Linguava
      </footer>
    </div>
  );
}
