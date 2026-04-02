import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Brain, Clock, Search, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Category,
  useAllFunFacts,
  useCategories,
  useDailyTrivia,
  useQuestionsByCategory,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <KnowItApp />
    </QueryClientProvider>
  );
}

function KnowItApp() {
  const [searchQuery, setSearchQuery] = useState("");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-[oklch(0.13_0.030_250/0.95)] backdrop-blur-md border-b border-knowit-border shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-knowit-blue to-knowit-purple flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              KnowIt
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {["Topics", "Quizzes", "Daily Trivia", "Explore", "About"].map(
              (link) => (
                <button
                  type="button"
                  key={link}
                  data-ocid={`nav.${link.toLowerCase().replace(" ", "-")}.link`}
                  onClick={() => scrollTo(link.toLowerCase().replace(" ", "-"))}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-muted/50 border border-knowit-border rounded-full px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                data-ocid="nav.search_input"
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-36"
              />
            </div>
            <Button
              data-ocid="nav.start_exploring.button"
              onClick={() => scrollTo("topics")}
              className="rounded-full bg-knowit-blue text-background hover:bg-knowit-blue/90 text-sm font-semibold px-4"
            >
              Start Exploring
            </Button>
          </div>
        </div>
      </nav>

      <HeroSection
        onExplore={() => scrollTo("topics")}
        onQuiz={() => scrollTo("quizzes")}
      />
      <CategoriesSection />
      <DailyTriviaSection />
      <QuizCentralSection />
      <DidYouKnowSection />
      <ExploreSection />
      <FooterSection onNavigate={scrollTo} />
    </div>
  );
}

/* ============================================================ HERO ============================================================ */
function HeroSection({
  onExplore,
  onQuiz,
}: { onExplore: () => void; onQuiz: () => void }) {
  const floatingIcons = [
    { emoji: "🚀", x: "8%", y: "15%", delay: 0 },
    { emoji: "🌍", x: "88%", y: "20%", delay: 0.5 },
    { emoji: "⚙️", x: "5%", y: "65%", delay: 1 },
    { emoji: "📚", x: "92%", y: "60%", delay: 0.3 },
    { emoji: "🌿", x: "15%", y: "80%", delay: 0.8 },
    { emoji: "⭐", x: "80%", y: "80%", delay: 0.6 },
    { emoji: "🔬", x: "50%", y: "10%", delay: 1.2 },
    { emoji: "🧭", x: "70%", y: "12%", delay: 0.9 },
    { emoji: "💡", x: "25%", y: "30%", delay: 0.4 },
    { emoji: "🎯", x: "75%", y: "45%", delay: 1.1 },
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.13 0.030 250) 0%, oklch(0.16 0.045 235) 50%, oklch(0.14 0.035 255) 100%)",
        minHeight: "420px",
      }}
    >
      {floatingIcons.map((icon) => (
        <motion.span
          key={icon.emoji}
          className="absolute text-2xl select-none pointer-events-none opacity-30"
          style={{ left: icon.x, top: icon.y }}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 3,
            delay: icon.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {icon.emoji}
        </motion.span>
      ))}

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(0.72 0.17 220) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Badge className="mb-4 bg-knowit-blue/20 text-knowit-blue border-knowit-blue/30 rounded-full px-4 py-1">
            🌟 Your daily dose of knowledge
          </Badge>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-foreground uppercase tracking-tight leading-none mb-6">
            IGNITE YOUR
            <span className="block" style={{ color: "oklch(0.72 0.17 220)" }}>
              CURIOSITY!
            </span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Explore fascinating topics, challenge yourself with quizzes, and
            discover something new every day across science, history, geography,
            and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              data-ocid="hero.explore.primary_button"
              onClick={onExplore}
              size="lg"
              className="rounded-full px-8 font-semibold text-base"
              style={{
                background: "oklch(0.72 0.17 220)",
                color: "oklch(0.10 0.020 250)",
              }}
            >
              🚀 Explore Topics
            </Button>
            <Button
              data-ocid="hero.quiz.secondary_button"
              onClick={onQuiz}
              size="lg"
              variant="outline"
              className="rounded-full px-8 font-semibold text-base border-knowit-border hover:bg-muted/30"
            >
              🧠 Take a Quiz
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 grid grid-cols-3 gap-8 md:gap-16"
        >
          {[
            { label: "Topics", value: "5+", icon: "📚" },
            { label: "Questions", value: "100s", icon: "❓" },
            { label: "Fun Facts", value: "50+", icon: "💡" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-display font-bold text-2xl text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================ CATEGORIES ============================================================ */
const categoryMeta: Record<
  string,
  { icon: string; desc: string; borderClass: string; iconColor: string }
> = {
  nature: {
    icon: "🌿",
    desc: "Explore the wonders of the natural world, ecosystems, and wildlife.",
    borderClass: "gradient-border-green",
    iconColor: "oklch(0.72 0.19 145)",
  },
  history: {
    icon: "🏛️",
    desc: "Journey through civilizations, wars, and pivotal moments in time.",
    borderClass: "gradient-border-yellow",
    iconColor: "oklch(0.83 0.16 85)",
  },
  technology: {
    icon: "⚙️",
    desc: "Discover innovations, computing, and the future of technology.",
    borderClass: "gradient-border-blue",
    iconColor: "oklch(0.72 0.17 220)",
  },
  geography: {
    icon: "🌍",
    desc: "Navigate continents, countries, capitals, and natural landscapes.",
    borderClass: "gradient-border-teal",
    iconColor: "oklch(0.79 0.13 185)",
  },
  science: {
    icon: "🔬",
    desc: "Unravel the mysteries of physics, chemistry, biology, and space.",
    borderClass: "gradient-border-orange",
    iconColor: "oklch(0.70 0.19 50)",
  },
};

const fallbackCategories = [
  "nature",
  "history",
  "technology",
  "geography",
  "science",
];
const skeletonCatKeys = [
  "sk-cat-1",
  "sk-cat-2",
  "sk-cat-3",
  "sk-cat-4",
  "sk-cat-5",
];

function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();
  const displayCats = (
    categories && categories.length > 0 ? categories : fallbackCategories
  ).slice(0, 5);

  return (
    <section id="topics" className="py-20 max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
          What do you want to learn?
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground uppercase">
          CATEGORIES BY TOPIC
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading
          ? skeletonCatKeys.map((k) => (
              <Skeleton key={k} className="h-48 rounded-2xl" />
            ))
          : displayCats.map((cat, i) => {
              const meta = categoryMeta[cat.toLowerCase()] ?? {
                icon: "📖",
                desc: "Explore this fascinating topic.",
                borderClass: "gradient-border-blue",
                iconColor: "oklch(0.72 0.17 220)",
              };
              return (
                <motion.div
                  key={cat}
                  data-ocid={`categories.item.${i + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`relative rounded-2xl ${meta.borderClass} bg-knowit-surface cursor-pointer group`}
                >
                  <div className="p-5 h-full flex flex-col bg-knowit-surface rounded-2xl">
                    <span className="text-3xl mb-3">{meta.icon}</span>
                    <h3 className="font-display font-bold text-base uppercase tracking-wide text-foreground mb-2 capitalize">
                      {cat}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                      {meta.desc}
                    </p>
                    <button
                      type="button"
                      data-ocid={`categories.browse.${i + 1}.button`}
                      className="mt-3 text-xs font-semibold transition-colors text-left"
                      style={{ color: meta.iconColor }}
                    >
                      Browse &rsaquo;
                    </button>
                  </div>
                </motion.div>
              );
            })}
      </div>
    </section>
  );
}

/* ============================================================ DAILY TRIVIA ============================================================ */
const ANSWER_LABELS = ["A", "B", "C", "D"];
const skeletonTriviaKeys = [
  "sk-trivia-1",
  "sk-trivia-2",
  "sk-trivia-3",
  "sk-trivia-4",
];

function DailyTriviaSection() {
  const { data: triviaQuestion, isLoading } = useDailyTrivia();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAnswer = (idx: number) => {
    if (revealed) return;
    setSelectedAnswer(idx);
    setRevealed(true);
    setProgress(100);
  };

  const correct = triviaQuestion
    ? Number(triviaQuestion.correctAnswerIndex)
    : 1;

  const getButtonStyle = (idx: number): string => {
    if (!revealed)
      return "bg-knowit-surface2 hover:bg-muted/50 border border-knowit-border text-foreground";
    if (idx === correct)
      return "bg-knowit-green/20 border border-knowit-green text-knowit-green";
    if (idx === selectedAnswer && idx !== correct)
      return "bg-destructive/20 border border-destructive text-destructive";
    return "bg-knowit-surface2 border border-knowit-border text-muted-foreground opacity-60";
  };

  const q = triviaQuestion ?? {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswerIndex: BigInt(1),
    difficulty: "easy" as const,
    category: "science" as const,
    timesAttempted: BigInt(0),
  };

  return (
    <section
      id="daily-trivia"
      className="py-16"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.15 0.035 250) 0%, oklch(0.13 0.030 250) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-knowit-border overflow-hidden"
          style={{ background: "oklch(0.17 0.040 250)" }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-knowit-border">
              <Badge className="mb-4 bg-knowit-yellow/20 text-knowit-yellow border-knowit-yellow/30 rounded-full">
                ⚡ Daily Challenge
              </Badge>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground uppercase mb-4">
                DAILY TRIVIA
                <br />
                CHALLENGE
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                A fresh question every day to keep your mind sharp. Answer
                correctly to keep your streak alive!
              </p>
              <div className="flex items-center gap-3 mb-6">
                <Badge
                  variant="outline"
                  className="rounded-full capitalize text-xs border-knowit-border"
                >
                  {q.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full capitalize text-xs border-knowit-border"
                >
                  {q.difficulty}
                </Badge>
              </div>
              <Button
                data-ocid="trivia.take_quiz.button"
                className="rounded-full px-6 font-semibold"
                style={{
                  background: "oklch(0.72 0.17 220)",
                  color: "oklch(0.10 0.020 250)",
                }}
                onClick={() => {
                  setSelectedAnswer(null);
                  setRevealed(false);
                  setProgress(0);
                }}
              >
                🎯 TAKE TODAY'S QUIZ
              </Button>
            </div>

            <div className="p-8 md:p-10">
              {isLoading ? (
                <div data-ocid="trivia.loading_state" className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  {skeletonTriviaKeys.map((k) => (
                    <Skeleton key={k} className="h-12 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-foreground font-semibold text-base mb-5 leading-relaxed">
                    {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => (
                      <button
                        type="button"
                        key={opt}
                        data-ocid={`trivia.answer.${idx + 1}.button`}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition-all ${getButtonStyle(idx)}`}
                      >
                        <span className="mr-2 font-bold">
                          {ANSWER_LABELS[idx]}.
                        </span>
                        {opt}
                        {revealed && idx === correct && (
                          <span className="ml-2">✓</span>
                        )}
                        {revealed &&
                          idx === selectedAnswer &&
                          idx !== correct && <span className="ml-2">✗</span>}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {revealed && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 p-3 rounded-xl text-sm font-medium"
                        style={{
                          background:
                            selectedAnswer === correct
                              ? "oklch(0.72 0.19 145 / 0.15)"
                              : "oklch(0.65 0.22 25 / 0.15)",
                          border: `1px solid ${selectedAnswer === correct ? "oklch(0.72 0.19 145)" : "oklch(0.65 0.22 25)"}`,
                          color:
                            selectedAnswer === correct
                              ? "oklch(0.72 0.19 145)"
                              : "oklch(0.65 0.22 25)",
                        }}
                        data-ocid={
                          selectedAnswer === correct
                            ? "trivia.success_state"
                            : "trivia.error_state"
                        }
                      >
                        {selectedAnswer === correct
                          ? "🎉 Correct! Well done!"
                          : `❌ The correct answer is: ${q.options[correct]}`}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================ QUIZ CENTRAL ============================================================ */
type QuizState = {
  active: boolean;
  questionIdx: number;
  score: number;
  answered: number | null;
  done: boolean;
};

function QuizCard({
  category,
  cardIndex,
}: { category: Category; cardIndex: number }) {
  const { data: questions = [], isLoading } = useQuestionsByCategory(category);
  const [quiz, setQuiz] = useState<QuizState>({
    active: false,
    questionIdx: 0,
    score: 0,
    answered: null,
    done: false,
  });

  const startQuiz = () =>
    setQuiz({
      active: true,
      questionIdx: 0,
      score: 0,
      answered: null,
      done: false,
    });

  const handleAnswer = (idx: number) => {
    if (quiz.answered !== null) return;
    const q = questions[quiz.questionIdx];
    const correctIdx = Number(q.correctAnswerIndex);
    const newScore = quiz.score + (idx === correctIdx ? 1 : 0);
    setQuiz((prev) => ({ ...prev, answered: idx, score: newScore }));
    setTimeout(() => {
      if (quiz.questionIdx + 1 >= Math.min(questions.length, 5)) {
        setQuiz((prev) => ({ ...prev, done: true }));
      } else {
        setQuiz((prev) => ({
          ...prev,
          questionIdx: prev.questionIdx + 1,
          answered: null,
        }));
      }
    }, 800);
  };

  const catMeta = categoryMeta[category] ?? {
    icon: "📖",
    iconColor: "oklch(0.72 0.17 220)",
    desc: "",
    borderClass: "gradient-border-blue",
  };
  const questionCount = Math.min(questions.length, 5);
  const difficultyColors: Record<string, string> = {
    easy: "oklch(0.72 0.19 145)",
    medium: "oklch(0.83 0.16 85)",
    hard: "oklch(0.65 0.22 25)",
  };

  const q = questions[quiz.questionIdx];
  const correctIdx = q ? Number(q.correctAnswerIndex) : -1;

  return (
    <motion.div
      data-ocid={`quiz.item.${cardIndex}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: cardIndex * 0.1 }}
      whileHover={!quiz.active ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`relative rounded-2xl ${catMeta.borderClass} overflow-hidden`}
    >
      <div className="bg-knowit-surface rounded-2xl h-full flex flex-col">
        <div
          className="h-32 flex items-center justify-center text-6xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.17 0.040 250), oklch(0.19 0.050 240))",
          }}
        >
          {catMeta.icon}
        </div>

        <div className="p-6 flex flex-col flex-1">
          {!quiz.active ? (
            <>
              <h3 className="font-display font-bold text-xl uppercase text-foreground mb-2 capitalize">
                {category}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {catMeta.desc}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {isLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <>
                    {questions[0] && (
                      <Badge
                        className="rounded-full text-xs capitalize"
                        style={{
                          background: `${difficultyColors[questions[0].difficulty] ?? "oklch(0.72 0.17 220)"}/20`,
                          color:
                            difficultyColors[questions[0].difficulty] ??
                            "oklch(0.72 0.17 220)",
                          border: `1px solid ${difficultyColors[questions[0].difficulty] ?? "oklch(0.72 0.17 220)"}`,
                        }}
                      >
                        {questions[0].difficulty}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs border-knowit-border"
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      {questionCount} questions
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs border-knowit-border"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {questionCount * 30}s
                    </Badge>
                  </>
                )}
              </div>
              <Button
                data-ocid={`quiz.start.${cardIndex}.button`}
                onClick={startQuiz}
                disabled={isLoading || questions.length === 0}
                className="rounded-full font-semibold mt-auto"
                style={{
                  background: catMeta.iconColor,
                  color: "oklch(0.10 0.020 250)",
                }}
              >
                {isLoading
                  ? "Loading..."
                  : questions.length === 0
                    ? "No questions yet"
                    : "▶ Start Quiz"}
              </Button>
            </>
          ) : quiz.done ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center flex-1 justify-center"
            >
              <div className="text-5xl mb-4">
                {quiz.score >= questionCount / 2 ? "🏆" : "📖"}
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                Quiz Complete!
              </h3>
              <p className="text-muted-foreground text-sm mb-1">Your score</p>
              <p
                className="font-display font-bold text-3xl mb-4"
                style={{ color: catMeta.iconColor }}
              >
                {quiz.score}/{questionCount}
              </p>
              <Button
                data-ocid={`quiz.restart.${cardIndex}.button`}
                onClick={startQuiz}
                variant="outline"
                className="rounded-full text-sm border-knowit-border"
              >
                Try Again
              </Button>
            </motion.div>
          ) : q ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">
                  Question {quiz.questionIdx + 1} / {questionCount}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: catMeta.iconColor }}
                >
                  Score: {quiz.score}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-4 leading-relaxed">
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  let btnClass =
                    "bg-knowit-surface2 border border-knowit-border text-foreground hover:border-muted-foreground";
                  if (quiz.answered !== null) {
                    if (idx === correctIdx)
                      btnClass =
                        "bg-knowit-green/20 border border-knowit-green text-knowit-green";
                    else if (idx === quiz.answered)
                      btnClass =
                        "bg-destructive/20 border border-destructive text-destructive";
                    else
                      btnClass =
                        "bg-knowit-surface2 border border-knowit-border text-muted-foreground opacity-50";
                  }
                  return (
                    <button
                      type="button"
                      key={opt}
                      data-ocid={`quiz.${cardIndex}.answer.${idx + 1}.button`}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition-all ${btnClass}`}
                    >
                      {ANSWER_LABELS[idx]}. {opt}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

function QuizCentralSection() {
  return (
    <section id="quizzes" className="py-20 max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
          Test your knowledge
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground uppercase">
          QUIZ CENTRAL
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuizCard category={Category.science} cardIndex={1} />
        <QuizCard category={Category.history} cardIndex={2} />
      </div>
    </section>
  );
}

/* ============================================================ DID YOU KNOW ============================================================ */
const fallbackFacts = [
  {
    title: "Honey Never Spoils",
    description:
      "Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible.",
    category: "nature",
  },
  {
    title: "Cleopatra & The Pyramid",
    description:
      "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza.",
    category: "history",
  },
  {
    title: "The Internet's Weight",
    description:
      "If you could weigh all electrons in motion on the internet, they'd weigh about 50 grams — the same as a small egg.",
    category: "technology",
  },
];
const factEmojis = ["🍯", "🌍", "💻", "🔭", "🧬", "⚡"];
const skeletonFactKeys = ["sk-fact-1", "sk-fact-2", "sk-fact-3"];

function DidYouKnowSection() {
  const { data: facts = [], isLoading } = useAllFunFacts();
  const displayFacts = facts.length >= 3 ? facts.slice(0, 3) : fallbackFacts;

  return (
    <section
      id="did-you-know"
      className="py-20"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.13 0.030 250) 0%, oklch(0.15 0.038 248) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Mind-blowing moments
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground uppercase">
            DID YOU KNOW?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading
            ? skeletonFactKeys.map((k) => (
                <Skeleton key={k} className="h-48 rounded-2xl" />
              ))
            : displayFacts.map((fact, i) => (
                <motion.div
                  key={fact.title}
                  data-ocid={`facts.item.${i + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-knowit-border bg-knowit-surface p-6 cursor-default"
                >
                  <div className="text-4xl mb-4">
                    {factEmojis[i % factEmojis.length]}
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground mb-2">
                    {fact.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {fact.description}
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-4 rounded-full text-xs border-knowit-border capitalize"
                  >
                    {fact.category}
                  </Badge>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ EXPLORE ============================================================ */
const exploreTiles = [
  {
    icon: "🗺️",
    title: "World Map Quiz",
    desc: "Name countries, capitals, and landmarks",
    color: "oklch(0.72 0.17 220)",
    bg: "oklch(0.72 0.17 220 / 0.12)",
  },
  {
    icon: "📅",
    title: "Timeline Tool",
    desc: "Order historical events by year",
    color: "oklch(0.985 0.005 250)",
    bg: "oklch(0.22 0.035 250)",
  },
  {
    icon: "🔬",
    title: "Science Spotlight",
    desc: "Weekly science fact deep-dives",
    color: "oklch(0.72 0.19 145)",
    bg: "oklch(0.72 0.19 145 / 0.12)",
  },
  {
    icon: "🏰",
    title: "History Deep Dive",
    desc: "Explore civilizations & empires",
    color: "oklch(0.55 0.22 295)",
    bg: "oklch(0.48 0.22 295 / 0.15)",
  },
  {
    icon: "⭐",
    title: "Fact of the Day",
    desc: "One amazing fact, every single day",
    color: "oklch(0.83 0.16 85)",
    bg: "oklch(0.83 0.16 85 / 0.12)",
  },
];

function ExploreSection() {
  return (
    <section id="explore" className="py-20 max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
          Dive deeper
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground uppercase">
          INTERACTIVE EXPLORE
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {exploreTiles.map((tile, i) => (
          <motion.div
            key={tile.title}
            data-ocid={`explore.item.${i + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="rounded-2xl p-5 cursor-pointer flex flex-col items-center text-center border border-knowit-border"
            style={{ background: tile.bg }}
          >
            <span className="text-4xl mb-3">{tile.icon}</span>
            <h3
              className="font-display font-bold text-sm uppercase tracking-wide mb-1"
              style={{ color: tile.color }}
            >
              {tile.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tile.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================ FOOTER ============================================================ */
const quickLinks: [string, string][] = [
  ["Topics", "topics"],
  ["Quizzes", "quizzes"],
  ["Daily Trivia", "daily-trivia"],
  ["Explore", "explore"],
];

function FooterSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      id="about"
      className="border-t border-knowit-border"
      style={{ background: "oklch(0.11 0.025 250)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-knowit-blue to-knowit-purple flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                KnowIt
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your daily companion for general knowledge. Explore topics, take
              quizzes, and keep your curiosity alive.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(([label, id]) => (
                <li key={id}>
                  <button
                    type="button"
                    data-ocid={`footer.${id}.link`}
                    onClick={() => onNavigate(id)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
              Topics
            </h4>
            <ul className="space-y-2">
              {Object.entries(categoryMeta).map(([cat, meta]) => (
                <li key={cat}>
                  <button
                    type="button"
                    data-ocid={`footer.topic.${cat}.link`}
                    onClick={() => onNavigate("topics")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    {meta.icon} {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-knowit-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} KnowIt. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              style={{ color: "oklch(0.72 0.17 220)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
