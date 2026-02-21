import { useState } from "react";

type Rating = 1 | 2 | 3 | 4 | 5;

interface SubmissionPromptProps {
  problemSlug: string;
  topics: string[];
  url: string;
  onSave: (data: {
    id: string;
    title: string;
    topic: string;
    rating: Rating;
    notes: string;
    url: string;
    daysUntilReview: number;
  }) => void;
  onDismiss: () => void;
}

const StarRating = ({ value, onChange }: { value: Rating; onChange: (r: Rating) => void }) => (
  <div className="flex gap-0.5">
    {([1, 2, 3, 4, 5] as Rating[]).map((n) => (
      <button
        key={n}
        onClick={() => onChange(n)}
        className={`text-base leading-none transition-colors cursor-pointer ${
          n <= value ? "text-yellow-400" : "text-zinc-700"
        } hover:text-yellow-300`}
      >
        ★
      </button>
    ))}
  </div>
);

export const SubmissionPrompt = ({
  problemSlug,
  topics,
  url,
  onSave,
  onDismiss,
}: SubmissionPromptProps) => {
  const [rating, setRating] = useState<Rating>(3);
  const [notes, setNotes] = useState("");

  const title = problemSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const handleSave = () => {
    onSave({
      id: crypto.randomUUID(),
      title,
      topic: topics[0] ?? "General",
      rating,
      notes,
      url,
      daysUntilReview: 0,
    });
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
      <div className="w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
        
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-zinc-800">
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
            ✓ Accepted
          </span>
          <h2 className="text-sm font-semibold text-white mt-2">{title}</h2>
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {topics.map((t) => (
                <span key={t} className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <div>
            <p className="text-xs text-zinc-500 mb-2">How well did you understand this?</p>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-2">Notes <span className="text-zinc-700">(optional)</span></p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key insight, approach, gotchas..."
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 resize-none focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-white text-zinc-900 text-xs font-semibold py-2 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Save to Deck
          </button>
          <button
            onClick={onDismiss}
            className="bg-zinc-800 text-zinc-500 hover:text-zinc-300 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};