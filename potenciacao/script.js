"use strict";

const MODE_FIELDS = {
  simples: ["a", "m"],
  multiplicar: ["a", "m", "n"],
  dividir: ["a", "m", "n"],
  potencia: ["a", "m", "n"],
  produto: ["a", "b", "n"],
  quociente: ["a", "b", "n"]
};

const PRESETS = {
  "produto-base": { mode: "multiplicar", a: 2, m: 3, n: 2 },
  "divisao-base": { mode: "dividir", a: 2, m: 3, n: 2 },
  zero: { mode: "simples", a: 7, m: 0 },
  negativo: { mode: "simples", a: -2, m: 3 },
  inverso: { mode: "simples", a: 2, m: -2 },
  multiplicar: { mode: "multiplicar", a: 2, m: 3, n: 2 },
  dividir: { mode: "dividir", a: 2, m: 3, n: 2 },
  potencia: { mode: "potencia", a: 2, m: 3, n: 2 },
  produto: { mode: "produto", a: 2, b: 4, n: 2 },
  quociente: { mode: "quociente", a: 4, b: 2, n: 2 }
};

class MathDomainError extends Error {
  constructor(message, field = null) {
    super(message);
    this.field = field;
  }
}

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a || 1n;
}

function rational(num, den = 1n) {
  if (den === 0n) throw new MathDomainError("Não é possível dividir por zero.", "b");
  if (den < 0n) { num = -num; den = -den; }
  const divisor = gcd(num, den);
  return { num: num / divisor, den: den / divisor };
}

function multiply(x, y) { return rational(x.num * y.num, x.den * y.den); }
function divide(x, y) {
  if (y.num === 0n) throw new MathDomainError("O divisor vale zero. Escolha uma base diferente de zero.", "a");
  return rational(x.num * y.den, x.den * y.num);
}
function power(x, exponent, field = "a") {
  if (x.num === 0n && exponent === 0) throw new MathDomainError("0⁰ não é definido nesta aula. Mude a base ou o expoente.", field);
  if (x.num === 0n && exponent < 0) throw new MathDomainError("Zero com expoente negativo exigiria dividir por zero. Mude a base ou o expoente.", field);
  const count = BigInt(Math.abs(exponent));
  return exponent >= 0 ? rational(x.num ** count, x.den ** count) : rational(x.den ** count, x.num ** count);
}

function signed(value) { return String(value).replace("-", "−"); }
function bigText(value) { return new Intl.NumberFormat("pt-BR").format(value).replace("-", "−"); }
function rationalText(value) {
  return value.den === 1n ? bigText(value.num) : `${bigText(value.num)}/${bigText(value.den)}`;
}
function baseText(value) { return value < 0 ? `(${signed(value)})` : signed(value); }
function powerHTML(base, exponent) { return `${baseText(base)}<sup>${signed(exponent)}</sup>`; }
function pairHTML(a, b, symbol, exponent) { return `(${signed(a)} ${symbol} ${signed(b)})<sup>${signed(exponent)}</sup>`; }

function integerInput(value, field) {
  const raw = String(value ?? "").trim();
  const label = field === "a" || field === "b" ? `Base ${field}` : `Expoente ${field}`;
  if (!raw) throw new MathDomainError(`${label}: preencha este campo.`, field);
  if (!/^[+-]?\d+$/.test(raw)) throw new MathDomainError(`${label}: use um número inteiro, sem vírgula ou ponto decimal.`, field);
  const number = Number(raw);
  const limit = field === "a" || field === "b" ? 9 : 6;
  if (!Number.isSafeInteger(number) || Math.abs(number) > limit) throw new MathDomainError(`${label}: escolha um inteiro entre −${limit} e ${limit}.`, field);
  return number;
}

