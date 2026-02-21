import { useState } from "react";

type Rating = 1 | 2 | 3 | 4 | 5;

interface Problem {
  id: number;
  title: string;
  topic: string;
  rating: Rating;
  notes: string;
  url: string;
  daysUntilReview: number;
}

const MOCK_PROBLEMS: Problem[] = [
  { id: 1, title: "Two Sum", topic: "Hash Map", rating: 5, notes: "Store complement as key, index as value.", url: "https://leetcode.com/problems/two-sum/", daysUntilReview: 0 },
  { id: 2, title: "Valid Parentheses", topic: "Stack", rating: 4, notes: "Use stack, match closing brackets.", url: "https://leetcode.com/problems/valid-parentheses/", daysUntilReview: 0 },
  { id: 3, title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", rating: 3, notes: "Sliding window + set. Expand right, shrink left on duplicate.", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", daysUntilReview: 1 },
  { id: 4, title: "3Sum", topic: "Two Pointers", rating: 2, notes: "Sort first. Fix one, two pointer for rest. Skip duplicates.", url: "https://leetcode.com/problems/3sum/", daysUntilReview: 3 },
  { id: 5, title: "Maximum Subarray", topic: "Dynamic Programming", rating: 4, notes: "Kadane's: track local and global max.", url: "https://leetcode.com/problems/maximum-subarray/", daysUntilReview: 5 },
  { id: 6, title: "Climbing Stairs", topic: "Dynamic Programming", rating: 5, notes: "Fibonacci pattern. dp[i] = dp[i-1] + dp[i-2].", url: "https://leetcode.com/problems/climbing-stairs/", daysUntilReview: 7 },
  { id: 7, title: "Median of Two Sorted Arrays", topic: "Binary Search", rating: 2, notes: "Binary search on smaller array. Revisit partition logic.", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", daysUntilReview: 10 },
  { id: 8, title: "Merge Intervals", topic: "Intervals", rating: 3, notes: "Sort by start. Merge if overlap.", url: "https://leetcode.com/problems/merge-intervals/", daysUntilReview: 14 },
];

type Tab = "today" | "week" | "all";

const StarRating = ({
  value,
  onChange,
}: {
  value: Rating;
  onChange?: (r: Rating) => void;
}) => (
  <div className="flex gap-0.5">
    {([1, 2, 3, 4, 5] as Rating[]).map((n) => (
      <button
        key={n}
        onClick={() => onChange?.(n)}
        className={`text-base leading-none transition-colors ${
          n <= value ? "text-yellow-400" : "text-zinc-700"
        } ${onChange ? "hover:text-yellow-300 cursor-pointer" : "cursor-default"}`}
      >
        ★
      </button>
    ))}
  </div>
);

interface DetailModalProps {
  problem: Problem;
  onClose: () => void;
  onSave: (updated: Problem) => void;
}

const DetailModal = ({ problem, onClose, onSave }: DetailModalProps) => {
  const [rating, setRating] = useState<Rating>(problem.rating);
  const [notes, setNotes] = useState(problem.notes);
  const [url, setUrl] = useState(problem.url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 pt-5 pb-4 border-b border-zinc-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-zinc-500 mb-1">{problem.topic}</p>
              <h2 className="text-sm font-semibold text-white leading-snug">
                {problem.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-600 hover:text-zinc-300 transition-colors mt-0.5 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-5 py-4 space-y-4">
          <div>
            <p className="text-xs text-zinc-500 mb-2">Understanding</p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key concepts, patterns, edge cases..."
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 resize-none focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-2">Problem URL</p>
            <div className="flex gap-2">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors min-w-0"
              />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title="Open problem"
                className="flex-shrink-0 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-white px-3 py-2 rounded-lg text-sm transition-all"
              >
                ↗
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={() => {
              onSave({ ...problem, rating, notes, url });
              onClose();
            }}
            className="w-full bg-white text-zinc-900 text-xs font-semibold py-2 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const ProblemCard = ({
  problem,
  onClick,
}: {
  problem: Problem;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg px-4 py-3 transition-all group"
  >
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-white truncate">{problem.title}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{problem.topic}</p>
      </div>
      <StarRating value={problem.rating} />
    </div>
  </button>
);

export default function Dashboard() {
  const [problems, setProblems] = useState<Problem[]>(MOCK_PROBLEMS);
  const [selected, setSelected] = useState<Problem | null>(null);
  const [tab, setTab] = useState<Tab>("today");

  const today = problems.filter((p) => p.daysUntilReview === 0);
  const week = problems.filter((p) => p.daysUntilReview > 0 && p.daysUntilReview <= 7);
  const all = problems.filter((p) => p.daysUntilReview > 7);

  const handleSave = (updated: Problem) =>
    setProblems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "today", label: "Due Today", count: today.length },
    { key: "week", label: "This Week", count: week.length },
    { key: "all", label: "All", count: all.length },
  ];

  const currentList =
    tab === "today" ? today : tab === "week" ? week : all;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-sm font-semibold text-white tracking-tight">
            LC Recall
          </h1>
          <button
            onClick={() => alert("Logged out")}
            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            Log out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-4">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-md font-medium transition-all ${
                tab === key
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  tab === key
                    ? "bg-zinc-700 text-zinc-200"
                    : "bg-zinc-800 text-zinc-600"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Problem List */}
        <div className="space-y-2">
          {currentList.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-10">
              Nothing here.
            </p>
          ) : (
            currentList.map((p) => (
              <ProblemCard key={p.id} problem={p} onClick={() => setSelected(p)} />
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          problem={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}