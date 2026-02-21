const unicornAssets = [
  "assets/unicorns/unicorn-01.svg",
  "assets/unicorns/unicorn-02.svg",
  "assets/unicorns/unicorn-03.svg",
  "assets/unicorns/unicorn-04.svg",
  "assets/unicorns/unicorn-05.svg",
  "assets/unicorns/unicorn-06.svg",
  "assets/unicorns/unicorn-07.svg",
  "assets/unicorns/unicorn-08.svg",
  "assets/unicorns/unicorn-09.svg",
  "assets/unicorns/unicorn-10.svg"
];

const board = document.getElementById("board");
const matchesNode = document.getElementById("matches");
const movesNode = document.getElementById("moves");
const resetButton = document.getElementById("reset");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let pendingTimers = [];

function schedule(fn, delay) {
  const id = window.setTimeout(() => {
    pendingTimers = pendingTimers.filter((timerId) => timerId !== id);
    fn();
  }, delay);
  pendingTimers.push(id);
}

function clearPendingTimers() {
  pendingTimers.forEach((id) => window.clearTimeout(id));
  pendingTimers = [];
}

function shuffle(items) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function setStats() {
  matchesNode.textContent = String(matches);
  movesNode.textContent = String(moves);
}

function buildCard(asset, key, idx) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "card";
  button.dataset.key = String(key);
  button.setAttribute("aria-label", `Memory card ${idx + 1}`);

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const back = document.createElement("div");
  back.className = "face back";
  back.setAttribute("aria-hidden", "true");

  const front = document.createElement("div");
  front.className = "face front";
  front.setAttribute("aria-hidden", "true");

  const img = document.createElement("img");
  img.src = asset;
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";

  front.appendChild(img);
  inner.append(back, front);
  button.appendChild(inner);

  button.addEventListener("click", () => onCardClick(button));
  return button;
}

function resetSelection() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function unflipPair() {
  const first = firstCard;
  const second = secondCard;
  lockBoard = true;
  schedule(() => {
    first.classList.remove("flipped");
    second.classList.remove("flipped");
    resetSelection();
  }, 520);
}

function removePair() {
  const first = firstCard;
  const second = secondCard;
  lockBoard = true;
  matches += 1;
  setStats();

  first.classList.add("matched");
  second.classList.add("matched");

  schedule(() => {
    first.remove();
    second.remove();
    resetSelection();

    if (matches === unicornAssets.length) {
      board.setAttribute("aria-label", "You found every unicorn pair!");
    }
  }, 430);
}

function onCardClick(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) {
    return;
  }

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves += 1;
  setStats();

  const isMatch = firstCard.dataset.key === secondCard.dataset.key;
  if (isMatch) {
    removePair();
    return;
  }

  unflipPair();
}

function newGame() {
  clearPendingTimers();
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matches = 0;
  moves = 0;
  setStats();

  const deck = shuffle(
    unicornAssets.flatMap((asset, index) => [
      { asset, key: index },
      { asset, key: index }
    ])
  );

  board.replaceChildren(
    ...deck.map((card, idx) => buildCard(card.asset, card.key, idx))
  );

  board.setAttribute("aria-label", "Memory board");
}

resetButton.addEventListener("click", newGame);
newGame();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // The game still works even if service worker registration fails.
    });
  });
}
