"use strict";

const SETS = {
  N: { symbol: "ℕ", name: "naturais" },
  Z: { symbol: "ℤ", name: "inteiros" },
  Q: { symbol: "ℚ", name: "racionais" },
  I: { symbol: "𝕀", name: "irracionais" },
  R: { symbol: "ℝ", name: "reais" }
};

const EXAMPLES = {
  zero: {
    display: "0", approximate: 0, smallest: "N", memberships: ["N", "Z", "Q", "R"],
    reason: "O zero pertence aos naturais conforme a convenção desta aula. Também é inteiro e pode ser escrito como 0/1, então é racional e real.",
    steps: [
      ["Observe o número", "0", "O zero não é positivo nem negativo; nesta aula, ele foi incluído nos naturais."],
      ["Procure o conjunto mais específico", "0 ∈ ℕ", "Como 0 é natural, também é inteiro, racional (0 = 0/1) e real."],
      ["Conclua", "ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ", "O menor conjunto que contém 0 é ℕ. A convenção sobre o zero pode variar entre materiais."]
    ]
  },
  "negative-integer": {
    display: "−3", approximate: -3, smallest: "Z", memberships: ["Z", "Q", "R"],
    reason: "−3 não é natural nesta convenção, mas é inteiro. Também pode ser escrito como −3/1, portanto pertence aos racionais e aos reais.",
    steps: [
      ["Observe o sinal", "−3 < 0", "Números naturais desta aula não são negativos."],
      ["Identifique o conjunto", "−3 ∈ ℤ", "−3 é um número inteiro."],
      ["Amplie a classificação", "−3 = −3/1", "Todo inteiro é racional, e todo racional é real. O menor conjunto é ℤ."]
    ]
  },
  fraction: {
    display: "3/4", approximate: 0.75, smallest: "Q", memberships: ["Q", "R"],
    reason: "3/4 é a razão entre dois inteiros e o denominador é diferente de zero. Logo, é racional e real.",
    steps: [
      ["Confira a forma", "3/4", "O numerador e o denominador são inteiros, e 4 ≠ 0."],
      ["Aplique a definição", "3/4 ∈ ℚ", "Todo número que pode ser escrito como fração de inteiros é racional."],
      ["Conclua", "ℚ ⊂ ℝ", "Todo racional também é real. O menor conjunto é ℚ."]
    ]
  },
  "finite-decimal": {
    display: "0,125", approximate: 0.125, smallest: "Q", memberships: ["Q", "R"],
    reason: "O decimal termina e equivale a 125/1000 = 1/8. Portanto, é racional e real.",
    steps: [
      ["Observe a escrita decimal", "0,125", "A representação decimal tem um número finito de casas."],
      ["Escreva como fração", "0,125 = 125/1000 = 1/8", "O decimal finito pode ser transformado em fração de inteiros."],
      ["Conclua", "0,125 ∈ ℚ ⊂ ℝ", "O menor conjunto que contém o número é ℚ."]
    ]
  },
  "repeating-decimal": {
    display: "0,333…", approximate: 1 / 3, smallest: "Q", memberships: ["Q", "R"],
    reason: "O algarismo 3 se repete indefinidamente: 0,333… = 1/3. Um decimal periódico é racional.",
    steps: [
      ["Identifique o período", "0,333…", "O algarismo 3 se repete sem fim."],
      ["Relacione com uma fração", "0,333… = 1/3", "A dízima periódica pode ser escrita como razão de inteiros."],
      ["Conclua", "0,333… ∈ ℚ ⊂ ℝ", "O menor conjunto é ℚ."]
    ]
  },
  "sqrt-nine": {
    display: "√9", approximate: 3, smallest: "N", memberships: ["N", "Z", "Q", "R"],
    reason: "√9 = 3, pois 3 × 3 = 9. O resultado é natural nesta convenção e, por inclusão, também pertence aos outros conjuntos indicados.",
    steps: [
      ["Calcule a raiz exata", "√9 = 3", "A raiz quadrada de 9 é o número não negativo cujo quadrado é 9."],
      ["Classifique o resultado", "3 ∈ ℕ", "3 é natural e, portanto, também é inteiro, racional e real."],
      ["Conclua", "√9 ∈ ℕ", "A raiz de um quadrado perfeito pode ser natural. O menor conjunto é ℕ."]
    ]
  },
  "sqrt-two": {
    display: "√2", approximate: Math.sqrt(2), smallest: "I", memberships: ["I", "R"],
    reason: "√2 não pode ser escrito como fração de inteiros. Sua expansão decimal é infinita e não periódica; assim, é irracional e real.",
    steps: [
      ["Observe a raiz", "√2 ≈ 1,4142…", "2 não é um quadrado perfeito, então a raiz não é inteira."],
      ["Identifique a representação", "√2 ∉ ℚ", "√2 é irracional: não existe fração de inteiros que seja exatamente igual a ele."],
      ["Conclua", "√2 ∈ 𝕀 ⊂ ℝ", "O menor conjunto indicado é 𝕀. A aproximação decimal não é o valor exato."]
    ]
  },
  pi: {
    display: "π", approximate: Math.PI, smallest: "I", memberships: ["I", "R"],
    reason: "π é irracional: sua expansão decimal é infinita e não periódica. A forma decimal mostrada na reta é apenas aproximada.",
    steps: [
      ["Reconheça a constante", "π ≈ 3,1416…", "π representa exatamente a razão entre o comprimento e o diâmetro de qualquer circunferência."],
      ["Classifique", "π ∉ ℚ", "π não pode ser escrito como uma fração exata de inteiros; é irracional."],
      ["Conclua", "π ∈ 𝕀 ⊂ ℝ", "O menor conjunto indicado é 𝕀. A posição na reta usa uma aproximação."]
    ]
  },
  "sqrt-three": {
    display: "√3", approximate: Math.sqrt(3), smallest: "I", memberships: ["I", "R"],
    reason: "3 não é quadrado perfeito, e √3 é irracional: não pode ser escrito como fração de inteiros.",
    steps: [
      ["Observe o radicando", "3", "Não existe inteiro cujo quadrado seja 3."],
      ["Classifique a raiz", "√3 ∉ ℚ", "√3 é irracional, com expansão decimal infinita e não periódica."],
      ["Conclua", "√3 ∈ 𝕀 ⊂ ℝ", "O menor conjunto indicado é 𝕀."]
    ]
  }
};

