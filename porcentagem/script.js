"use strict";

const form = document.querySelector("#percent-form");
const modeInput = document.querySelector("#mode");
const directionInput = document.querySelector("#direction-input");
const answer = document.querySelector("#answer");
const expression = document.querySelector("#expression");
const transformation = document.querySelector("#transformation");
const answerMeaning = document.querySelector("#answer-meaning");
const labError = document.querySelector("#lab-error");
const stepsList = document.querySelector("#steps-list");
const percentBar = document.querySelector("#percent-bar");
const barPercent = document.querySelector("#bar-percent");
const visualTitle = document.querySelector("#visual-title");
const visualDescription = document.querySelector("#visual-description");
const nextStepButton = document.querySelector("#next-step");
const practiceForm = document.querySelector("#practice-form");
const practiceInput = document.querySelector("#numeric-answer");
const practiceFeedback = document.querySelector("#practice-feedback");
const storageNote = document.querySelector("#storage-note");
const score = { correct: 0, attempts: 0 };
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const EXERCISES = [
  { topic: "Calcule uma parte", question: "Quanto é 20% de 150?", answer: 30, hint: "Transforme 20% em 20 ÷ 100 e multiplique por 150." },
  { topic: "Encontre a taxa", question: "30 representa quantos por cento de 120?", answer: 25, hint: "Divida a parte, 30, pelo todo, 120. Depois multiplique por 100." },
  { topic: "Calcule uma redução", question: "Um valor de 200 foi reduzido em 15%. Qual é o novo valor?", answer: 170, hint: "Primeiro calcule 15% de 200; depois subtraia essa parte de 200." }
];

let currentExercise = 0;

class InputError extends Error {}

function readNumber(input, label, maximum = 1_000_000_000) {
  const raw = input.value.trim();
  const field = input.closest(".field");
  const error = field.querySelector(".field-error");
  input.removeAttribute("aria-invalid");
  error.textContent = "";
  if (!raw) {
    input.setAttribute("aria-invalid", "true");
    error.textContent = "Preencha este campo.";
    throw new InputError(`${label}: preencha este campo.`);
  }
  if (!/^[+]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(raw)) {
    input.setAttribute("aria-invalid", "true");
    error.textContent = "Use um número positivo, sem espaços ou separadores de milhar.";
    throw new InputError(`${label}: use um número positivo ou zero.`);
  }
  const value = Number(raw.replace(",", "."));
  if (!Number.isFinite(value) || value > maximum) {
    input.setAttribute("aria-invalid", "true");
    error.textContent = `O valor deve ser no máximo ${formatNumber(maximum)}.`;
    throw new InputError(`${label}: o valor informado está fora do limite.`);
  }
  return value;
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 4,
    useGrouping: true
  }).format(value);
}

function percentName(value) {
  return `${formatNumber(value)}%`;
}

function showSteps(steps) {
  stepsList.replaceChildren(...steps.map((step, index) => {
    const details = document.createElement("details");
    details.className = "step-card";
    details.open = index === 0;
    const summary = document.createElement("summary");
    const number = document.createElement("span");
    number.className = "step-number";
    number.textContent = String(index + 1);
    const title = document.createElement("span");
    title.textContent = step.title;
    summary.append(number, title);
    const content = document.createElement("div");
    content.className = "step-content";
    const math = document.createElement("p");
    math.className = "step-math";
    math.textContent = step.math;
    const explanation = document.createElement("p");
    explanation.textContent = step.explanation;
    content.append(math, explanation);
    details.append(summary, content);
    return details;
  }));
}

function updateVisual(rate, title, description) {
  const bounded = Math.max(0, Math.min(rate, 100));
  percentBar.style.width = `${bounded}%`;
  barPercent.textContent = percentName(rate);
  visualTitle.textContent = title;
  const extraGroups = rate > 100 ? ` Isso equivale a ${Math.floor(rate / 100)} todo(s) completo(s) e mais ${formatNumber(rate % 100)}%.` : "";
  visualDescription.textContent = `${description}${extraGroups}`;
  document.querySelector("#percent-visual").setAttribute("aria-label", `${percentName(rate)}: ${visualDescription.textContent}`);
}

