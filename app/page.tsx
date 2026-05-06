"use client";

import { useMemo, useRef, useState } from "react";

type View =
  | "dashboard"
  | "metrics"
  | "calendar"
  | "news"
  | "create"
  | "journal"
  | "journal-daily"
  | "journal-library"
  | "accounts"
  | "leaderboard"
  | "sync"
  | "calculators"
  | "crypto"
  | "charts"
  | "alerts"
  | "backtest"
  | "strategy";

type JournalSection = "history" | "daily" | "library";
type LibraryTab = "trades" | "daily" | "strategy" | "templates";

type Trade = {
  symbol: string;
  type: "Buy" | "Sell";
  openPrice: string;
  closePrice: string;
  openTime: string;
  closeTime: string;
  volume: string;
  netProfit: string;
};

const trades: Trade[] = [
  ["XAUUSD.vxc", "Sell", "4667.07", "4662.96", "5/6/26, 7:10 AM", "5/6/26, 7:12 AM", "0.05", "20.55"],
  ["XAUUSD.vxc", "Sell", "4667.10", "4662.96", "5/6/26, 7:10 AM", "5/6/26, 7:12 AM", "0.05", "20.70"],
  ["XAUUSD.vxc", "Sell", "4667.15", "4662.96", "5/6/26, 7:10 AM", "5/6/26, 7:12 AM", "0.05", "20.95"],
  ["XAUUSD.vxc", "Sell", "4667.14", "4662.96", "5/6/26, 7:10 AM", "5/6/26, 7:12 AM", "0.05", "20.90"],
  ["XAUUSD.vxc", "Sell", "4666.63", "4668.09", "5/6/26, 7:07 AM", "5/6/26, 7:10 AM", "0.05", "-7.30"],
  ["XAUUSD.vxc", "Sell", "4666.68", "4668.09", "5/6/26, 7:07 AM", "5/6/26, 7:10 AM", "0.05", "-7.05"],
  ["XAUUSD.vxc", "Sell", "4582.49", "4580.61", "5/5/26, 2:00 PM", "5/5/26, 2:01 PM", "0.05", "9.40"],
  ["XAUUSD.vxc", "Buy", "4570.31", "4578.74", "5/5/26, 1:03 PM", "5/5/26, 1:09 PM", "0.05", "42.15"]
].map(([symbol, type, openPrice, closePrice, openTime, closeTime, volume, netProfit]) => ({
  symbol,
  type: type as "Buy" | "Sell",
  openPrice,
  closePrice,
  openTime,
  closeTime,
  volume,
  netProfit
}));

const libraryCopy: Record<LibraryTab, [string, string, string, string, string]> = {
  trades: ["Trades", "Search by symbol...", "~", "No trades found for the selected period.", "Select a trade to start journaling"],
  daily: ["Daily Journals", "Search journals...", "[]", "No journals found", "Select a journal to start editing"],
  strategy: ["Strategy Library", "Search strategies...", "~", "No strategies found", "Select a strategy to start editing"],
  templates: ["Templates", "Search templates...", "#", "No templates found", "Select a template to view or create a new one"]
};