const EXERCISES = [
  { expression: "8", smallest: "N", hint: "8 é um número inteiro positivo; verifique se ele também é natural." },
  { expression: "−5", smallest: "Z", hint: "O sinal negativo impede que seja natural, mas ele não tem parte decimal." },
  { expression: "2/7", smallest: "Q", hint: "Uma fração de inteiros com denominador diferente de zero é racional." },
  { expression: "√5", smallest: "I", hint: "5 não é quadrado perfeito; √5 não pode ser escrito como fração de inteiros." },
  { expression: "1,2", smallest: "Q", hint: "O decimal termina: 1,2 = 12/10 = 6/5." }
];

const exampleSelect = document.querySelector("#example-select");
const selectedNumber = document.querySelector("#selected-number");
const smallestSet = document.querySelector("#smallest-set");
const membershipChips = document.querySelector("#membership-chips");
const numberReason = document.querySelector("#number-reason");
const membershipForm = document.querySelector("#membership-form");
const setSelect = document.querySelector("#set-select");
const membershipFeedback = document.querySelector("#membership-feedback");
const stepsList = document.querySelector("#steps-list");
const nextStepButton = document.querySelector("#next-step");
const numberMarker = document.querySelector("#number-marker");
const numberLine = document.querySelector("#number-line");
const lineDescription = document.querySelector("#line-description");
const practiceForm = document.querySelector("#practice-form");
const practiceInput = document.querySelector("#numeric-answer");
const practiceFeedback = document.querySelector("#practice-feedback");
const storageNote = document.querySelector("#storage-note");
const score = { correct: 0, attempts: 0 };
let currentStep = 0;
let currentExercise = 0;

