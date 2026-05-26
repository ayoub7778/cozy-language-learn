/**
 * Route : / (Home)
 * ----------------------------------------------------------------
 * Page d'accueil — présente les 3 niveaux d'apprentissage récupérés
 * dynamiquement depuis Supabase via TanStack Query.
 *
 * Stratégie de fetch :
 *   - `loader` : préchauffe le cache côté SSR (`ensureQueryData`).
 *   - `useSuspenseQuery` : lit le cache côté client, sans flash de
 *     chargement, et bénéficie des refetchs en arrière-plan.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, FileText, PlayCircle, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { LevelCard } from "@/components/LevelCard";
import { levelsQuery, levelWithLessonsQuery } from "@/lib/api/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LevelUp — Learn a new language, simply" },
      {
        name: "description",
        content:
          "Clean, simple lessons across Beginner, Intermediate, and Advanced levels. Video + PDF for every lesson.",
      },
      { property: "og:title", content: "LevelUp — Learn a new language, simply" },
      {
        property: "og:description",
        content: "Clean, simple language lessons with video and PDF for every step.",
      },
    ],
  }),
  // Préchargement SSR de la liste des niveaux + prefetch léger des leçons
  // de chaque niveau pour accélérer la navigation suivante.
  loader: async ({ context }) => {
    const levels = await context.queryClient.ensureQueryData(levelsQuery());
    // Fire-and-forget : ne bloque pas le rendu de la home.
    for (const lvl of levels) {
      context.queryClient.prefetchQuery(levelWithLessonsQuery(lvl.id));
    }
  },
  component: HomePage,
});

function HomePage() {
  const { data: levels } = useSuspenseQuery(levelsQuery());

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* ----- HERO ----- */}
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
            <Sparkles className="h-3 w-3 text-accent" /> بسيط. مركّز. فعّال.
          </span>
          <h1 className="font-serif mt-6 text-5xl leading-[1.05] text-foreground sm:text-7xl">
            تعلّم لغة،<br />
            <em className="italic text-primary">درسًا واضحًا</em> في كل مرة.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            اختر مستواك وابدأ التعلّم مع مقاطع فيديو قصيرة وملفات PDF قابلة للتحميل.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/levels/$levelId"
              params={{ levelId: "beginner" }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              ابدأ التعلّم <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <a
              href="#levels"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
            >
              استعراض المستويات
            </a>
          </div>
        </div>
      </section>

      {/* ----- FEATURES ----- */}
      <section className="container mx-auto px-6 pb-20">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: BookOpen, title: "٣ مستويات", text: "من المبتدئ إلى المتقدّم" },
            { icon: PlayCircle, title: "دروس فيديو", text: "شاهد وتعلّم بالوتيرة التي تناسبك" },
            { icon: FileText, title: "ملفات PDF", text: "حمّل ملاحظات كل درس" },
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

      {/* ----- LEVELS (data Supabase) ----- */}
      <section id="levels" className="container mx-auto px-6 pb-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-4xl text-foreground sm:text-5xl">Choose your level</h2>
            <p className="mt-2 text-muted-foreground">Start anywhere — you can always switch.</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {levels.map((level, i) => (
            <LevelCardWithCount key={level.id} level={level} index={i} />
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-6 py-8 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} LevelUp</span>
          <span className="font-serif italic">Learn a little, every day.</span>
        </div>
      </footer>
    </div>
  );
}

/**
 * Lit (depuis le cache déjà préchauffé par le loader) le détail d'un
 * niveau pour afficher le nombre exact de leçons sur la carte.
 */
function LevelCardWithCount({
  level,
  index,
}: {
  level: { id: string; name: string; tagline: string; description: string; sortOrder: number };
  index: number;
}) {
  const { data } = useSuspenseQuery(levelWithLessonsQuery(level.id));
  return (
    <LevelCard
      level={level as Parameters<typeof LevelCard>[0]["level"]}
      index={index}
      lessonsCount={data?.lessons.length ?? 0}
    />
  );
}
