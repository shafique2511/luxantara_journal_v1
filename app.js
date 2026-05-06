const state = {
  activeView: "dashboard",
  activeJournalSection: "history",
  supabase: null
};

const sidebar = document.querySelector("#sidebar");
const scrim = document.querySelector("#scrim");
const dashboardView = document.querySelector("#dashboardView");
const accountsView = document.querySelector("#accountsView");
const journalView = document.querySelector("#journalView");
const placeholderView = document.querySelector("#placeholderView");
const pageTitle = document.querySelector("#pageTitle");
const platformDialog = document.querySelector("#platformDialog");
const tagDialog = document.querySelector("#tagDialog");

function toggleSidebar(force) {
  const open = typeof force === "boolean" ? force : !sidebar.classList.contains("open");
  sidebar.classList.toggle("open", open);
  scrim.classList.toggle("open", open);
}

function setView(view) {
  state.activeView = view;
  const isJournal = view.startsWith("journal");
  updateNavigation(view);

  dashboardView.classList.toggle("hidden", view !== "dashboard" && view !== "metrics");
  accountsView.classList.toggle("hidden", view !== "accounts");
  journalView.classList.toggle("hidden", !isJournal);
  placeholderView.classList.toggle("hidden", view === "dashboard" || view === "metrics" || view === "accounts" || isJournal);

  if (view === "accounts") {
    pageTitle.innerHTML = "Accounts, <span>Mohd Shafique Mohd Seth</span>";
  } else if (isJournal) {
    pageTitle.innerHTML = "Journal, <span>Mohd Shafique Mohd Seth</span>";
    if (view === "journal-daily") setJournalSection("daily");
    if (view === "journal-library") setJournalSection("library");
    if (view === "journal") setJournalSection("history");
  } else if (view === "dashboard" || view === "metrics") {
    pageTitle.innerHTML = "Welcome back, <span>Mohd Shafique Mohd Seth</span>";
  } else {
    const label = view.replace(/^\w/, (match) => match.toUpperCase());
    pageTitle.innerHTML = `${label}, <span>Mohd Shafique Mohd Seth</span>`;
    placeholderView.textContent = `${label} workspace`;
  }

  if (window.innerWidth < 980) toggleSidebar(false);
}

function updateNavigation(view) {
  document.querySelectorAll("[data-view]").forEach((button) => {
    const target = button.dataset.view;
    const isDashboardParent = target === "dashboard" && (view === "dashboard" || view === "metrics");
    const isJournalParent = target === "journal" && view.startsWith("journal") && button.classList.contains("nav-item");
    const isExactSubItem = target === view && !button.classList.contains("nav-item");
    const isExactMainItem = target === view && button.classList.contains("nav-item") && !view.startsWith("journal");
    button.classList.toggle("active", isDashboardParent || isJournalParent || isExactSubItem || isExactMainItem);
  });
}

function setJournalSection(section) {
  state.activeJournalSection = section;
  const showHistory = section === "history" || section === "daily";
  document.querySelector("#journalHistory").classList.toggle("hidden", !showHistory);
  document.querySelector("#journalLibrary").classList.toggle("hidden", section !== "library");
  document.querySelector("#dailyEditor").classList.toggle("hidden", section !== "daily");
  document.querySelectorAll("[data-journal-section]").forEach((button) => {
    button.classList.toggle("active", button.dataset.journalSection === section);
  });
}

function setLibraryTab(tab) {
  const title = document.querySelector("#libraryTitle");
  const search = document.querySelector("#librarySearch");
  const emptyIcon = document.querySelector("#emptyIcon");
  const emptyText = document.querySelector("#emptyText");
  const workspace = document.querySelector("#libraryWorkspace");
  const templateSegment = document.querySelector("#templateSegment");
  const copy = {
    trades: ["Trades", "Search by symbol...", "⌁", "No trades found for the selected period.", "Select a trade to start journaling"],
    daily: ["Daily Journals", "Search journals...", "▤", "No journals found", "Select a journal to start editing"],
    strategy: ["Strategy Library", "Search strategies...", "⌁", "No strategies found", "Select a strategy to start editing"],
    templates: ["Templates", "Search templates...", "▣", "No templates found", "Select a template to view or create a new one"]
  };
  const selected = copy[tab];
  title.textContent = selected[0];
  search.placeholder = selected[1];
  emptyIcon.textContent = selected[2];
  emptyText.textContent = selected[3];
  workspace.textContent = selected[4];
  templateSegment.classList.toggle("hidden", tab !== "templates");
  document.querySelectorAll("[data-library-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.libraryTab === tab);
  });
}