function classifyExample(id) {
  const example = EXAMPLES[id];
  if (!example) throw new RangeError(`Exemplo numérico desconhecido: ${id}`);
  return example;
}

function showSteps(steps) {
  stepsList.replaceChildren(...steps.map(([title, math, explanation], index) => {
    const details = document.createElement("details");
    details.className = "step-card";
    details.open = index === 0;
    const summary = document.createElement("summary");
    const number = document.createElement("span");
    number.className = "step-number";
    number.textContent = String(index + 1);
    const label = document.createElement("span");
    label.textContent = title;
    summary.append(number, label);
    const content = document.createElement("div");
    content.className = "step-content";
    const formula = document.createElement("p");
    formula.className = "step-math";
    formula.textContent = math;
    const note = document.createElement("p");
    note.textContent = explanation;
    content.append(formula, note);
    details.append(summary, content);
    return details;
  }));
  currentStep = 0;
}

function updateExample(id) {
  const example = classifyExample(id);
  const smallest = SETS[example.smallest];
  selectedNumber.textContent = example.display;
  smallestSet.textContent = `O menor conjunto é ${smallest.symbol} (${smallest.name}).`;
  numberReason.textContent = example.reason;
  membershipChips.replaceChildren(...example.memberships.map((set) => {
    const chip = document.createElement("span");
    chip.textContent = `${SETS[set].symbol} ${SETS[set].name}`;
    if (set === example.smallest) chip.classList.add("is-smallest");
    return chip;
  }));
  showSteps(example.steps);
  const bounded = Math.max(-4, Math.min(4, example.approximate));
  const position = (bounded + 4) / 8 * 100;
  numberMarker.style.left = `${position}%`;
  const approximation = example.smallest === "I" ? `aproximadamente ${formatDecimal(example.approximate)}` : formatDecimal(example.approximate);
  lineDescription.textContent = `${example.display} está em ${approximation} na reta de −4 a 4.${bounded !== example.approximate ? " A posição foi limitada ao intervalo desenhado." : ""}`;
  numberLine.setAttribute("aria-label", `Reta numérica de menos quatro a quatro; ${example.display} está em ${approximation}.`);
  membershipFeedback.textContent = "Escolha um conjunto e confira sua ideia.";
  membershipFeedback.classList.remove("is-error");
}

function formatDecimal(value) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 4 }).format(value);
}

function checkMembership(exampleId, set) {
  const example = classifyExample(exampleId);
  if (!Object.hasOwn(SETS, set)) throw new RangeError(`Conjunto numérico desconhecido: ${set}`);
  return example.memberships.includes(set);
}

function answerMembership() {
  const example = classifyExample(exampleSelect.value);
  const set = setSelect.value;
  const belongs = checkMembership(exampleSelect.value, set);
  membershipFeedback.classList.toggle("is-error", !belongs);
  membershipFeedback.textContent = belongs
    ? `Isso mesmo! ${example.display} pertence a ${SETS[set].symbol} (${SETS[set].name}).`
    : `Ainda não. ${example.display} não pertence a ${SETS[set].symbol} (${SETS[set].name}). ${example.reason}`;
}

function renderExercise() {
  const exercise = EXERCISES[currentExercise];
  document.querySelector("#question-count").textContent = `QUESTÃO ${currentExercise + 1} DE ${EXERCISES.length}`;
  document.querySelector("#question-expression").textContent = `Qual é o menor conjunto que contém ${exercise.expression}?`;
  practiceInput.value = "";
  practiceInput.removeAttribute("aria-invalid");
  practiceFeedback.hidden = true;
  practiceFeedback.textContent = "";
  practiceFeedback.classList.remove("is-error");
}