function updateOf() {
  const percent = readNumber(document.querySelector("#percent-input"), "Porcentagem", 1000);
  const whole = readNumber(document.querySelector("#whole-input"), "Todo");
  const result = percent / 100 * whole;
  expression.textContent = `${percentName(percent)} de ${formatNumber(whole)}`;
  transformation.textContent = `${formatNumber(percent)} ÷ 100 × ${formatNumber(whole)}`;
  answer.textContent = formatNumber(result);
  answerMeaning.textContent = `${percentName(percent)} de ${formatNumber(whole)} é ${formatNumber(result)}.`;
  showSteps([
    { title: "Identifique a taxa e o todo", math: `${percentName(percent)} de ${formatNumber(whole)}`, explanation: "O valor de referência representa 100%; vamos encontrar a parte correspondente à taxa." },
    { title: "Escreva a porcentagem como fração de 100", math: `${formatNumber(percent)}% = ${formatNumber(percent)} ÷ 100 = ${formatNumber(percent / 100)}`, explanation: "Dividir por 100 transforma a taxa em um número decimal equivalente." },
    { title: "Multiplique pelo todo", math: `${formatNumber(percent / 100)} × ${formatNumber(whole)} = ${formatNumber(result)}`, explanation: `Portanto, ${percentName(percent)} de ${formatNumber(whole)} corresponde a ${formatNumber(result)}.` }
  ]);
  updateVisual(percent, "Parte do todo", `A parte corresponde a ${percentName(percent)} do valor de referência.`);
}

function updateWhat() {
  const part = readNumber(document.querySelector("#part-input"), "Parte");
  const whole = readNumber(document.querySelector("#whole-input"), "Todo");
  if (whole === 0) {
    document.querySelector("#whole-input").setAttribute("aria-invalid", "true");
    document.querySelector("#error-whole").textContent = "O todo precisa ser maior que zero para calcular a proporção.";
    throw new InputError("O todo precisa ser maior que zero.");
  }
  const rate = part / whole * 100;
  if (!Number.isFinite(rate)) {
    document.querySelector("#whole-input").setAttribute("aria-invalid", "true");
    document.querySelector("#error-whole").textContent = "Use um valor de referência menos extremo para calcular esta proporção.";
    throw new InputError("A proporção é grande demais para ser representada. Ajuste a parte ou o todo.");
  }
  expression.textContent = `${formatNumber(part)} de ${formatNumber(whole)}`;
  transformation.textContent = `${formatNumber(part)} ÷ ${formatNumber(whole)} × 100`;
  answer.textContent = percentName(rate);
  answerMeaning.textContent = `${formatNumber(part)} corresponde a ${percentName(rate)} de ${formatNumber(whole)}.`;
  showSteps([
    { title: "Identifique a parte e o todo", math: `Parte = ${formatNumber(part)} · Todo = ${formatNumber(whole)}`, explanation: "A proporção é a parte comparada com o todo, que deve ser diferente de zero." },
    { title: "Divida a parte pelo todo", math: `${formatNumber(part)} ÷ ${formatNumber(whole)} = ${formatNumber(part / whole)}`, explanation: "O quociente mostra que fração do todo a parte representa." },
    { title: "Converta a proporção em porcentagem", math: `${formatNumber(part / whole)} × 100 = ${percentName(rate)}`, explanation: `Assim, ${formatNumber(part)} representa ${percentName(rate)} de ${formatNumber(whole)}.` }
  ]);
  updateVisual(rate, "Parte em relação ao todo", `${formatNumber(part)} representa ${percentName(rate)} de ${formatNumber(whole)}.`);
}

