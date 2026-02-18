import { getToken } from "./services/submissions";

var token: string | null = null;
var hasTriggered = false;
var topics: string[] = grabTopics();
var problem_id: string = grabProblemSlug();

function grabTopics(): string[] {
  const tagEls = document.querySelectorAll('a[href^="/tag/"]');
  return Array.from(tagEls).map(el => el.textContent?.trim() ?? "").filter(Boolean);
}

function grabProblemSlug(): string {
  const match = location.href.match(/\/problems\/([^\/]+)/);
  return match ? match[1] : "";
}

function checkForAccepted() {
  const resultEl = document.querySelector(
    '[data-e2e-locator="submission-result"]'
  );

  if (!resultEl || token == null) return;

  const statusText = resultEl.textContent?.trim();

  if (statusText === "Accepted" && !hasTriggered) {
    hasTriggered = true;
    console.log("✅ Accepted detected!");

    chrome.runtime.sendMessage({
      type: "SUBMISSION_ACCEPTED",
      payload: {
        problem_id,
        topics,
      }
    });

  }
}

async function startObserver() {
  token = await getToken();
  const observer = new MutationObserver(() => {
    checkForAccepted();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log("👀 Observer started");
}

startObserver();

var lastUrl = location.href;

setInterval(async () => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    hasTriggered = false;
    token = await getToken();
    // Re-grab in case user navigated to a different problem
    topics = grabTopics();
    problem_id = grabProblemSlug();
    console.log("🔄 URL changed, reset trigger");
  }
}, 1000);