function saveScore() {
  try {
    localStorage.setItem("matematica-conjuntos-numericos-score", JSON.stringify(score));
  } catch (error) {
    if (!(error instanceof DOMException)) throw error;
    storageNote.textContent = "O navegador bloqueou o armazenamento; a aula continua funcionando, mas a pontuação não será mantida depois que você sair.";
    storageNote.hidden = false;
  }
}

function loadScore() {
  try {
    const saved = localStorage.getItem("matematica-conjuntos-numericos-score");
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === "object" && Number.isInteger(parsed.correct) && parsed.correct >= 0 && Number.isInteger(parsed.attempts) && parsed.attempts >= parsed.correct) {
      score.correct = parsed.correct;
      score.attempts = parsed.attempts;
    } else {
      storageNote.textContent = "A pontuação salva não pôde ser restaurada; a aula continua funcionando com uma pontuação nova.";
      storageNote.hidden = false;
    }
  } catch (error) {
    if (!(error instanceof DOMException) && !(error instanceof SyntaxError)) throw error;
    storageNote.textContent = "O navegador bloqueou a leitura da pontuação salva; a aula continua funcionando sem ela.";
    storageNote.hidden = false;
  }
}

function renderScore() {
  document.querySelector("#correct-count").textContent = String(score.correct);
  document.querySelector("#attempt-count").textContent = String(score.attempts);
}

function normalizeSetAnswer(value) {
  const normalized = value.trim().toLocaleUpperCase("pt-BR").replaceAll("ℕ", "N").replaceAll("ℤ", "Z").replaceAll("ℚ", "Q").replaceAll("𝕀", "I");
  const fullNames = { NATURAIS: "N", INTEIROS: "Z", RACIONAIS: "Q", IRRACIONAIS: "I" };
  return fullNames[normalized] || normalized;
}

if (exampleSelect) {
  exampleSelect.addEventListener("change", () => updateExample(exampleSelect.value));
  membershipForm.addEventListener("submit", (event) => {
    event.preventDefault();
    answerMembership();
  });
  document.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      exampleSelect.value = button.dataset.example;
      updateExample(exampleSelect.value);
    });
  });
  nextStepButton.addEventListener("click", () => {
    const cards = [...stepsList.querySelectorAll(".step-card")];
    if (!cards.length) return;
    cards.forEach((card) => { card.open = false; });
    currentStep = (currentStep + 1) % cards.length;
    cards[currentStep].open = true;
    cards[currentStep].querySelector("summary").focus();
  });
  practiceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = normalizeSetAnswer(practiceInput.value);
    const exercise = EXERCISES[currentExercise];
    score.attempts++;
    practiceInput.removeAttribute("aria-invalid");
    if (answer === exercise.smallest) {
      score.correct++;
      practiceFeedback.classList.remove("is-error");
      practiceFeedback.textContent = `Correto! ${exercise.expression} pertence ao menor conjunto ${SETS[exercise.smallest].symbol}.`;
    } else if (["N", "Z", "Q", "I"].includes(answer)) {
      practiceInput.setAttribute("aria-invalid", "true");
      practiceFeedback.classList.add("is-error");
      practiceFeedback.textContent = `Quase! ${exercise.hint}`;
    } else {
      practiceInput.setAttribute("aria-invalid", "true");
      practiceFeedback.classList.add("is-error");
      practiceFeedback.textContent = "Digite N, Z, Q ou I para indicar o menor conjunto. ℝ não é resposta mínima nestes exemplos.";
    }
    practiceFeedback.hidden = false;
    renderScore();
    saveScore();
  });
  document.querySelector("#new-question").addEventListener("click", () => {
    currentExercise = (currentExercise + 1) % EXERCISES.length;
    renderExercise();
  });
  document.querySelector("#clear-answer").addEventListener("click", () => {
    practiceInput.value = "";
    practiceInput.removeAttribute("aria-invalid");
    practiceFeedback.hidden = true;
    practiceFeedback.textContent = "";
    practiceFeedback.classList.remove("is-error");
    practiceInput.focus();
  });

  loadScore();
  renderScore();
  renderExercise();
  updateExample(exampleSelect.value);
}