export default function HomePage() {
  const [view, setView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [libraryTab, setLibraryTab] = useState<LibraryTab>("trades");
  const [floatingMenu, setFloatingMenu] = useState<"mindset" | "tag" | null>(null);
  const platformDialogRef = useRef<HTMLDialogElement>(null);
  const tagDialogRef = useRef<HTMLDialogElement>(null);

  const isJournal = view.startsWith("journal");
  const journalSection: JournalSection = view === "journal-library" ? "library" : view === "journal-daily" ? "daily" : "history";
  const pageTitle = view === "accounts" ? "Accounts" : isJournal ? "Journal" : view === "dashboard" || view === "metrics" ? "Welcome back" : titleCase(view);
  const repeatedTrades = useMemo(() => Array.from({ length: 28 }, (_, index) => trades[index % trades.length]), []);

  function navigate(nextView: View) {
    setView(nextView);
    setFloatingMenu(null);
    if (window.innerWidth < 980) setSidebarOpen(false);
  }

  function openPlatformDialog() {
    platformDialogRef.current?.showModal();
  }

  function openTagDialog() {
    setFloatingMenu(null);
    tagDialogRef.current?.showModal();
  }

  return (
    <div className="app-shell" onClick={(event) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".tag-popover,.mindset-menu,.plus-chip")) setFloatingMenu(null);
    }}>
      <Sidebar view={view} open={sidebarOpen} onNavigate={navigate} />
      <div className={`scrim ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <main className="main">
        <header className="topbar">
          <button className="icon-button" id="menuButton" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}>Menu</button>
          <div className="brand compact">TRADER<span>WAVES</span></div>
          <div className="top-actions">
            <button className="pro">Go Pro</button>
            <button className="icon-button" aria-label="Language">GL</button>
            <button className="icon-button" aria-label="Notifications">NT</button>
            <button className="avatar" aria-label="Profile">US</button>
            <button className="icon-button" aria-label="Team">TM</button>
          </div>
        </header>

        <section className="welcome">
          <div>
            <h1>{pageTitle}, <span>Mohd Shafique Mohd Seth</span></h1>
            <p>Last Sync: 1 minute ago <button className="inline-icon">Refresh</button></p>
          </div>
          <div className="filters">
            <button className="date-filter">Apr 30, 2026 - Today <strong>All</strong></button>
            <button className="icon-button">Filter</button>
          </div>
        </section>

        <section className="controls">
          <div className="selector">
            <button className="selector-main" onClick={() => {
              setAccountOpen((open) => !open);
              setMetricsOpen(false);
            }}><span className="coin" /><strong>REAL</strong> - Grow Cent <span>Share</span></button>
            <div className={`account-menu ${accountOpen ? "open" : ""}`}>
              <h3>Accounts</h3>
              <button><span className="coin" /><b>REAL</b><small>Mohamed Shafique</small><span>Star</span></button>
              <button className="selected"><span className="coin" /><b>REAL</b><small>Grow Cent</small><span>Share</span></button>
              <button className="outline">Create Portfolio</button>
              <button className="primary" onClick={openPlatformDialog}>Add Account</button>
            </div>
          </div>

          <div className="selector">
            <button className="selector-main" onClick={() => {
              setMetricsOpen((open) => !open);
              setAccountOpen(false);
            }}>Settings Metrics <span>Open</span></button>
            <div className={`metrics-menu ${metricsOpen ? "open" : ""}`}>
              <button className="selected">Metrics <span>Pin Edit</span></button>
              <button>Calendar <span>Pin Edit</span></button>
              <button>News <span>Pin Edit</span></button>
              <button>New Template</button>
            </div>
          </div>
        </section>

        {(view === "dashboard" || view === "metrics") && <Dashboard />}
        {isJournal && (
          <Journal
            section={journalSection}
            editorOpen={editorOpen}
            setEditorOpen={setEditorOpen}
            libraryTab={libraryTab}
            setLibraryTab={setLibraryTab}
            trades={repeatedTrades}
            floatingMenu={floatingMenu}
            setFloatingMenu={setFloatingMenu}
            openTagDialog={openTagDialog}
            onSection={(section) => navigate(section === "library" ? "journal-library" : section === "daily" ? "journal-daily" : "journal")}
          />
        )}
        {view === "accounts" && <Accounts onAddAccount={openPlatformDialog} />}
        {!["dashboard", "metrics", "accounts"].includes(view) && !isJournal && (
          <section className="placeholder">{titleCase(view)} workspace</section>
        )}
      </main>

      <button className="float">Help</button>
      <PlatformDialog dialogRef={platformDialogRef} />
      <TagDialog dialogRef={tagDialogRef} />
    </div>
  );
}

function Sidebar({ view, open, onNavigate }: { view: View; open: boolean; onNavigate: (view: View) => void }) {
  const isJournal = view.startsWith("journal");
  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Dashboard sidebar">
      <div className="brand">TRADER<span>WAVES</span></div>
      <NavButton active={view === "dashboard" || view === "metrics"} onClick={() => onNavigate("dashboard")} icon="DB" label="Dashboard" />
      <SubNav active={view === "metrics"} onClick={() => onNavigate("metrics")} label="Metrics" />
      <SubNav active={view === "calendar"} onClick={() => onNavigate("calendar")} label="Calendar" />
      <SubNav active={view === "news"} onClick={() => onNavigate("news")} label="News" />
      <SubNav active={view === "create"} onClick={() => onNavigate("create")} label="Create" />
      <NavButton active={isJournal} onClick={() => onNavigate("journal")} icon="JR" label="Journal" />
      <SubNav active={view === "journal"} onClick={() => onNavigate("journal")} label="Trade History" />
      <SubNav active={view === "journal-daily"} onClick={() => onNavigate("journal-daily")} label="Daily Journal" />
      <SubNav active={view === "journal-library"} onClick={() => onNavigate("journal-library")} label="Library" />
      <NavButton active={view === "accounts"} onClick={() => onNavigate("accounts")} icon="AC" label="Accounts" />
      <NavButton active={view === "leaderboard"} onClick={() => onNavigate("leaderboard")} icon="LB" label="Leaderboard" />
      <NavButton active={view === "sync"} onClick={() => onNavigate("sync")} icon="SY" label="Trade Sync" />
      <NavButton active={view === "calculators"} onClick={() => onNavigate("calculators")} icon="CA" label="Calculators" />
      <NavButton active={view === "crypto"} onClick={() => onNavigate("crypto")} icon="BT" label="Crypto" />
      <NavButton active={view === "charts"} onClick={() => onNavigate("charts")} icon="CH" label="Charts" />
      <NavButton active={view === "alerts"} onClick={() => onNavigate("alerts")} icon="AL" label="Alerts" pro />
      <NavButton active={view === "backtest"} onClick={() => onNavigate("backtest")} icon="BK" label="Backtest" pro />
      <NavButton active={view === "strategy"} onClick={() => onNavigate("strategy")} icon="ST" label="Strategy B..." pro />
      <div className="sidebar-footer">
        <button className="discord">Join our Discord</button>
        <small>v1.7.352</small>
      </div>
    </aside>
  );
}

function NavButton({ active, onClick, icon, label, pro }: { active: boolean; onClick: () => void; icon: string; label: string; pro?: boolean }) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}><span>{icon}</span>{label} {pro && <b>Pro</b>}</button>;
}

function SubNav({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return <button className={`nav-sub ${active ? "active" : ""}`} onClick={onClick}>{label}</button>;
}

function Dashboard() {
  return (
    <section className="dashboard-grid">
      <article className="card performance">
        <div className="card-title">Performance</div>
        <div className="pnl">
          <div>
            <small>Gain %</small>
            <strong className="loss">-98.89%</strong>
            <span className="loss">-$131.21% Abs</span>
          </div>
          <div>
            <small>NET P&amp;L</small>
            <strong className="gain">+USC 3,643.54</strong>
          </div>
        </div>
        <div className="returns">
          <div><small>Daily</small><b className="loss">-47.42%</b></div>
          <div><small>Weekly</small><b className="loss">-98.89%</b></div>
          <div><small>Monthly</small><b className="loss">-98.89%</b></div>
          <div><small>Annualised Return</small><b className="loss">-100.00%</b></div>
        </div>
        <div className="stat-list">
          <h3>Risk</h3>
          <p><span>Max Balance Drawdown</span><b className="loss">99.49%</b></p>
          <p><span>Max Equity Drawdown</span><b>----</b></p>
          <p><span>Current Equity</span><b>USC 6,420.44</b></p>
          <p><span>Current Balance</span><b>USC 6,420.44</b></p>
          <p><span>Highest Balance</span><b>USC 6,420.44</b></p>
          <h3>Capital Flows</h3>
          <p><span>Deposits / Withdrawals</span><b>USC 2,776.90 / USC 0.00</b></p>
          <p><span>Commissions &amp; Swap</span><b>USC 0.00 / USC 0.00</b></p>
          <p><span>Total Lots</span><b>37.01</b></p>
          <h3>Statistics</h3>
          <p><span>Profit Factor</span><b className="gain">3.10</b></p>
          <p><span>Expectancy</span><b>USC 2.86</b></p>
          <p><span>Standard Deviation</span><b>USC 12.23</b></p>
          <p><span>Sharpe Ratio</span><b className="loss">-0.13</b></p>
          <h3>Trade Stats</h3>
          <p><span>Win rate %</span><b className="gain">76.9%</b></p>
          <p><span>Profit Factor</span><b className="gain">3.10</b></p>
          <p><span>Avg Win / Avg Loss</span><b>USC 77.8 / <i className="loss">USC 19.92</i></b></p>
          <p><span>Avg Trade Duration</span><b>9m</b></p>
        </div>
      </article>

      <article className="card compact-chart">
        <div className="card-title">Trade Count <b>1274</b></div>
        <div className="sparkline small" />
      </article>

      <article className="card streak">
        <div className="card-title">Winstreak</div>
        <div className="streak-row">
          <div><strong>5</strong><span>Days</span><small>Best 5</small></div>
          <div><strong>4</strong><span>Trades</span><small>Best 242</small></div>
        </div>
      </article>

      <ChartCard title="Balance" amount="USC 6,420.44" badge="+466.57%" />

      <article className="card donut-card">
        <div className="card-title">Symbols Traded <button>All</button></div>
        <h2>1</h2>
        <div className="donut"><span><b>1,274</b>Trades</span></div>
        <div className="legend"><span />XAUUSDc.va: 1,274 <b>100%</b></div>
      </article>

      <ChartCard title="Profit" amount="USC 3,643.54" badge="1/2" profit />
    </section>
  );
}

function ChartCard({ title, amount, badge, profit }: { title: string; amount: string; badge: string; profit?: boolean }) {
  return (
    <article className="card chart-card">
      <div className="card-title">{title} <span className="badge">{badge}</span><button>All</button></div>
      <h2>{amount}</h2>
      <div className={`area-chart ${profit ? "profit-line" : ""}`} />
      <div className="axis"><span>May</span><span>15:07</span><span>16:31</span><span>5</span><span>6</span></div>
    </article>
  );
}

function Journal(props: {
  section: JournalSection;
  editorOpen: boolean;
  setEditorOpen: (open: boolean) => void;
  libraryTab: LibraryTab;
  setLibraryTab: (tab: LibraryTab) => void;
  trades: Trade[];
  floatingMenu: "mindset" | "tag" | null;
  setFloatingMenu: (menu: "mindset" | "tag" | null) => void;
  openTagDialog: () => void;
  onSection: (section: JournalSection) => void;
}) {
  const copy = libraryCopy[props.libraryTab];
  return (
    <section className="journal-page">
      <div className="journal-head">
        <div className="journal-tabs" role="tablist">
          <button className={props.section === "history" ? "active" : ""} onClick={() => props.onSection("history")}>Trade History</button>
          <button className={props.section === "daily" ? "active" : ""} onClick={() => props.onSection("daily")}>Daily Journal</button>
          <button className={props.section === "library" ? "active" : ""} onClick={() => props.onSection("library")}>Library</button>
        </div>
        <div className="journal-filters">
          <button className="date-filter"><span className="coin" /><strong>REAL</strong> - Grow Cent</button>
          <button className="date-filter">Apr 30, 2026 - Today <strong>All</strong></button>
          <button className="icon-button">F</button><button className="icon-button">D</button>
        </div>
      </div>
      {props.section !== "library" ? (
        <div className="journal-section">
          <JournalSummary editorOpen={props.editorOpen} setEditorOpen={props.setEditorOpen} />
          <article className="card journal-chart-card"><div className="journal-chart-tabs"><button className="active">Balance</button><button>Profit</button></div><div className="daily-balance-chart" /><div className="axis"><span>08:00</span><span>15:10</span><span>15:10</span><span>15:12</span><span>7</span></div></article>
          {props.editorOpen && <article className="journal-editor card"><div className="editor-toolbar"><button>Undo</button><button>Redo</button><button>B</button><button>I</button><button>U</button><button>List</button><button>Image</button></div><textarea placeholder="Write your daily notes here..." /></article>}
          <TradeTable trades={props.trades} floatingMenu={props.floatingMenu} setFloatingMenu={props.setFloatingMenu} openTagDialog={props.openTagDialog} />
        </div>
      ) : (
        <div className="journal-section">
          <div className="library-tabs">
            {(["trades", "daily", "strategy", "templates"] as LibraryTab[]).map((tab) => <button key={tab} className={props.libraryTab === tab ? "active" : ""} onClick={() => props.setLibraryTab(tab)}>{tab === "trades" ? "Trade Journals" : tab === "daily" ? "Daily Journals" : tab === "strategy" ? "Strategy Section" : "Templates"}</button>)}
          </div>
          <div className="library-shell">
            <aside className="library-panel">
              <div className="library-title"><span>{copy[0]}</span><button>+ New</button></div>
              {props.libraryTab === "templates" && <div className="segmented"><button className="active">Trade</button><button>Daily</button></div>}
              <label className="search-box">Search<input placeholder={copy[1]} /></label>
              <div className="empty-state"><strong>{copy[2]}</strong><span>{copy[3]}</span></div>
            </aside>
            <section className="library-workspace">{copy[4]}</section>
          </div>
        </div>
      )}
    </section>
  );
}

function JournalSummary({ editorOpen, setEditorOpen }: { editorOpen: boolean; setEditorOpen: (open: boolean) => void }) {
  return (
    <article className="card journal-summary">
      <div className="summary-top"><div><small>NET P&amp;L</small><h2 className="gain">+54.85</h2><span>Account Overview</span></div><div className="summary-trend">0.86%</div></div>
      <div className="overview-grid"><div><small>Start Balance</small><b>USC 6,365.59</b></div><div><small>End Balance</small><b>USC 6,420.44</b></div><div><small>Deposit</small><b>USC 0.00</b></div></div>
      <div className="journal-stats">
        <h3>Trade Stats</h3>
        <div className="trade-pill-row"><div className="blue-pill"><b>0</b><span>Buys</span></div><div className="red-pill"><b>8</b><span>Sells</span></div><div><b>8</b><span>Trades</span></div></div>
        <p><span>Best Trade</span><b className="gain">USC 20.95</b></p><p><span>Worst Trade</span><b className="loss">-USC 7.30</b></p><p><span>Avg Hold Time</span><b>4 min</b></p><p><span>Winrate</span><b>50%</b></p>
      </div>
      <button className="journal-day-button" onClick={() => setEditorOpen(!editorOpen)}>{editorOpen ? "Hide Editor" : "Journal My Day"}</button>
    </article>
  );
}

function TradeTable({ trades, floatingMenu, setFloatingMenu, openTagDialog }: { trades: Trade[]; floatingMenu: "mindset" | "tag" | null; setFloatingMenu: (menu: "mindset" | "tag" | null) => void; openTagDialog: () => void }) {
  return (
    <div className="trade-table-wrap">
      <div className="trade-table">
        <div className="trade-row head">{["", "Symbol", "Type", "Open Price", "Close Price", "Open Time", "Close Time", "Volu...", "Net Profit", "Rating", "Mindset", "Strategy Tags"].map((cell) => <span key={cell}>{cell}</span>)}</div>
        {trades.map((trade, index) => <div className={`trade-row ${index === 14 ? "selected" : ""}`} key={`${trade.openTime}-${index}`}>
          <span><button className="trade-icon">~</button></span><span>{trade.symbol}</span><span>{trade.type}</span><span>{trade.openPrice}</span><span>{trade.closePrice}</span><span>{trade.openTime}</span><span>{trade.closeTime}</span><span>{trade.volume}</span><span className={Number(trade.netProfit) < 0 ? "loss" : "gain"}>{trade.netProfit}</span><span className="stars">*****</span>
          <span><button className="plus-chip" onClick={(event) => { event.stopPropagation(); setFloatingMenu(floatingMenu === "mindset" ? null : "mindset"); }}>+</button></span>
          <span><button className="plus-chip" onClick={(event) => { event.stopPropagation(); setFloatingMenu(floatingMenu === "tag" ? null : "tag"); }}>+</button></span>
        </div>)}
      </div>
      {floatingMenu === "mindset" && <div className="mindset-menu"><button>Happy</button><button>Sad</button><button>Anxious</button><button>Excited</button><button>Neutral</button></div>}
      {floatingMenu === "tag" && <div className="tag-popover"><h4>Tags</h4><p>Current Tags</p><button className="create-tag" onClick={openTagDialog}>+ Create Tag</button><hr /><p>Select A Tag</p><small>No tags available</small></div>}
      <div className="columns-rail">Columns</div>
    </div>
  );
}

function Accounts({ onAddAccount }: { onAddAccount: () => void }) {
  return <section className="accounts-page"><div className="notice">Issues syncing? Try an account history repair</div><div className="tabs"><button className="active">Accounts</button><button>Portfolios <b>Pro</b></button></div><div className="table-toolbar"><span>2/3</span><button onClick={onAddAccount}>+ Add Account</button><button>Sync All</button></div><div className="account-table"><div className="row head"><span>Name</span><span>Number</span><span>Server</span><span>Type</span><span>Balance</span><span>Actions</span></div><div className="row"><span>Moha...</span><span>21100...</span><span>Valetax</span><span>LIVE</span><span>USC 0...</span><span>Refresh Share Edit Delete</span></div><div className="row"><span>Grow ...</span><span>10511...</span><span>Valetax</span><span>LIVE</span><span>USC 6...</span><span>Refresh Share Edit Delete</span></div></div></section>;
}

function PlatformDialog({ dialogRef }: { dialogRef: React.RefObject<HTMLDialogElement> }) {
  return <dialog ref={dialogRef}><form method="dialog" className="modal"><button className="close" value="cancel">x</button><h2>Select trading platform</h2><div className="platforms">{["MT5", "MT4", "MatchTrader", "Bitunix", "DXTrade", "CTrader", "TradeLocker", "Binance", "ByBit", "Bitget", "Charles Schwab", "CoinBase"].map((platform) => <button type="button" key={platform}><span>{platform.slice(0, 2)}</span>{platform}</button>)}</div><div className="or">or</div><button className="manual" value="manual">Add account manually</button></form></dialog>;
}

function TagDialog({ dialogRef }: { dialogRef: React.RefObject<HTMLDialogElement> }) {
  return <dialog ref={dialogRef}><form method="dialog" className="modal tag-modal"><button className="close" value="cancel">x</button><h2>Create Tag</h2><label>Tag Name<input placeholder="e.g Breakout" /></label><span>Tag Color</span><div className="swatches"><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="color-box" /><div className="hue-bar" /><div className="tag-preview">Tag Preview</div><footer><button value="cancel">Cancel</button><button value="create">Create</button></footer></form></dialog>;
}

function titleCase(value: string) {
  return value.replace(/^\w/, (match) => match.toUpperCase());
}
