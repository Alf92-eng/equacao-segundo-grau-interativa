"use strict";

const math = window.MmcMdcMath;
const numberForm = document.querySelector("#number-form");
const numbersInput = document.querySelector("#numbers-input");
const labError = document.querySelector("#lab-error");
const mmcAnswer = document.querySelector("#mmc-answer");
const mdcAnswer = document.querySelector("#mdc-answer");
const mmcMeaning = document.querySelector("#mmc-meaning");
const mdcMeaning = document.querySelector("#mdc-meaning");
const factorTable = document.querySelector("#factor-table");
const factorizationText = document.querySelector("#factorization-text");
const stepsList = document.querySelector("#steps-list");
const practiceForm = document.querySelector("#practice-form");
const practiceInput = document.querySelector("#numeric-answer");
const practiceFeedback = document.querySelector("#practice-feedback");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const score = { correct: 0, attempts: 0 };
const exercises = [
  { topic: "Encontre um divisor comum", question: "Qual é o MDC de 24 e 36?", answer: 12n, hint: "Procure o maior fator que divide 24 e 36 sem deixar resto." },
  { topic: "Encontre um múltiplo comum", question: "Qual é o MMC de 8 e 12?", answer: 24n, hint: "Escreva os múltiplos de 8 e 12; o primeiro que aparece nas duas listas é o MMC." },
  { topic: "Compare três números", question: "Qual é o MDC de 15, 25 e 35?", answer: 5n, hint: "Fatore os três números e encontre os primos que aparecem em todos." },
  { topic: "Encontre o primeiro encontro", question: "Qual é o MMC de 6, 10 e 15?", answer: 30n, hint: "Inclua os fatores primos necessários para que 30 seja divisível por 6, 10 e 15." }
];
const superscripts = new Map([[0, "⁰"], [1, "¹"], [2, "²"], [3, "³"], [4, "⁴"], [5, "⁵"], [6, "⁶"], [7, "⁷"], [8, "⁸"], [9, "⁹"]]);
let currentExercise = 0;

function formatInteger(value) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function factorText(factors) {
  if (factors.size === 0) return "1";
  return [...factors].map(([prime, exponent]) => `${prime}${exponent === 1 ? "" : (superscripts.get(exponent) || `^${exponent}`)}`).join(" × ");
}

function formatFactorization(value, factors) {
  return `${formatInteger(value)} = ${factorText(factors)}`;
}

function addTextCell(row, text, tag = "td") {
  const cell = document.createElement(tag);
  cell.textContent = text;
  row.append(cell);
}

function renderFactorTable(result) {
  const headRow = document.createElement("tr");
  addTextCell(headRow, "Primo", "th");
  headRow.cells[0].scope = "col";
  result.values.forEach((value) => {
    const heading = document.createElement("th");
    heading.scope = "col";
    heading.textContent = formatInteger(value);
    headRow.append(heading);
  });
  for (const label of ["Menor", "Maior"]) {
    const heading = document.createElement("th");
    heading.scope = "col";
    heading.textContent = label;
    headRow.append(heading);
  }

  const body = document.createElement("tbody");
  result.primes.forEach((prime, primeIndex) => {
    const row = document.createElement("tr");
    const primeHeading = document.createElement("th");
    primeHeading.scope = "row";
    primeHeading.textContent = String(prime);
    row.append(primeHeading);
    result.exponents[primeIndex].forEach((exponent) => addTextCell(row, String(exponent)));
    addTextCell(row, String(result.minimumExponents[primeIndex]));
    addTextCell(row, String(result.maximumExponents[primeIndex]));
    body.append(row);
  });

  const head = document.createElement("thead");
  head.append(headRow);
  const caption = document.createElement("caption");
  caption.textContent = "Expoentes dos fatores primos dos números informados";
  factorTable.replaceChildren(caption, head, body);
}

function makeStep(titleText, mathText, explanationText, index) {
  const details = document.createElement("details");
  details.className = "step-card";
  details.open = index === 0;
  const summary = document.createElement("summary");
  const number = document.createElement("span");
  number.className = "step-number";
  number.textContent = String(index + 1);
  const title = document.createElement("span");
  title.textContent = titleText;
  summary.append(number, title);
  const content = document.createElement("div");
  content.className = "step-content";
  const calculation = document.createElement("p");
  calculation.className = "step-math";
  calculation.textContent = mathText;
  const explanation = document.createElement("p");
  explanation.textContent = explanationText;
  content.append(calculation, explanation);
  details.append(summary, content);
  return details;
}

function renderSteps(result) {
  const steps = result.values.map((value, index) => makeStep(
    `Fatore ${formatInteger(value)}`,
    formatFactorization(value, result.factorizations[index]),
    "Continue dividindo por números primos até que todos os fatores sejam primos.",
    index
  ));
  const offset = steps.length;
  const commonFactors = result.primes
    .map((prime, index) => result.minimumExponents[index] > 0
      ? `${prime}${result.minimumExponents[index] === 1 ? "" : `^${result.minimumExponents[index]}`}`
      : "")
    .filter(Boolean)
    .join(" × ") || "1";
  const allFactors = result.primes
    .map((prime, index) => `${prime}${result.maximumExponents[index] === 1 ? "" : `^${result.maximumExponents[index]}`}`)
    .join(" × ") || "1";
  steps.push(makeStep(
    "Encontre o MDC pelos menores expoentes",
    `MDC = ${commonFactors} = ${formatInteger(result.mdc)}`,
    "Use somente os fatores que aparecem em todas as fatorações, cada um com o menor expoente.",
    offset
  ));
  steps.push(makeStep(
    "Encontre o MMC pelos maiores expoentes",
    `MMC = ${allFactors} = ${formatInteger(result.mmc)}`,
    "Use todos os fatores primos que aparecem, cada um com o maior expoente.",
    offset + 1
  ));
  if (result.values.length === 2) {
    steps.push(makeStep(
      "Confira a relação entre os resultados",
      `${result.mdc} × ${result.mmc} = ${formatInteger(BigInt(result.values[0]) * BigInt(result.values[1]))}`,
      "Para dois números inteiros positivos, o produto do MDC pelo MMC é igual ao produto dos números.",
      offset + 2
    ));
  }
  stepsList.replaceChildren(...steps);
}

