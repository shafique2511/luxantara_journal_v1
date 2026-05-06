const state = {
  activeView: "dashboard",
  supabase: null
};

const sidebar = document.querySelector("#sidebar");
const scrim = document.querySelector("#scrim");
const dashboardView = document.querySelector("#dashboardView");
const accountsView = document.querySelector("#accountsView");
const placeholderView = document.querySelector("#placeholderView");
const pageTitle = document.querySelector("#pageTitle");
const platformDialog = document.querySelector("#platformDialog");

function toggleSidebar(force) {
  const open = typeof force === "boolean" ? force : !sidebar.classList.contains("open");
  sidebar.classList.toggle("open", open);
  scrim.classList.toggle("open", open);
}

function setView(view) {
  state.activeView = view;
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view || (view === "metrics" && button.dataset.view === "dashboard"));
  });

  dashboardView.classList.toggle("hidden", view !== "dashboard" && view !== "metrics");
  accountsView.classList.toggle("hidden", view !== "accounts");
  placeholderView.classList.toggle("hidden", view === "dashboard" || view === "metrics" || view === "accounts");

  if (view === "accounts") {
    pageTitle.innerHTML = "Accounts, <span>Mohd Shafique Mohd Seth</span>";
  } else if (view === "dashboard" || view === "metrics") {
    pageTitle.innerHTML = "Welcome back, <span>Mohd Shafique Mohd Seth</span>";
  } else {
    const label = view.replace(/^\w/, (match) => match.toUpperCase());
    pageTitle.innerHTML = `${label}, <span>Mohd Shafique Mohd Seth</span>`;
    placeholderView.textContent = `${label} workspace`;
  }

  if (window.innerWidth < 980) toggleSidebar(false);
}

function setupMenus() {
  const accountSelector = document.querySelector("#accountSelector");
  const accountMenu = document.querySelector("#accountMenu");
  const metricsButton = document.querySelector("#metricsButton");
  const metricsMenu = document.querySelector("#metricsMenu");

  accountSelector.querySelector(".selector-main").addEventListener("click", () => {
    accountMenu.classList.toggle("open");
    metricsMenu.classList.remove("open");
  });

  metricsButton.addEventListener("click", () => {
    metricsMenu.classList.toggle("open");
    accountMenu.classList.remove("open");
  });

  document.addEventListener("click", (event) => {
    if (!accountSelector.contains(event.target)) accountMenu.classList.remove("open");
    if (!metricsButton.parentElement.contains(event.target)) metricsMenu.classList.remove("open");
  });
}

async function setupSupabase() {
  if (!window.supabase) return;

  try {
    const response = await fetch("/api/config");
    if (!response.ok) return;
    const config = await response.json();
    if (config.supabaseUrl && config.supabaseAnonKey) {
      state.supabase = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    }
  } catch {
    state.supabase = null;
  }
}

document.querySelector("#menuButton").addEventListener("click", () => toggleSidebar());
scrim.addEventListener("click", () => toggleSidebar(false));
document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});
document.querySelector("#openPlatform").addEventListener("click", () => platformDialog.showModal());
document.querySelector("#addAccountTop").addEventListener("click", () => platformDialog.showModal());

setupMenus();
setupSupabase();
