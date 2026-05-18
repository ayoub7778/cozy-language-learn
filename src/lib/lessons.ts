export type Level = "beginner" | "intermediate" | "advanced";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  pdfUrl: string;
  duration: string;
}

export interface LevelData {
  id: Level;
  name: string;
  tagline: string;
  description: string;
  lessons: Lesson[];
}

export const levels: LevelData[] = [
  {
    id: "beginner",
    name: "Beginner",
    tagline: "Start from zero",
    description: "Build a strong foundation with the alphabet, greetings, and everyday vocabulary.",
    lessons: [
      {
        id: "b1",
        title: "Greetings & Introductions",
        description: "Learn how to say hello, introduce yourself, and ask basic questions.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        duration: "08 min",
      },
      {
        id: "b2",
        title: "Numbers & Days of the Week",
        description: "Count from 1 to 100 and learn the days, months, and seasons.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        duration: "10 min",
      },
      {
        id: "b3",
        title: "Common Verbs",
        description: "Master the most-used verbs and start forming simple sentences.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        duration: "12 min",
      },
    ],
  },
  {
    id: "intermediate",
    name: "Intermediate",
    tagline: "Build fluency",
    description: "Expand your grammar, expressions, and confidence in real conversations.",
    lessons: [
      {
        id: "i1",
        title: "Past & Future Tenses",
        description: "Talk about yesterday, plans, and dreams with confidence.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        duration: "14 min",
      },
      {
        id: "i2",
        title: "Travel Conversations",
        description: "Order food, ask for directions, and book a hotel like a local.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        duration: "15 min",
      },
      {
        id: "i3",
        title: "Idioms & Expressions",
        description: "Speak more naturally with everyday idioms and slang.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        duration: "11 min",
      },
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    tagline: "Master the language",
    description: "Refine your accent, debate complex topics, and read literature.",
    lessons: [
      {
        id: "a1",
        title: "Business Communication",
        description: "Write professional emails and lead meetings with clarity.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        duration: "18 min",
      },
      {
        id: "a2",
        title: "Debate & Opinion",
        description: "Structure arguments and express nuanced opinions.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        duration: "20 min",
      },
      {
        id: "a3",
        title: "Literature & Culture",
        description: "Explore classic texts and the culture behind the language.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        duration: "22 min",
      },
    ],
  },
];

export const getLevel = (id: string) => levels.find((l) => l.id === id);
export const getLesson = (levelId: string, lessonId: string) =>
  getLevel(levelId)?.lessons.find((l) => l.id === lessonId);
