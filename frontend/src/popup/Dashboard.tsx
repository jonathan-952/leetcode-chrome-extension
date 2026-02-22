import { useState, useEffect } from "react";

type Rating = 1 | 2 | 3 | 4 | 5;

interface Problem {
  id: number;
  problemID: string;
  notes: string;
  rating: Rating;
  lastSubmitted: string;
  userID: string;
  topics: string[];
}

type Tab = "today" | "week" | "all";

function getDaysUntilReview(lastSubmitted: string) {
  const last = new Date(lastSubmitted);
  const now = new Date();

  const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

  if (diff >= 7) return 0; // due today
  if (diff >= 3) return 3; // this week
  return 10; // later
}

const StarRating = ({
  value,
  onChange,
}: {
  value: Rating;
  onChange?: (r: Rating) => void;
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        onClick={() => onChange?.(n as Rating)}
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

  const url = `https://leetcode.com/problems/${problem.problemID}/`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-4 border-b border-zinc-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                {problem.topics?.join(", ")}
              </p>
              <h2 className="text-sm font-semibold text-white leading-snug">
                {problem.problemID}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

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
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 resize-none focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline"
            >
              Open Problem ↗
            </a>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={() => {
              onSave({ ...problem, rating, notes });
              onClose();
            }}
            className="w-full bg-white text-zinc-900 text-xs font-semibold py-2 rounded-lg hover:bg-zinc-200"
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
    className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg px-4 py-3"
  >
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-white truncate">{problem.problemID}</p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {problem.topics?.join(", ")}
        </p>
      </div>
      <StarRating value={problem.rating} />
    </div>
  </button>
);

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selected, setSelected] = useState<Problem | null>(null);
  const [tab, setTab] = useState<Tab>("today");

  //

  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: "FETCH_PROBLEMS"},
      (response) => {
        if (response?.success) setProblems(response.data);

        else console.error(response?.error ?? "something went wrong.");
      }
    );
  }, []);
  

  const handleSave = async (updated: Problem) => {
    chrome.runtime.sendMessage(
      {type: "SAVE_SUBMISSION", payload: updated},
      (response) => {
        if (response?.success) setProblems(response.data);

        else console.error(response?.error ?? "something went wrong.");
      }
    );

    setProblems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };
  // 

  const today = problems.filter(
    (p) => getDaysUntilReview(p.lastSubmitted) === 0,
  );

  const week = problems.filter((p) => {
    const days = getDaysUntilReview(p.lastSubmitted);
    return days > 0 && days <= 7;
  });

  const all = problems.filter((p) => getDaysUntilReview(p.lastSubmitted) > 7);

  const tabs = [
    { key: "today" as Tab, label: "Due Today", list: today },
    { key: "week" as Tab, label: "This Week", list: week },
    { key: "all" as Tab, label: "All", list: all },
  ];

  const currentList = tabs.find((t) => t.key === tab)?.list || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-sm font-semibold tracking-tight">LC Recall</h1>
          <button
            onClick={() => {
              // Remove JWT token
              chrome.storage.local.remove("jwt_token");
              onLogout();
            }}
            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            Log out
          </button>
        </div>

        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 text-xs py-1.5 rounded-md ${
                tab === t.key ? "bg-zinc-800 text-white" : "text-zinc-500"
              }`}
            >
              {t.label} ({t.list.length})
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {currentList.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-10">
              Nothing here.
            </p>
          ) : (
            currentList.map((p) => (
              <ProblemCard
                key={p.id}
                problem={p}
                onClick={() => setSelected(p)}
              />
            ))
          )}
        </div>
      </div>

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


// useEffect(() => {
//     chrome.runtime.sendMessage(
//       { type: "FETCH_PROBLEMS"},
//       (response) => {
//         setLoading(false);
//         if (response?.success) setProblems(response.data);
        
//         else setError(response?.error ?? "something went wrong.");
//       }
//     );
//     fetch("http://localhost:8080/problems", {
//       headers: {
//         Authorization: localStorage.getItem("token") || "",
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => setProblems(data));
//   }, []);


// await fetch(`http://localhost:8080/problems/${updated.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: localStorage.getItem("token") || "",
//       },
//       body: JSON.stringify({
//         rating: updated.rating,
//         notes: updated.notes,
//       }),