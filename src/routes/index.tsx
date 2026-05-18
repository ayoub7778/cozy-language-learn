import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, PlayCircle, FileText, Sparkles } from "lucide-react";
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

const levelStyles: Record<string, { dot: string; chip: string }> = {
  beginner: { dot: "bg-[var(--level-beginner)]", chip: "text-[var(--level-beginner)]" },
  intermediate: { dot: "bg-[var(--level-intermediate)]", chip: "text-[var(--level-intermediate)]" },
  advanced: { dot: "bg-[var(--level-advanced)]", chip: "text-[var(--level-advanced)]" },
};

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="container mx-auto px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-accent" /> Simple. Focused. Effective.
          </span>
          <h1 className="font-serif mt-6 text-5xl leading-[1.05] text-foreground sm:text-7xl">
            Learn a language,<br />
            <em className="italic text-primary">one clean lesson</em> at a time.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Pick your level and start learning with short videos and downloadable PDFs.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/levels/$levelId"
              params={{ levelId: "beginner" }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Start learning <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#levels"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              Browse levels
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 pb-20">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: BookOpen, title: "3 levels", text: "Beginner to Advanced" },
            { icon: PlayCircle, title: "Video lessons", text: "Watch and learn at your pace" },
            { icon: FileText, title: "PDF guides", text: "Download notes for every lesson" },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-medium text-card-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Levels */}
      <section id="levels" className="container mx-auto px-6 pb-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-4xl text-foreground sm:text-5xl">Choose your level</h2>
            <p className="mt-2 text-muted-foreground">Start anywhere — you can always switch.</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {levels.map((level, i) => {
            const s = levelStyles[level.id];
            return (
              <Link
                key={level.id}
                to="/levels/$levelId"
                params={{ levelId: level.id }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <span
                  aria-hidden
                  className={`absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl ${s.dot}`}
                />
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                    Level 0{i + 1}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <h3 className="font-serif mt-6 text-3xl text-card-foreground">{level.name}</h3>
                <p className={`mt-1 text-sm font-medium ${s.chip}`}>{level.tagline}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {level.description}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>{level.lessons.length} lessons</span>
                  <span className="font-medium text-foreground">Explore →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-6 py-8 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Linguava</span>
          <span className="font-serif italic">Learn a little, every day.</span>
        </div>
      </footer>
    </div>
  );
}
