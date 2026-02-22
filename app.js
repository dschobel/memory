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
const matchGoalNode = document.getElementById("match-goal");
const movesNode = document.getElementById("moves");
const resetButton = document.getElementById("reset");
const openSettingsButton = document.getElementById("open-settings");
const settingsModal = document.getElementById("settings-modal");
const settingsForm = document.getElementById("settings-form");
const cardCountInput = document.getElementById("card-count");
const cancelSettingsButton = document.getElementById("cancel-settings");
const victoryModal = document.getElementById("victory-modal");
const victorySprite = document.getElementById("victory-sprite");
const closeVictoryButton = document.getElementById("close-victory");
const matchedList = document.getElementById("matched-list");
const matchedEmptyNode = document.getElementById("matched-empty");

const minTotalCards = 4;
const maxTotalCards = unicornAssets.length * 2;

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let pendingTimers = [];
let pairCount = unicornAssets.length;

cardCountInput.min = String(minTotalCards);
cardCountInput.max = String(maxTotalCards);
cardCountInput.step = "2";

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

function setMatchGoal() {
  matchGoalNode.textContent = String(pairCount);
}

function refreshMatchedPanel() {
  const total = matchedList.childElementCount;
  matchedEmptyNode.hidden = total > 0;
  matchedList.setAttribute(
    "aria-label",
    `Successful matches: ${total} of ${pairCount}`
  );
}

function addMatchedPreview(asset, matchNumber) {
  const preview = document.createElement("div");
  preview.className = "matched-token";

  const img = document.createElement("img");
  img.src = asset;
  img.alt = `Matched unicorn ${matchNumber}`;
  img.loading = "lazy";
  img.decoding = "async";

  preview.appendChild(img);
  matchedList.appendChild(preview);
  refreshMatchedPanel();
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
  const matchedAsset = first.dataset.asset;
  lockBoard = true;
  matches += 1;
  setStats();
  addMatchedPreview(matchedAsset, matches);

  first.classList.add("matched");
  second.classList.add("matched");

  schedule(() => {
    first.classList.add("cleared");
    second.classList.add("cleared");
    first.disabled = true;
    second.disabled = true;
    resetSelection();

    if (matches === pairCount) {
      board.setAttribute("aria-label", "You found every unicorn pair!");
      playVictoryAnimation();
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

function normalizeTotalCards(value) {
  let total = Number.parseInt(value, 10);
  if (Number.isNaN(total)) {
    total = pairCount * 2;
  }

  total = Math.max(minTotalCards, Math.min(maxTotalCards, total));
  if (total % 2 !== 0) {
    total -= 1;
  }

  return total;
}

function openSettingsModal() {
  cardCountInput.value = String(pairCount * 2);
  if (typeof settingsModal.showModal === "function") {
    settingsModal.showModal();
    return;
  }

  settingsModal.setAttribute("open", "");
}

function closeSettingsModal() {
  if (typeof settingsModal.close === "function") {
    settingsModal.close();
    return;
  }

  settingsModal.removeAttribute("open");
}

function openVictoryModal() {
  if (typeof victoryModal.showModal === "function") {
    if (!victoryModal.open) {
      victoryModal.showModal();
    }
    return;
  }

  victoryModal.setAttribute("open", "");
}

function stopVictoryAnimation() {
  victorySprite.classList.remove("is-animating");
}

function closeVictoryModal() {
  if (typeof victoryModal.close === "function") {
    if (victoryModal.open) {
      victoryModal.close();
    }
  } else {
    victoryModal.removeAttribute("open");
  }

  stopVictoryAnimation();
}

function playVictoryAnimation() {
  openVictoryModal();
  stopVictoryAnimation();
  void victorySprite.offsetWidth;
  victorySprite.classList.add("is-animating");
}

function newGame() {
  clearPendingTimers();
  closeVictoryModal();
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matches = 0;
  moves = 0;
  setMatchGoal();
  setStats();
  matchedList.replaceChildren();
  refreshMatchedPanel();

  const selectedAssets = shuffle(unicornAssets).slice(0, pairCount);
  const deck = shuffle(
    selectedAssets.flatMap((asset, index) => [
      { asset, key: index },
      { asset, key: index }
    ])
  );

  board.replaceChildren(
    ...deck.map((card, idx) => {
      const button = buildCard(card.asset, card.key, idx);
      button.dataset.asset = card.asset;
      return button;
    })
  );

  board.setAttribute("aria-label", `Memory board with ${deck.length} cards`);
}

resetButton.addEventListener("click", newGame);
openSettingsButton.addEventListener("click", openSettingsModal);
cancelSettingsButton.addEventListener("click", closeSettingsModal);
closeVictoryButton.addEventListener("click", closeVictoryModal);
victoryModal.addEventListener("close", stopVictoryAnimation);
settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const totalCards = normalizeTotalCards(cardCountInput.value);
  pairCount = totalCards / 2;
  cardCountInput.value = String(totalCards);
  closeSettingsModal();
  newGame();
});

newGame();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // The game still works even if service worker registration fails.
    });
  });
}
