const menuItems = [
  "20F 일반식 (A. 한식)",
  "20F 일반식 (B. 일품)",
  "10F 공존 (도시락)",
  "10F 공존 (브런치)",
  "10F 공존 (샐러드)"
];

const rouletteWheel = document.getElementById("rouletteWheel");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("resultText");
const selectAllBtn = document.getElementById("selectAllBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const checkboxes = document.querySelectorAll(".menu-checkbox");

let currentRotation = 0;

function getSelectedMenus() {
  return Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function renderWheelLabels() {
  document.querySelectorAll(".roulette-label").forEach((label) => label.remove());

  const selectedMenus = getSelectedMenus();

  if (selectedMenus.length === 0) {
    rouletteWheel.style.background = "#eef7ff";
    return;
  }

  const segmentAngle = 360 / selectedMenus.length;
  const colors = ["#4aa8ff", "#8ed0ff", "#b6e0ff", "#7ec3ff", "#d7efff"];

  const gradientParts = selectedMenus.map((_, index) => {
    const start = index * segmentAngle;
    const end = (index + 1) * segmentAngle;
    return `${colors[index % colors.length]} ${start}deg ${end}deg`;
  });

  rouletteWheel.style.background = `conic-gradient(${gradientParts.join(", ")})`;

  selectedMenus.forEach((menu, index) => {
    const label = document.createElement("div");
    label.className = "roulette-label";
    label.textContent = menu;

    const angle = index * segmentAngle + segmentAngle / 2 - 90;
    const radius = 105;

    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    label.style.left = `calc(50% + ${x}px - 46px)`;
    label.style.top = `calc(50% + ${y}px - 20px)`;
    label.style.transform = `rotate(${angle + 90}deg)`;

    rouletteWheel.appendChild(label);
  });
}

function pickRandomMenu() {
  const selectedMenus = getSelectedMenus();

  if (selectedMenus.length === 0) {
    alert("최소 1개 이상 선택해주세요.");
    return null;
  }

  const randomIndex = Math.floor(Math.random() * selectedMenus.length);
  return {
    selectedMenus,
    winner: selectedMenus[randomIndex],
    winnerIndex: randomIndex
  };
}

function spinRoulette() {
  const result = pickRandomMenu();

  if (!result) return;

  const { selectedMenus, winner, winnerIndex } = result;
  const segmentAngle = 360 / selectedMenus.length;

  const winnerCenterAngle = winnerIndex * segmentAngle + segmentAngle / 2;

  const extraSpins = 360 * 5;
  const targetAngle = 360 - winnerCenterAngle;
  currentRotation += extraSpins + targetAngle;

  spinBtn.disabled = true;
  resultText.textContent = "룰렛 돌아가는 중...";

  rouletteWheel.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    resultText.textContent = winner;
    spinBtn.disabled = false;
  }, 4000);
}

spinBtn.addEventListener("click", spinRoulette);

selectAllBtn.addEventListener("click", () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
  renderWheelLabels();
  resultText.textContent = "아직 결과가 없습니다";
});

clearAllBtn.addEventListener("click", () => {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  renderWheelLabels();
  resultText.textContent = "아직 결과가 없습니다";
});

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    renderWheelLabels();
    resultText.textContent = "아직 결과가 없습니다";
  });
});

renderWheelLabels();