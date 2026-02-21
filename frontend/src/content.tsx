// content.ts
import { getToken } from "./services/submissions";
import ReactDOM from "react-dom/client";
import { SubmissionPrompt } from "./popup/SubmissionPrompt";
// content.ts

var token: string | null = null;
var hasTriggered = false;
var topics: string[] = grabTopics();
var problemID: string = grabProblemSlug();

function grabTopics(): string[] {
  const tagEls = document.querySelectorAll('a[href^="/tag/"]');
  return Array.from(tagEls)
    .map((el) => el.textContent?.trim() ?? "")
    .filter(Boolean);
}

function grabProblemSlug(): string {
  const match = location.href.match(/\/problems\/([^\/]+)/);
  return match ? match[1] : "";
}

async function mountPrompt() {
  const host = document.createElement("div");
  host.id = "lc-recall-root";
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });

  const cssUrl = chrome.runtime.getURL("src/content.compiled.css");
  console.log("🔧 fetching CSS from:", cssUrl);
  const cssText = await fetch(cssUrl).then(r => r.text());
  console.log("🔧 CSS preview:", cssText.slice(0, 100));

  const styleEl = document.createElement("style");
  styleEl.textContent = cssText;
  shadow.appendChild(styleEl);

  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  const root = ReactDOM.createRoot(mountPoint);
  console.log("🔧 React root created, rendering...");

  const unmount = () => {
    root.unmount();
    host.remove();
  };

  root.render(
    <SubmissionPrompt
      problemSlug={problemID}
      topics={topics}
      onSave={(data) => {
        console.log("💾 Save triggered, payload:", data);
        chrome.runtime.sendMessage(
          { type: "SAVE_SUBMISSION", payload: data },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("❌ Message failed:", chrome.runtime.lastError.message);
            } else {
              console.log("✅ Background received:", response);
            }
          }
        );
        unmount();
      }}
      onDismiss={unmount}
    />
  );

  console.log("🔧 render called");
}

function checkForAccepted() {
  const resultEl = document.querySelector(
    '[data-e2e-locator="submission-result"]',
  );

  if (!resultEl || token == null) return;

  const statusText = resultEl.textContent?.trim();

  if (statusText === "Accepted" && !hasTriggered) {
    hasTriggered = true;
    console.log("✅ Accepted detected!");
    mountPrompt(); // ← replaces your sendMessage call
  }
}

async function startObserver() {
  token = await getToken();
  const observer = new MutationObserver(() => {
    checkForAccepted();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log("👀 Observer started");
}

startObserver();

var lastUrl = location.href;

setInterval(async () => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    hasTriggered = false;
    token = await getToken();
    topics = grabTopics();
    problemID = grabProblemSlug();
    console.log("🔄 URL changed, reset trigger");
  }
}, 1000);