function resetResults(message) {
  mmcAnswer.textContent = "—";
  mdcAnswer.textContent = "—";
  mmcMeaning.textContent = message;
  mdcMeaning.textContent = message;
  factorTable.replaceChildren();
  factorizationText.textContent = "A fatoração aparecerá quando os números forem válidos.";
  stepsList.replaceChildren();
}

function updateCalculation() {
  labError.hidden = true;
  labError.textContent = "";
  try {
    const values = math.parseValues(numbersInput.value);
    const result = math.calculate(values);
    mmcAnswer.textContent = formatInteger(result.mmc);
    mdcAnswer.textContent = formatInteger(result.mdc);
    mmcMeaning.textContent = `${formatInteger(result.mmc)} é o menor múltiplo positivo comum aos números.`;
    mdcMeaning.textContent = `${formatInteger(result.mdc)} é o maior divisor comum aos números.`;
    renderFactorTable(result);
    factorizationText.textContent = result.values.map((value, index) => formatFactorization(value, result.factorizations[index])).join(" · ");
    renderSteps(result);
  } catch (error) {
    if (!(error instanceof math.InputError)) throw error;
    labError.textContent = error.message;
    labError.hidden = false;
    resetResults("Corrija os números para ver este resultado.");
  }
}

function applyPreset(name) {
  const presets = {
    coincidence: "4, 6",
    sharing: "12, 18",
    three: "12, 18, 24",
    one: "1, 7, 11"
  };
  if (!Object.hasOwn(presets, name)) throw new Error(`Exemplo desconhecido: ${name}`);
  numbersInput.value = presets[name];
  updateCalculation();
  numbersInput.focus();
}

function renderExercise() {
  const exercise = exercises[currentExercise];
  document.querySelector("#question-count").textContent = `QUESTÃO ${currentExercise + 1} DE ${exercises.length}`;
  document.querySelector("#question-topic").textContent = exercise.topic;
  document.querySelector("#question-expression").textContent = exercise.question;
  practiceInput.value = "";
  practiceInput.removeAttribute("aria-invalid");
  practiceFeedback.hidden = true;
  practiceFeedback.textContent = "";
  practiceFeedback.classList.remove("is-error");
}

function renderScore() {
  document.querySelector("#correct-count").textContent = String(score.correct);
  document.querySelector("#attempt-count").textContent = String(score.attempts);
}

function parsePracticeAnswer(raw) {
  const value = raw.trim();
  if (!/^\d+$/.test(value)) return null;
  return BigInt(value);
}

numberForm.addEventListener("input", updateCalculation);
document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
});
document.querySelector("#next-step").addEventListener("click", () => {
  const details = [...stepsList.querySelectorAll("details")];
  const next = details.findIndex((item) => !item.open);
  if (next === -1) {
    details[0]?.scrollIntoView({ block: "nearest", behavior: reduceMotion.matches ? "auto" : "smooth" });
  } else {
    details[next].open = true;
    details[next].querySelector("summary").focus();
  }
});
document.querySelector("#new-question").addEventListener("click", () => {
  currentExercise = (currentExercise + 1) % exercises.length;
  renderExercise();
});
document.querySelector("#clear-answer").addEventListener("click", () => {
  practiceInput.value = "";
  practiceFeedback.hidden = true;
  practiceFeedback.textContent = "";
  practiceFeedback.classList.remove("is-error");
  practiceInput.removeAttribute("aria-invalid");
  practiceInput.focus();
});
practiceForm.addEventListener("input", () => {
  practiceInput.removeAttribute("aria-invalid");
  practiceFeedback.hidden = true;
  practiceFeedback.textContent = "";
  practiceFeedback.classList.remove("is-error");
});
practiceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const entered = parsePracticeAnswer(practiceInput.value);
  if (entered === null) {
    practiceFeedback.textContent = "Digite um número inteiro positivo para conferir sua resposta.";
    practiceFeedback.classList.add("is-error");
    practiceFeedback.hidden = false;
    practiceInput.setAttribute("aria-invalid", "true");
    practiceInput.focus();
    return;
  }
  practiceInput.removeAttribute("aria-invalid");
  score.attempts += 1;
  const exercise = exercises[currentExercise];
  if (entered === exercise.answer) {
    score.correct += 1;
    practiceFeedback.textContent = "Correto! Você identificou se a pergunta pedia um múltiplo ou um divisor comum.";
    practiceFeedback.classList.remove("is-error");
  } else {
    practiceFeedback.textContent = `Ainda não. Pista: ${exercise.hint}`;
    practiceFeedback.classList.add("is-error");
  }
  practiceFeedback.hidden = false;
  renderScore();
});

window.addEventListener("pagehide", () => {
  score.correct = 0;
  score.attempts = 0;
  renderScore();
  renderExercise();
});

renderExercise();
renderScore();
updateCalculation();
