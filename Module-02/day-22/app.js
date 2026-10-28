const state = {
  base: "ETB",
  rates: {},
  watchlist: [],
  amount: 100,
  currency: "USD",
};

const API = "https://open.er-api.com/v6/latest/ETB";
const KEY = "birrwatch";


const statusEl = document.querySelector("#status");
const form = document.querySelector("#convert-form");
const amountInput = document.querySelector("#amount");
const select = document.querySelector("#currency");
const resultEl = document.querySelector("#result");
const watchUl = document.querySelector("#watchlist");
const addBtn = document.querySelector("#watch");

function save() {
  localStorage.setItem(KEY, JSON.stringify({
    watchlist: state.watchlist,
    currency: state.currency,
  }));
}

function load() {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    try {
      Object.assign(state, JSON.parse(saved));
    } catch (e) {
      console.error("Failed to parse saved state", e);
    }
  }
}


async function loadRates() {
  statusEl.textContent = "Loading rates...";
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    state.rates = data.rates;
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = "Could not load rates.";
  }
}


function render() {
  const codes = Object.keys(state.rates);
  select.innerHTML = codes
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");

  if (codes.includes(state.currency)) {
    select.value = state.currency;
  }

  renderWatchlist();
}

function renderWatchlist() {
  if (state.watchlist.length === 0) {
    watchUl.innerHTML = "<li>No currencies yet</li>";
    return;
  }

  watchUl.innerHTML = state.watchlist.map(c => {
    const r = state.rates[c] || "N/A";
    return `<li data-c="${c}">
      1 ETB = ${r} ${c}
      <button class="rm">×</button>
    </li>`;
  }).join("");
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const amt = Number(amountInput.value);

  if (!amt || amt <= 0) {
    resultEl.textContent = "Enter a valid amount.";
    return;
  }

  state.currency = select.value;
  save();

  const rate = state.rates[state.currency];
  const out = (amt * rate).toFixed(2);
  resultEl.textContent = `${amt} ETB = ${out} ${state.currency}`;
});

addBtn.addEventListener("click", () => {
  const c = select.value;
  if (!c || state.watchlist.includes(c)) return;

  state.watchlist.push(c);
  save();
  renderWatchlist();
});

watchUl.addEventListener("click", (e) => {
  if (!e.target.matches(".rm")) return;
  const c = e.target.closest("li").dataset.c;
  state.watchlist = state.watchlist.filter(x => x !== c);
  save();
  renderWatchlist();
});

async function init() {
  load();
  await loadRates();
  render();
}

init();