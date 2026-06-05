// Cache the Steam profile background URL and apply it on community pages.
// On profile pages: saves the background URL to localStorage.
// On all community pages: applies the cached background to the html element.

// Guard: only run inside actual steamcommunity.com pages, not the Library UI context.
if (!window.location.host.includes("steamcommunity.com")) return;

const STORAGE_KEY = "minimal_dark_profile_bg";

function saveBackground() {
    const el = document.querySelector("div.has_profile_background[style*='background-image']");
    if (!el) return false;
    const bg = el.style.backgroundImage;
    if (bg && bg !== "none" && bg !== "") {
        localStorage.setItem(STORAGE_KEY, bg);
        return true;
    }
    return false;
}

function applyBackground() {
    const bg = localStorage.getItem(STORAGE_KEY);
    if (!bg) return;
    const html = document.documentElement;
    html.style.setProperty("background-image", bg, "important");
    html.style.setProperty("background-size", "cover", "important");
    html.style.setProperty("background-position", "center top", "important");
    html.style.setProperty("background-attachment", "fixed", "important");
}

applyBackground();

// Poll for the background element — React renders it after script execution
let attempts = 0;
const poll = setInterval(() => {
    if (saveBackground() || ++attempts >= 20) {
        clearInterval(poll);
        applyBackground();
    }
}, 500);