function solve(values) {
  const mode = values.mode;
  if (!MODE_FIELDS[mode]) throw new MathDomainError("Escolha uma operação válida.");
  const state = { mode };
  for (const field of MODE_FIELDS[mode]) state[field] = integerInput(values[field], field);
  const { a, b, m, n } = state;
  const A = a === undefined ? null : rational(BigInt(a));
  const B = b === undefined ? null : rational(BigInt(b));
  const makeStep = (title, math, explanation) => ({ title, math, explanation });
  let expression, transformation, result, steps, meaning;

  if (mode === "simples") {
    result = power(A, m);
    expression = powerHTML(a, m);
    transformation = m > 0 ? Array(m).fill(baseText(a)).join(" · ") : m === 0 ? "1" : `1 ÷ ${powerHTML(a, -m)}`;
    steps = [
      makeStep("Identifique a base e o expoente", `${baseText(a)} é a base; ${signed(m)} é o expoente.`, "A base é o número que se repete como fator quando o expoente é positivo."),
      makeStep("Escreva o que o expoente pede", `${expression} = ${transformation}`, m > 0 ? `São ${m} fatores iguais.` : m === 0 ? "Uma base não nula elevada a zero vale 1." : "O expoente negativo coloca a potência positiva no denominador."),
      makeStep("Calcule e interprete", `${expression} = ${rationalText(result)}`, "Este é o valor exato da potência.")
    ];
    meaning = m === 0 ? "Não há fatores para repetir: por convenção, esta potência vale 1." : m < 0 ? `O resultado é o inverso de ${powerHTML(a, -m)}.` : `Multiplicar ${m} fatores iguais a ${baseText(a)} dá ${rationalText(result)}.`;
  } else if (mode === "multiplicar") {
    const left = power(A, m), right = power(A, n);
    result = multiply(left, right);
    expression = `${powerHTML(a, m)} · ${powerHTML(a, n)}`;
    transformation = powerHTML(a, m + n);
    steps = [
      makeStep("Encontre a mesma base", expression, `As duas potências têm base ${baseText(a)}.`),
      makeStep("Some os expoentes", `${expression} = ${powerHTML(a, m + n)}`, `${signed(m)} + ${signed(n)} = ${signed(m + n)}. A base permanece igual.`),
      makeStep("Calcule a potência", `${powerHTML(a, m + n)} = ${rationalText(result)}`, "As duas partes juntas têm o mesmo valor da potência final.")
    ];
    meaning = `Juntamos os fatores da mesma base: o expoente final é ${signed(m + n)}.`;
  } else if (mode === "dividir") {
    const left = power(A, m), right = power(A, n);
    if (a === 0) throw new MathDomainError("Na divisão de potências, a base não pode ser zero: o divisor seria zero ou indefinido.", "a");
    result = divide(left, right);
    expression = `${powerHTML(a, m)} ÷ ${powerHTML(a, n)}`;
    transformation = powerHTML(a, m - n);
    const divisionExplanation = m < 0 || n < 0
      ? "Expoentes negativos representam inversos. Ao dividir os valores das potências, chegamos ao mesmo resultado."
      : m === 0 || n === 0
        ? "A potência com expoente zero vale 1. Divida os valores para conferir o resultado."
        : "Cancele os fatores iguais; se restarem fatores no denominador, escreva o inverso.";
    steps = [
      makeStep("Encontre a mesma base", expression, `As duas potências têm base ${baseText(a)}. Como há divisão, a base deve ser diferente de zero.`),
      makeStep("Subtraia os expoentes", `${expression} = ${powerHTML(a, m - n)}`, `${signed(m)} − (${signed(n)}) = ${signed(m - n)}.`),
      makeStep("Calcule a potência", `${powerHTML(a, m - n)} = ${rationalText(result)}`, divisionExplanation)
    ];
    meaning = `Após cancelar fatores iguais, o expoente final é ${signed(m - n)}.`;
  } else if (mode === "potencia") {
    const inner = power(A, m);
    result = power(inner, n);
    expression = `(${powerHTML(a, m)})<sup>${signed(n)}</sup>`;
    transformation = powerHTML(a, m * n);
    steps = [
      makeStep("Veja a potência interna", `${powerHTML(a, m)} = ${rationalText(inner)}`, "Primeiro, a base é elevada ao expoente interno."),
      makeStep("Multiplique os expoentes", `${expression} = ${transformation}`, `${signed(m)} · ${signed(n)} = ${signed(m * n)}.`),
      makeStep("Calcule e confira", `${transformation} = ${rationalText(result)}`, `Elevar ${rationalText(inner)} a ${signed(n)} dá o mesmo resultado.`)
    ];
    meaning = `O expoente externo atua sobre o grupo: ${signed(m)} · ${signed(n)} = ${signed(m * n)}.`;
  } else if (mode === "produto") {
    const product = multiply(A, B);
    const left = power(A, n), right = power(B, n, "b");
    result = power(product, n);
    expression = pairHTML(a, b, "·", n);
    transformation = `${powerHTML(a, n)} · ${powerHTML(b, n)}`;
    steps = [
      makeStep("Veja os dois fatores", `${signed(a)} · ${signed(b)} = ${rationalText(product)}`, "O parêntese reúne um produto."),
      makeStep("Distribua o expoente", `${expression} = ${transformation}`, `Cada fator recebe o expoente ${signed(n)}.`),
      makeStep("Calcule e confira", `${rationalText(left)} · ${rationalText(right)} = ${rationalText(result)}`, `Também podemos calcular ${rationalText(product)} elevado a ${signed(n)}.`)
    ];
    meaning = `Elevamos cada fator a ${signed(n)} e multiplicamos os resultados.`;
  } else {
    if (b === 0) throw new MathDomainError("O denominador b não pode ser zero.", "b");
    const quotient = divide(A, B);
    const left = power(A, n), right = power(B, n, "b");
    result = power(quotient, n);
    expression = pairHTML(a, b, "÷", n);
    transformation = `${powerHTML(a, n)} ÷ ${powerHTML(b, n)}`;
    steps = [
      makeStep("Confira o denominador", `${signed(a)} ÷ ${signed(b)} = ${rationalText(quotient)}`, "O denominador é diferente de zero, então o quociente existe."),
      makeStep("Distribua o expoente", `${expression} = ${transformation}`, `Numerador e denominador recebem o expoente ${signed(n)}.`),
      makeStep("Calcule e confira", `${rationalText(left)} ÷ ${rationalText(right)} = ${rationalText(result)}`, `O resultado coincide com ${rationalText(quotient)} elevado a ${signed(n)}.`)
    ];
    meaning = `Elevamos numerador e denominador a ${signed(n)} e dividimos os resultados.`;
  }
  return { ...state, expression, transformation, result, steps, meaning };
}

