import { getToken } from "./services/submissions";
import ReactDOM from "react-dom/client";
import { SubmissionPrompt } from "./popup/SubmissionPrompt";

let token: string | null = null;
let hasTriggered = false;
let buttonPressed = false;
let topics: string[] = grabTopics();
let problemID: string = grabProblemSlug();

function grabTopics(): string[] {
  const tagEls = document.querySelectorAll('a[href^="/tag/"]');
  return Array.from(tagEls)
    .map((el) => el.textContent?.trim() ?? "")
    .filter(Boolean);
}

function grabProblemSlug(): string {
  const match = location.href.match(/\/problems\/([^/]+)/);
  return match ? match[1] : "";
}

async function mountPrompt() {
  const host = document.createElement("div");
  host.id = "lc-recall-root";
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });

  const cssUrl = chrome.runtime.getURL("src/content.compiled.css");
  const cssText = await fetch(cssUrl).then(r => r.text());

  const styleEl = document.createElement("style");
  styleEl.textContent = cssText;
  shadow.appendChild(styleEl);

  const mountPoint = document.createElement("div");
  shadow.appendChild(mountPoint);

  const root = ReactDOM.createRoot(mountPoint);

  const unmount = () => {
    root.unmount();
    host.remove();
  };

  root.render(
    <SubmissionPrompt
      problemSlug={problemID}
      topics={topics}
      onSave={(data) => {
        chrome.runtime.sendMessage(
          { type: "SAVE_SUBMISSION", payload: data },
          () => {
            if (chrome.runtime.lastError) {
              console.error("❌ Message failed:", chrome.runtime.lastError.message);
            }
          }
        );
        unmount();
      }}
      onDismiss={unmount}
    />
  );
}

function attachSubmitListener() {
  const submitBtn = document.querySelector<HTMLElement>('[data-e2e-locator="console-submit-button"]');
  if (submitBtn && !submitBtn.dataset.lcListenerAttached) {
    submitBtn.dataset.lcListenerAttached = "true";
    submitBtn.addEventListener("click", () => {
      buttonPressed = true;
      console.log("🟢 Submit button clicked");
    });
  }
}

function checkForAccepted() {
  const resultEl = document.querySelector('[data-e2e-locator="submission-result"]');

  if (!resultEl || token == null) return;

  const statusText = resultEl.textContent?.trim();

  if (statusText === "Accepted" && buttonPressed && !hasTriggered) {
    hasTriggered = true;
    buttonPressed = false;
    mountPrompt();
  }
}

async function startObserver() {
  token = await getToken();
  const observer = new MutationObserver(() => {
    attachSubmitListener();
    checkForAccepted();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log("Observer started");
}

startObserver();

let lastUrl = location.href;

setInterval(async () => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    hasTriggered = false;
    buttonPressed = false;
    token = await getToken();
    topics = grabTopics();
    problemID = grabProblemSlug();
  }
}, 1000);