function updateChange() {
  const percent = readNumber(document.querySelector("#percent-input"), "Porcentagem", 1000);
  const original = readNumber(document.querySelector("#original-input"), "Valor inicial");
  const increase = directionInput.value === "increase";
  const delta = percent / 100 * original;
  const result = increase ? original + delta : original - delta;
  const verb = increase ? "aumentou" : "foi reduzido";
  expression.textContent = `${formatNumber(original)} ${increase ? "+" : "−"} ${percentName(percent)}`;
  transformation.textContent = `${formatNumber(original)} ${increase ? "+" : "−"} (${formatNumber(percent)} ÷ 100 × ${formatNumber(original)})`;
  answer.textContent = formatNumber(result);
  answerMeaning.textContent = `Depois que o valor inicial ${verb} ${percentName(percent)}, o novo valor é ${formatNumber(result)}.`;
  showSteps([
    { title: "Encontre a variação", math: `${formatNumber(percent)} ÷ 100 × ${formatNumber(original)} = ${formatNumber(delta)}`, explanation: "O percentual é calculado sobre o valor inicial, que é o todo de referência." },
    { title: `${increase ? "Some" : "Subtraia"} a variação`, math: `${formatNumber(original)} ${increase ? "+" : "−"} ${formatNumber(delta)} = ${formatNumber(result)}`, explanation: increase ? "Em um aumento, acrescentamos a variação ao valor inicial." : "Em uma redução, retiramos a variação do valor inicial." },
    { title: "Interprete o resultado", math: `${formatNumber(original)} ${increase ? "+" : "−"} ${percentName(percent)} = ${formatNumber(result)}`, explanation: `O valor final após a ${increase ? "mudança" : "redução"} é ${formatNumber(result)}.` }
  ]);
  updateVisual(percent, increase ? "Taxa de aumento" : "Taxa de redução", `A mudança aplicada é de ${percentName(percent)} sobre o valor inicial.`);
}

function updateFields() {
  const mode = modeInput.value;
  document.querySelector('[data-field="part"]').hidden = mode !== "what";
  document.querySelector('[data-field="original"]').hidden = mode !== "change";
  document.querySelector('[data-field="direction"]').hidden = mode !== "change";
  document.querySelector('[data-field="percent"]').hidden = mode === "what";
  document.querySelector('[data-field="whole"]').hidden = mode === "change";
  document.querySelector("#percent-help").textContent = mode === "change"
    ? "Use um número de 0 a 1.000. Uma redução pode ultrapassar 100%."
    : "Use um número de 0 a 1.000.";
  updateCalculation();
}

function updateCalculation() {
  labError.hidden = true;
  labError.textContent = "";
  try {
    if (modeInput.value === "of") updateOf();
    else if (modeInput.value === "what") updateWhat();
    else if (modeInput.value === "change") updateChange();
    else throw new InputError("Escolha uma pergunta válida.");
  } catch (error) {
    if (!(error instanceof InputError)) throw error;
    labError.textContent = error.message;
    labError.hidden = false;
    answer.textContent = "—";
    answerMeaning.textContent = "Corrija o valor destacado para ver o resultado.";
    transformation.textContent = "Confira os campos";
    stepsList.replaceChildren();
    percentBar.style.width = "0%";
    visualDescription.textContent = "A representação aparecerá quando os valores forem válidos.";
  }
}

function applyPreset(name) {
  const presets = {
    discount: { mode: "of", percent: "25", whole: "80" },
    share: { mode: "what", part: "30", whole: "120" },
    increase: { mode: "change", percent: "10", original: "80", direction: "increase" },
    decrease: { mode: "change", percent: "15", original: "200", direction: "decrease" }
  };
  const preset = presets[name];
  if (!preset) throw new Error(`Exemplo desconhecido: ${name}`);
  modeInput.value = preset.mode;
  for (const [field, value] of Object.entries(preset)) {
    const input = document.querySelector(`[name="${field}"]`);
    if (input && field !== "mode") input.value = value;
  }
  updateFields();
}

function renderExercise() {
  const exercise = EXERCISES[currentExercise];
  document.querySelector("#question-count").textContent = `QUESTÃO ${currentExercise + 1} DE ${EXERCISES.length}`;
  document.querySelector("#question-topic").textContent = exercise.topic;
  document.querySelector("#question-expression").textContent = exercise.question;
  practiceInput.value = "";
  practiceFeedback.hidden = true;
  practiceFeedback.textContent = "";
  practiceFeedback.classList.remove("is-error");
}