function parseAnswer(raw) {
  const text = String(raw).trim().replace(/−/g, "-").replace(",", ".");
  if (/^[+-]?\d+\/[+-]?\d+$/.test(text)) {
    const [num, den] = text.split("/").map(BigInt);
    if (den === 0n) return null;
    return rational(num, den);
  }
  const match = text.match(/^([+-]?\d+)(?:\.(\d{1,6}))?$/);
  if (!match) return null;
  if (!match[2]) return rational(BigInt(match[1]));
  const scale = 10n ** BigInt(match[2].length);
  const sign = match[1].startsWith("-") ? -1n : 1n;
  return rational(BigInt(match[1]) * scale + sign * BigInt(match[2]), scale);
}

const QUESTIONS = [
  { topic: "Multiplicação · mesma base", expression: "2<sup>3</sup> · 2<sup>2</sup>", options: ["2<sup>3+2</sup>", "2<sup>3·2</sup>", "4<sup>3+2</sup>"], correct: 0, value: rational(32n), ruleHint: "As bases são iguais e há multiplicação. Some 3 e 2; a base continua 2.", valueHint: "Depois de somar os expoentes, calcule 2 elevado a 5." },
  { topic: "Divisão · mesma base", expression: "3<sup>4</sup> ÷ 3<sup>2</sup>", options: ["3<sup>4−2</sup>", "3<sup>4+2</sup>", "1<sup>4−2</sup>"], correct: 0, value: rational(9n), ruleHint: "Na divisão de potências de mesma base, subtraia os expoentes: 4 − 2.", valueHint: "Calcule 3 elevado a 2 após subtrair os expoentes." },
  { topic: "Potência de potência", expression: "(2<sup>2</sup>)<sup>3</sup>", options: ["2<sup>2·3</sup>", "2<sup>2+3</sup>", "4<sup>2+3</sup>"], correct: 0, value: rational(64n), ruleHint: "Há uma potência elevada a outra. Multiplique os expoentes 2 e 3.", valueHint: "A expressão equivalente é 2 elevado a 6." },
  { topic: "Potência do produto", expression: "(2 · 3)<sup>2</sup>", options: ["2<sup>2</sup> · 3<sup>2</sup>", "2<sup>2</sup> + 3<sup>2</sup>", "(2 + 3)<sup>2</sup>"], correct: 0, value: rational(36n), ruleHint: "Distribua o expoente 2 aos dois fatores, mantendo a multiplicação.", valueHint: "Calcule 2² e 3²; depois multiplique os dois valores." },
  { topic: "Potência do quociente", expression: "(8 ÷ 2)<sup>2</sup>", options: ["8<sup>2</sup> ÷ 2<sup>2</sup>", "8<sup>2</sup> − 2<sup>2</sup>", "8 ÷ 2<sup>2</sup>"], correct: 0, value: rational(16n), ruleHint: "O expoente 2 vai para o numerador e para o denominador.", valueHint: "Calcule 8² ÷ 2² ou, primeiro, 8 ÷ 2." },
  { topic: "Expoente zero", expression: "5<sup>0</sup>", options: ["1", "0", "5"], correct: 0, value: rational(1n), ruleHint: "Toda base não nula elevada a zero vale 1.", valueHint: "O expoente zero aqui produz 1." },
  { topic: "Expoente negativo", expression: "2<sup>−2</sup>", options: ["1 ÷ 2<sup>2</sup>", "−2<sup>2</sup>", "2<sup>2</sup>"], correct: 0, value: rational(1n, 4n), ruleHint: "O expoente negativo indica o inverso da potência positiva.", valueHint: "Calcule 1 ÷ 4. Você pode responder 1/4 ou 0,25." },
  { topic: "Base negativa", expression: "(−2)<sup>3</sup>", options: ["(−2) · (−2) · (−2)", "−(2 · 2)", "(−2) · 3"], correct: 0, value: rational(-8n), ruleHint: "O expoente 3 pede três fatores iguais a −2, com parênteses.", valueHint: "Multiplique os três fatores. Um número ímpar de fatores negativos produz resultado negativo." }
];