function renderTradeTable() {
  const rows = [
    ["XAUUSD.vxc", "Sell", "4667.07", "4662.96", "5/6/26, 7:10 AM", "5/6/26, 7:12 AM", "0.05", "20.55"],
    ["XAUUSD.vxc", "Sell", "4667.10", "4662.96", "5/6/26, 7:10 AM", "5/6/26, 7:12 AM", "0.05", "20.70"],
    ["XAUUSD.vxc", "Sell", "4667.15", "4662.96", "5/6/26, 7:10 AM", "5/6/26, 7:12 AM", "0.05", "20.95"],
    ["XAUUSD.vxc", "Sell", "4667.14", "4662.96", "5/6/26, 7:10 AM", "5/6/26, 7:12 AM", "0.05", "20.90"],
    ["XAUUSD.vxc", "Sell", "4666.63", "4668.09", "5/6/26, 7:07 AM", "5/6/26, 7:10 AM", "0.05", "-7.30"],
    ["XAUUSD.vxc", "Sell", "4666.68", "4668.09", "5/6/26, 7:07 AM", "5/6/26, 7:10 AM", "0.05", "-7.05"],
    ["XAUUSD.vxc", "Sell", "4582.49", "4580.61", "5/5/26, 2:00 PM", "5/5/26, 2:01 PM", "0.05", "9.40"],
    ["XAUUSD.vxc", "Buy", "4570.31", "4578.74", "5/5/26, 1:03 PM", "5/5/26, 1:09 PM", "0.05", "42.15"]
  ];
  const table = document.querySelector("#tradeTable");
  const header = ["", "Symbol", "Type", "Open Price", "Close Price", "Open Time", "Close Time", "Volu...", "Net Profit", "Rating", "Mindset", "Strategy Tags"];
  const markup = [`<div class="trade-row head">${header.map((cell) => `<span>${cell}</span>`).join("")}</div>`];
  Array.from({ length: 28 }).forEach((_, index) => {
    const row = rows[index % rows.length];
    const profitClass = Number(row[7]) < 0 ? "loss" : "gain";
    markup.push(`
      <div class="trade-row ${index === 14 ? "selected" : ""}">
        <span><button class="trade-icon" aria-label="Open trade">⌁</button></span>
        <span>${row[0]}</span><span>${row[1]}</span><span>${row[2]}</span><span>${row[3]}</span><span>${row[4]}</span>
        <span>${row[5]}</span><span>${row[6]}</span><span class="${profitClass}">${row[7]}</span><span class="stars">☆☆☆☆☆</span>
        <span><button class="plus-chip mindset-button">+</button></span><span><button class="plus-chip tag-button">+</button></span>
      </div>
    `);
  });
  table.innerHTML = markup.join("");
}

function openFloatingMenu(target, type) {
  document.querySelectorAll(".tag-popover,.mindset-menu").forEach((node) => node.remove());
  const menu = document.createElement("div");
  const rect = target.getBoundingClientRect();
  menu.style.left = `${Math.min(rect.left, window.innerWidth - 220)}px`;
  menu.style.top = `${rect.bottom + window.scrollY + 5}px`;
  if (type === "mindset") {
    menu.className = "mindset-menu";
    menu.innerHTML = "<button>🙂 Happy</button><button>😞 Sad</button><button>😟 Anxious</button><button>😄 Excited</button><button>😐 Neutral</button>";
  } else {
    menu.className = "tag-popover";
    menu.innerHTML = "<h4>Tags</h4><p>Current Tags</p><button class='create-tag'>+ Create Tag</button><hr><p>Select A Tag</p><small>No tags available</small>";
    menu.querySelector(".create-tag").addEventListener("click", () => tagDialog.showModal());
  }
  document.body.appendChild(menu);
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
document.querySelectorAll("[data-journal-section]").forEach((button) => {
  button.addEventListener("click", () => {
    const sectionRoutes = {
      history: "journal",
      daily: "journal-daily",
      library: "journal-library"
    };
    setView(sectionRoutes[button.dataset.journalSection]);
  });
});
document.querySelectorAll("[data-library-tab]").forEach((button) => {
  button.addEventListener("click", () => setLibraryTab(button.dataset.libraryTab));
});
document.querySelector("#toggleEditor").addEventListener("click", () => {
  const editor = document.querySelector("#dailyEditor");
  editor.classList.toggle("hidden");
  document.querySelector("#toggleEditor").textContent = editor.classList.contains("hidden") ? "Journal My Day" : "Hide Editor";
});
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("mindset-button")) openFloatingMenu(event.target, "mindset");
  if (event.target.classList.contains("tag-button")) openFloatingMenu(event.target, "tag");
  if (!event.target.closest(".tag-popover,.mindset-menu,.plus-chip")) {
    document.querySelectorAll(".tag-popover,.mindset-menu").forEach((node) => node.remove());
  }
});

setupMenus();
renderTradeTable();
setupSupabase();
