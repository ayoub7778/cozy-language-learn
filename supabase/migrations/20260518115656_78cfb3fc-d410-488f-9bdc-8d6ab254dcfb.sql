
-- LEVELS
CREATE TABLE public.levels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Levels are viewable by everyone" ON public.levels FOR SELECT USING (true);

-- LESSONS
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id TEXT NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  duration TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (level_id, slug)
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons are viewable by everyone" ON public.lessons FOR SELECT USING (true);
CREATE INDEX idx_lessons_level ON public.lessons(level_id, sort_order);

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- LESSON PROGRESS
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own progress" ON public.lesson_progress FOR DELETE USING (auth.uid() = user_id);

-- updated_at trigger fn
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed levels + lessons
INSERT INTO public.levels (id, name, tagline, description, sort_order) VALUES
  ('beginner', 'Beginner', 'Start your journey', 'Learn the foundations: greetings, basic vocabulary, and simple sentences.', 1),
  ('intermediate', 'Intermediate', 'Build fluency', 'Expand vocabulary, master grammar patterns, and hold real conversations.', 2),
  ('advanced', 'Advanced', 'Speak with confidence', 'Nuance, idioms, and complex topics — express yourself like a native speaker.', 3);

INSERT INTO public.lessons (level_id, slug, title, description, video_url, pdf_url, duration, sort_order) VALUES
  ('beginner', 'greetings', 'Greetings & Introductions', 'Say hello, introduce yourself, and ask basic questions.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '8 min', 1),
  ('beginner', 'numbers-time', 'Numbers & Time', 'Count, tell time, and talk about days of the week.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '10 min', 2),
  ('beginner', 'everyday-words', 'Everyday Vocabulary', 'Essential words for food, family, and common objects.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '12 min', 3),
  ('intermediate', 'past-tense', 'Talking About the Past', 'Use past tense to describe events and tell stories.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '14 min', 1),
  ('intermediate', 'future-plans', 'Future Plans', 'Express intentions, plans, and predictions.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '11 min', 2),
  ('intermediate', 'opinions', 'Sharing Opinions', 'Agree, disagree, and explain your point of view.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '13 min', 3),
  ('advanced', 'idioms', 'Idioms & Expressions', 'Sound natural with common idioms and figures of speech.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '15 min', 1),
  ('advanced', 'debate', 'Debate & Discussion', 'Structure arguments and discuss complex topics.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '18 min', 2),
  ('advanced', 'storytelling', 'Storytelling & Nuance', 'Use tone, pacing, and nuance to tell engaging stories.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '16 min', 3);