function initApp() {
  const form = document.querySelector("#power-form");
  const modeInput = document.querySelector("#mode");
  const fields = Object.fromEntries(["a", "b", "m", "n"].map(name => [name, form.elements[name]]));
  const output = {
    expression: document.querySelector("#expression"),
    transformation: document.querySelector("#transformation"),
    answer: document.querySelector("#answer"),
    meaning: document.querySelector("#answer-meaning"),
    error: document.querySelector("#lab-error"),
    steps: document.querySelector("#steps-list"),
    board: document.querySelector("#factor-board"),
    description: document.querySelector("#visual-description"),
    controls: document.querySelector("#visual-controls")
  };

  function syncFields() {
    const active = MODE_FIELDS[modeInput.value];
    for (const [name, input] of Object.entries(fields)) {
      const shown = active.includes(name);
      input.closest(".field").hidden = !shown;
      input.disabled = !shown;
    }
  }

  function clearErrors() {
    output.error.hidden = true;
    output.error.textContent = "";
    for (const [name, input] of Object.entries(fields)) {
      input.removeAttribute("aria-invalid");
      document.querySelector(`#error-${name}`).textContent = "";
    }
  }

  function showError(error) {
    const message = error instanceof MathDomainError ? error.message : "Confira os valores informados.";
    output.error.textContent = message;
    output.error.hidden = false;
    if (error.field && fields[error.field]) {
      fields[error.field].setAttribute("aria-invalid", "true");
      document.querySelector(`#error-${error.field}`).textContent = message;
    }
    output.expression.textContent = "Confira os campos";
    output.transformation.textContent = "";
    output.answer.textContent = "—";
    output.meaning.textContent = "Corrija o valor indicado para continuar.";
    output.steps.innerHTML = '<p class="waiting-message">Os passos aparecem quando a conta estiver válida.</p>';
    output.board.innerHTML = "";
    output.description.textContent = "O mapa de fatores aguarda valores válidos.";
    output.controls.innerHTML = "";
  }

  function renderSteps(model) {
    output.steps.innerHTML = model.steps.map((step, index) => `<details class="step-card" ${index === 0 ? "open" : ""}><summary><span class="step-badge">${index + 1}</span><span>${step.title}</span><span class="step-chevron" aria-hidden="true">⌄</span></summary><div class="step-body"><p class="step-math">${step.math}</p><p>${step.explanation}</p></div></details>`).join("");
    document.querySelector("#next-step").textContent = "Próximo passo ↓";
  }

  function factorStrip(base, exponent) {
    if (exponent === 0) return '<span class="empty-factors">nenhum fator → 1</span>';
    const count = Math.abs(exponent);
    const visible = Math.min(count, 8);
    const chips = Array(visible).fill(`<span class="factor-chip">${baseText(base)}</span>`).join('<span class="factor-times">×</span>');
    const more = count > visible ? `<span class="factor-more">+ ${count - visible} fatores</span>` : "";
    return exponent < 0 ? `<div class="reciprocal-one">1</div><div class="fraction-stroke"></div><div class="chip-list">${chips}${more}</div>` : `<div class="chip-list">${chips}${more}</div>`;
  }

  function visualRow(label, base, exponent, className = "") {
    return `<div class="factor-row ${className}"><div class="factor-row-label"><strong>${label}</strong><span>${powerHTML(base, exponent)}</span></div><div class="factor-representation">${factorStrip(base, exponent)}</div></div>`;
  }

  function renderVisual(model) {
    const { mode, a, b, m, n } = model;
    let rows, description;
    if (mode === "simples") {
      rows = visualRow("Potência", a, m, "tone-result");
      description = `${baseText(a)} elevado a ${signed(m)} resulta em ${rationalText(model.result)}. ${m < 0 ? "Os fatores aparecem no denominador." : m === 0 ? "Não há fatores e o valor é 1." : `Há ${m} fatores iguais a ${baseText(a)}.`}`;
    } else if (mode === "multiplicar" || mode === "dividir") {
      const exponent = mode === "multiplicar" ? m + n : m - n;
      rows = visualRow("Primeira potência", a, m, "tone-first") + visualRow("Segunda potência", a, n, "tone-second") + `<div class="factor-arrow" aria-hidden="true">${mode === "multiplicar" ? "somar expoentes ↓" : "subtrair expoentes ↓"}</div>` + visualRow("Depois da regra", a, exponent, "tone-result");
      description = `A primeira potência tem expoente ${signed(m)} e a segunda, ${signed(n)}. ${mode === "multiplicar" ? "Somamos" : "Subtraímos"} os expoentes e obtemos ${signed(exponent)}. O valor final é ${rationalText(model.result)}.`;
    } else if (mode === "potencia") {
      const outerNote = n > 0 ? `${signed(n)} grupos → expoentes multiplicados` : n === 0 ? "expoente externo zero → resultado 1" : "expoente externo negativo → inverso";
      rows = visualRow("Potência interna", a, m, "tone-first") + `<div class="factor-arrow" aria-hidden="true">${outerNote} ↓</div>` + visualRow("Depois da regra", a, m * n, "tone-result");
      description = `O expoente interno ${signed(m)} é multiplicado pelo externo ${signed(n)}. O expoente final é ${signed(m * n)} e o valor é ${rationalText(model.result)}.`;
    } else {
      rows = `<div class="factor-arrow factor-arrow-top">${mode === "produto" ? "o expoente vai para cada fator" : "o expoente vai para as duas partes"} ↓</div>` + visualRow(mode === "produto" ? "Fator a" : "Numerador", a, n, "tone-first") + visualRow(mode === "produto" ? "Fator b" : "Denominador", b, n, "tone-second");
      description = `O expoente ${signed(n)} é aplicado a ${baseText(a)} e a ${baseText(b)}. Depois, ${mode === "produto" ? "multiplicamos" : "dividimos"} as potências. O valor é ${rationalText(model.result)}.`;
    }
    output.board.innerHTML = rows;
    output.description.textContent = description;
    const adjustable = mode === "simples" ? ["m"] : mode === "produto" || mode === "quociente" ? ["n"] : ["m", "n"];
    output.controls.innerHTML = adjustable.map(field => `<div class="adjust-control"><span>Expoente ${field}</span><div><button type="button" data-adjust="${field}" data-delta="-1" aria-label="Diminuir expoente ${field}" ${model[field] <= -6 ? "disabled" : ""}>−</button><strong>${signed(model[field])}</strong><button type="button" data-adjust="${field}" data-delta="1" aria-label="Aumentar expoente ${field}" ${model[field] >= 6 ? "disabled" : ""}>+</button></div></div>`).join("");
  }

  function renderLab() {
    clearErrors();
    try {
      const model = solve({ mode: modeInput.value, ...Object.fromEntries(Object.entries(fields).map(([name, input]) => [name, input.value])) });
      output.expression.innerHTML = model.expression;
      output.transformation.innerHTML = `= ${model.transformation}`;
      output.answer.textContent = rationalText(model.result);
      output.meaning.innerHTML = model.meaning;
      renderSteps(model);
      renderVisual(model);
    } catch (error) { showError(error); }
  }

  modeInput.addEventListener("change", () => { syncFields(); renderLab(); });
  for (const input of Object.values(fields)) input.addEventListener("input", renderLab);
  form.addEventListener("submit", event => event.preventDefault());
  document.querySelectorAll("[data-preset], [data-example]").forEach(button => button.addEventListener("click", () => {
    const preset = PRESETS[button.dataset.preset || button.dataset.example];
    modeInput.value = preset.mode;
    for (const [key, value] of Object.entries(preset)) if (fields[key]) fields[key].value = String(value);
    syncFields(); renderLab();
    if (button.dataset.example) document.querySelector("#laboratorio").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }));
  output.controls.addEventListener("click", event => {
    const button = event.target.closest("button[data-adjust]");
    if (!button) return;
    const input = fields[button.dataset.adjust];
    const current = Number(input.value);
    if (!Number.isInteger(current)) return;
    input.value = String(Math.max(-6, Math.min(6, current + Number(button.dataset.delta))));
    renderLab();
  });
  document.querySelector("#next-step").addEventListener("click", () => {
    const steps = [...output.steps.querySelectorAll("details")];
    const next = steps.find(step => !step.open);
    if (next) { next.open = true; next.scrollIntoView({ block: "nearest" }); }
    else { steps.forEach((step, index) => step.open = index === 0); }
    document.querySelector("#next-step").textContent = steps.every(step => step.open) ? "Recomeçar passos ↺" : "Próximo passo ↓";
  });
  syncFields(); renderLab();

  let questionIndex = 0;
  let questionSolved = false;
  let optionOrder = [0, 1, 2];
  let score = { correct: 0, attempts: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem("potenciacao-score-v1"));
    if (saved && Number.isSafeInteger(saved.correct) && Number.isSafeInteger(saved.attempts) && saved.correct >= 0 && saved.attempts >= saved.correct) score = saved;
  } catch (_) { /* A prática continua quando o armazenamento não está disponível. */ }
  const practiceForm = document.querySelector("#practice-form");
  const feedback = document.querySelector("#practice-feedback");
  const numericAnswer = document.querySelector("#numeric-answer");
  function saveScore() { try { localStorage.setItem("potenciacao-score-v1", JSON.stringify(score)); } catch (_) { /* armazenamento opcional */ } }
  function renderScore() {
    document.querySelector("#correct-count").textContent = String(score.correct);
    document.querySelector("#attempt-count").textContent = String(score.attempts);
  }
  function clearPractice() { practiceForm.reset(); feedback.hidden = true; feedback.textContent = ""; feedback.className = "practice-feedback"; }
  function renderQuestion() {
    const question = QUESTIONS[questionIndex];
    questionSolved = false;
    optionOrder = [0, 1, 2];
    for (let i = optionOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionOrder[i], optionOrder[j]] = [optionOrder[j], optionOrder[i]];
    }
    document.querySelector("#question-count").textContent = `QUESTÃO ${questionIndex + 1} DE ${QUESTIONS.length}`;
    document.querySelector("#question-topic").textContent = question.topic;
    document.querySelector("#question-expression").innerHTML = question.expression;
    document.querySelector("#answer-options").innerHTML = optionOrder.map((optionIndex, index) => `<label class="answer-option"><input type="radio" name="rule-answer" value="${index}"><span>${question.options[optionIndex]}</span></label>`).join("");
    clearPractice();
  }
  function giveFeedback(ok, title, hint) {
    feedback.hidden = false;
    feedback.className = `practice-feedback ${ok ? "is-correct" : "is-incorrect"}`;
    feedback.innerHTML = `<strong>${title}</strong> <span>${hint}</span>`;
  }
  practiceForm.addEventListener("submit", event => {
    event.preventDefault();
    const question = QUESTIONS[questionIndex];
    const selected = practiceForm.querySelector('input[name="rule-answer"]:checked');
    const answer = parseAnswer(numericAnswer.value);
    score.attempts += 1;
    if (!selected) giveFeedback(false, "Quase! Comece pela propriedade.", question.ruleHint);
    else if (optionOrder[Number(selected.value)] !== question.correct) giveFeedback(false, "Quase! Confira a transformação.", question.ruleHint);
    else if (!answer) giveFeedback(false, "A propriedade está certa. Falta o valor.", "Digite um inteiro, decimal ou fração. Exemplo: 0,25 ou 1/4.");
    else if (answer.num !== question.value.num || answer.den !== question.value.den) giveFeedback(false, "Quase! Confira a conta final.", question.valueHint);
    else {
      if (!questionSolved) { score.correct += 1; questionSolved = true; }
      giveFeedback(true, "Correto!", `A transformação e o valor ${rationalText(question.value)} estão certos. Você pode seguir para outra questão.`);
    }
    saveScore(); renderScore();
  });
  practiceForm.addEventListener("input", () => { feedback.hidden = true; feedback.textContent = ""; });
  practiceForm.addEventListener("change", () => { feedback.hidden = true; feedback.textContent = ""; });
  document.querySelector("#clear-answer").addEventListener("click", clearPractice);
  document.querySelector("#new-question").addEventListener("click", () => { questionIndex = (questionIndex + 1) % QUESTIONS.length; renderQuestion(); });
  renderScore(); renderQuestion();
}

if (typeof document !== "undefined" && document.querySelector("#power-form")) initApp();
if (typeof module !== "undefined" && module.exports) module.exports = { solve, parseAnswer, rational, rationalText, MathDomainError };
