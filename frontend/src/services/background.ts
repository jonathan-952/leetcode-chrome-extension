import { handleLogin, handleSignup, handleLogout } from "./auth";
import fetchProblems from "./fetch";
import { handleAccepted } from "./submissions";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "FETCH_PROBLEMS") {
    (async () => {
      try {
        const data = await fetchProblems(); // or create handleSaveSubmission
        sendResponse({ success: true, data});
      } catch (err) {
        console.error(err);
        sendResponse({ success: false, error: "No token or failed fetch" });
      }
    })();
    return true;
  }
  if (message.type === "LOGIN") {
    handleLogin(message.payload).then(sendResponse);
    return true;
  }
  if (message.type === "SIGNUP") {
    handleSignup(message.payload).then(sendResponse);
    return true;
  }
  if (message.type === "LOGOUT") {
    handleLogout().then(sendResponse);
    return true;
  }
  if (message.type === "SAVE_SUBMISSION") {
    (async () => {
      try {
        await handleAccepted(message.payload); // or create handleSaveSubmission
        sendResponse({ success: true });
      } catch (err) {
        console.error(err);
        sendResponse({ success: false , error: err});
      }
    })();

    return true; // 🔥 required for async
  }
});