function saveScore() {
  try {
    localStorage.setItem("matematica-porcentagem-score", JSON.stringify(score));
  } catch (error) {
    if (!(error instanceof DOMException)) throw error;
    storageNote.textContent = "O navegador bloqueou o armazenamento; a aula continua funcionando, mas a pontuação não será mantida depois que você sair.";
    storageNote.hidden = false;
  }
}

function loadScore() {
  try {
    const saved = localStorage.getItem("matematica-porcentagem-score");
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === "object" && Number.isInteger(parsed.correct) && parsed.correct >= 0 && Number.isInteger(parsed.attempts) && parsed.attempts >= parsed.correct) {
      score.correct = parsed.correct;
      score.attempts = parsed.attempts;
    } else {
      storageNote.textContent = "Não foi possível restaurar a pontuação salva; a aula continua funcionando com uma pontuação nova.";
      storageNote.hidden = false;
    }
  } catch (error) {
    if (!(error instanceof DOMException) && !(error instanceof SyntaxError)) throw error;
    storageNote.textContent = error instanceof SyntaxError
      ? "A pontuação salva não pôde ser lida; a aula continua funcionando com uma pontuação nova."
      : "O navegador bloqueou o armazenamento; a aula continua funcionando, mas a pontuação não será mantida depois que você sair.";
    storageNote.hidden = false;
  }
}

function renderScore() {
  document.querySelector("#correct-count").textContent = String(score.correct);
  document.querySelector("#attempt-count").textContent = String(score.attempts);
}

function parsePracticeAnswer(value) {
  const raw = value.trim();
  if (!/^[+]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(raw)) return null;
  const number = Number(raw.replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

modeInput.addEventListener("change", updateFields);
form.addEventListener("input", updateCalculation);
directionInput.addEventListener("change", updateCalculation);
document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
});
nextStepButton.addEventListener("click", () => {
  const details = [...stepsList.querySelectorAll("details")];
  const next = details.findIndex((item) => !item.open);
  if (next === -1) details[0]?.scrollIntoView({ block: "nearest", behavior: reduceMotion.matches ? "auto" : "smooth" });
  else {
    details[next].open = true;
    details[next].querySelector("summary").focus();
  }
});
document.querySelector("#new-question").addEventListener("click", () => {
  currentExercise = (currentExercise + 1) % EXERCISES.length;
  renderExercise();
});
document.querySelector("#clear-answer").addEventListener("click", () => {
  practiceInput.value = "";
  practiceFeedback.hidden = true;
  practiceFeedback.textContent = "";
  practiceFeedback.classList.remove("is-error");
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
  const exercise = EXERCISES[currentExercise];
  const entered = parsePracticeAnswer(practiceInput.value);
  if (entered === null) {
    practiceFeedback.textContent = "Digite um número válido para conferir sua resposta.";
    practiceFeedback.classList.add("is-error");
    practiceFeedback.hidden = false;
    practiceInput.setAttribute("aria-invalid", "true");
    practiceInput.focus();
    return;
  }
  practiceInput.removeAttribute("aria-invalid");
  score.attempts += 1;
  if (Math.abs(entered - exercise.answer) <= 0.0001 * Math.max(1, Math.abs(exercise.answer))) {
    score.correct += 1;
    practiceFeedback.textContent = "Correto! Você identificou a relação e encontrou o resultado.";
    practiceFeedback.classList.remove("is-error");
  } else {
    practiceFeedback.textContent = `Ainda não. Pista: ${exercise.hint}`;
    practiceFeedback.classList.add("is-error");
  }
  practiceFeedback.hidden = false;
  renderScore();
  saveScore();
});

document.querySelectorAll(".hero-grid, .teaching-grid").forEach((grid) => {
  grid.replaceChildren(...Array.from({ length: 100 }, (_, index) => {
    const cell = document.createElement("span");
    if (index < 50) cell.classList.add("is-filled");
    return cell;
  }));
});

loadScore();
renderScore();
renderExercise();
updateFields();
