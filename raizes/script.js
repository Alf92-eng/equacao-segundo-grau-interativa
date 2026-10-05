"use strict";

(() => {
  class MathDomainError extends Error {
    constructor(message, field = null) {
      super(message);
      this.name = "MathDomainError";
      this.field = field;
    }
  }

  const MODES = {
    raiz: ["index", "a"],
    potencia: ["index", "a", "power"],
    multiplicar: ["index", "a", "b"],
    dividir: ["index", "a", "b"],
    "potencia-raiz": ["index", "a", "power"],
    somar: ["index", "a", "b"],
    subtrair: ["index", "a", "b"]
  };

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

  function factorize(value) {
    const factors = new Map();
    for (let prime = 2n; prime <= value / prime; prime += prime === 2n ? 1n : 2n) {
      while (value % prime === 0n) {
        factors.set(prime, (factors.get(prime) || 0n) + 1n);
        value /= prime;
      }
    }
    if (value > 1n) factors.set(value, (factors.get(value) || 0n) + 1n);
    return factors;
  }

  function normalizedRadical(factors, degree, sign = 1n) {
    let numerator = sign < 0n ? -1n : sign;
    let denominator = 1n;
    let radicand = 1n;
    for (const [prime, exponent] of factors) {
      let quotient = exponent / BigInt(degree);
      let remainder = exponent % BigInt(degree);
      if (remainder < 0n) {
        quotient -= 1n;
        remainder += BigInt(degree);
      }
      if (quotient > 0n) numerator *= prime ** quotient;
      if (quotient < 0n) denominator *= prime ** -quotient;
      if (remainder > 0n) radicand *= prime ** remainder;
    }
    const coefficient = rational(numerator, denominator);
    return { coefficient, radicand, degree };
  }

  function fromInteger(value, degree) {
    if (value < 0n && degree % 2 === 0) {
      throw new MathDomainError("Uma raiz de índice par não tem resultado real para radicando negativo.", "a");
    }
    if (value === 0n) return normalizedRadical(new Map(), degree, 0n);
    return normalizedRadical(factorize(value < 0n ? -value : value), degree, value < 0n ? -1n : 1n);
  }

  function checkRadicand(value, degree, field) {
    if (value < 0n && degree % 2 === 0) {
      throw new MathDomainError("Raiz par de número negativo não é definida nos números reais.", field);
    }
  }

  function powerFactors(value, exponent) {
    if (value === 0n) return new Map();
    return new Map([...factorize(value < 0n ? -value : value)].map(([prime, count]) => [prime, count * BigInt(exponent)]));
  }

  function combineFactors(left, right, direction = 1n) {
    const result = new Map(left);
    for (const [prime, exponent] of right) {
      result.set(prime, (result.get(prime) || 0n) + exponent * direction);
    }
    for (const [prime, exponent] of result) if (exponent === 0n) result.delete(prime);
    return result;
  }

  function addRational(left, right, direction = 1n) {
    return rational(left.num * right.den + direction * right.num * left.den, left.den * right.den);
  }

  function superscript(value) {
    const digits = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
    return String(value).split("").map(digit => digit === "-" ? "⁻" : digits[digit]).join("");
  }

  function rootText(value, degree) {
    const prefix = degree === 2 ? "" : superscript(degree);
    return `${prefix}√(${value})`;
  }

  function coefficientText(value) {
    return value.den === 1n ? String(value.num).replace("-", "−") : `${String(value.num).replace("-", "−")}/${value.den}`;
  }

  function exactText(value) {
    const { coefficient, radicand, degree } = value;
    if (coefficient.num === 0n) return "0";
    const root = radicand === 1n ? "" : rootText(radicand, degree);
    if (!root) return coefficientText(coefficient);
    if (coefficient.num === coefficient.den) return root;
    if (coefficient.num === -coefficient.den) return `−${root}`;
    return `${coefficientText(coefficient)} · ${root}`;
  }

  function htmlRoot(value, degree) {
    const index = degree === 2 ? "" : `<sup class="radical-index">${degree}</sup>`;
    const indexed = degree === 2 ? "" : " has-index";
    return `<span class="radical${indexed}">${index}<svg class="root-sign" viewBox="0 0 26 48" aria-hidden="true" focusable="false"><path d="M1 26h5l5 17L18.5 4"></path></svg><span class="radicand">${value}</span></span>`;
  }

  function htmlCoefficient(value) {
    return coefficientText(value).replace("−", "−");
  }

  function htmlExact(value) {
    const { coefficient, radicand, degree } = value;
    if (coefficient.num === 0n) return "0";
    const root = radicand === 1n ? "" : htmlRoot(radicand, degree);
    if (!root) return htmlCoefficient(coefficient);
    if (coefficient.num === coefficient.den) return root;
    if (coefficient.num === -coefficient.den) return `−${root}`;
    return `${htmlCoefficient(coefficient)} · ${root}`;
  }

  function readInteger(value, field, label, min, max) {
    const raw = String(value ?? "").trim();
    if (!/^[+-]?\d+$/.test(raw)) throw new MathDomainError(`${label}: informe um número inteiro.`, field);
    if (raw.length > 20) throw new MathDomainError(`${label}: o número excede o tamanho aceito.`, field);
    const parsed = BigInt(raw);
    if (parsed < BigInt(min) || parsed > BigInt(max)) {
      throw new MathDomainError(`${label}: escolha um inteiro entre ${min} e ${max}.`, field);
    }
    return Number(parsed);
  }

  function groupFactors(factors, degree) {
    return [...factors].map(([prime, exponent]) => ({
      prime: String(prime),
      groups: String(exponent / BigInt(degree)),
      remainder: String(exponent % BigInt(degree))
    }));
  }

  function factorizationText(factors) {
    if (!factors.size) return "1";
    return [...factors].map(([prime, exponent]) => exponent === 1n ? String(prime) : `${prime}${superscript(exponent)}`).join(" · ");
  }

  function approximate(value) {
    const coefficient = Number(value.coefficient.num) / Number(value.coefficient.den);
    return coefficient * Math.pow(Number(value.radicand), 1 / value.degree);
  }

  function formatApproximation(value) {
    if (!Number.isFinite(value)) return "fora do intervalo de aproximação numérica";
    return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 6 }).format(value);
  }

  function solve(values) {
    const mode = values.mode;
    if (!MODES[mode]) throw new MathDomainError("Escolha uma operação válida.");
    const fields = {};
    for (const field of MODES[mode]) {
      if (field === "index") fields.index = readInteger(values.index, field, "Índice", 2, 12);
      if (field === "a" || field === "b") fields[field] = readInteger(values[field], field, `Radicando ${field}`, -1_000_000, 1_000_000);
      if (field === "power") fields.power = readInteger(values.power, field, "Expoente", 1, 8);
    }

    const { index, a, b, power } = fields;
    const degree = index;
    let result;
    let expression;
    let transformation;
    let meaning;
    let steps;
    let factorMap = new Map();

    if (mode === "raiz") {
      result = fromInteger(BigInt(a), degree);
      factorMap = factorize(BigInt(Math.abs(a)));
      expression = htmlRoot(String(a).replace("-", "−"), degree);
      transformation = htmlExact(result);
      meaning = result.radicand === 1n
        ? "Esta raiz é exata: o resultado é um número inteiro."
        : "A forma exata foi simplificada; o radicando que sobrou não forma outro grupo completo.";
      steps = [
        { title: "Identifique a raiz", math: rootText(String(a).replace("-", "−"), degree), explanation: `A pergunta é qual número elevado a ${degree} produz ${a}.` },
        { title: "Decomponha em fatores primos", math: `${Math.abs(a)} = ${a === 0 ? "0" : factorizationText(factorMap)}`, explanation: "A fatoração mostra quais fatores iguais podem formar grupos do tamanho do índice." },
        { title: "Retire os grupos completos", math: `${rootText(String(a).replace("-", "−"), degree)} = ${exactText(result)}`, explanation: result.radicand === 1n ? "Todos os fatores formaram grupos completos e saíram do radical." : `Cada grupo de ${degree} fatores iguais sai da raiz; os fatores restantes ficam dentro.` },
        { title: "Interprete o resultado", math: `Resposta exata: ${exactText(result)}`, explanation: `Elevando o resultado à potência ${degree}, recuperamos o radicando original.` }
      ];
    } else if (mode === "potencia" || mode === "potencia-raiz") {
      const inside = mode === "potencia";
      const signedPower = a < 0 && power % 2 === 1 ? -1n : 1n;
      if (inside && signedPower < 0n && degree % 2 === 0) {
        throw new MathDomainError("A potência dentro da raiz é negativa. Com índice par, não há resultado real.", "a");
      }
      if (a === 0) {
        result = normalizedRadical(new Map(), degree, 0n);
      } else {
        factorMap = powerFactors(BigInt(a), power);
        result = normalizedRadical(factorMap, degree, signedPower);
      }
      expression = inside
        ? `${htmlRoot(`${a < 0 ? `(${String(a).replace("-", "−")})` : a}<sup>${power}</sup>`, degree)}`
        : `(${htmlRoot(String(a).replace("-", "−"), degree)})<sup>${power}</sup>`;
      transformation = htmlExact(result);
      meaning = inside
        ? `A raiz tem índice ${degree}; agrupamos os fatores da potência ${power} antes de simplificar.`
        : `A raiz foi elevada a ${power}; os fatores foram agrupados pelo índice ${degree}.`;
      steps = [
        { title: inside ? "Leia a potência dentro da raiz" : "Calcule primeiro a raiz", math: inside ? `${rootText(`${a}<sup>${power}</sup>`, degree)}` : `${rootText(String(a).replace("-", "−"), degree)}<sup>${power}</sup>`, explanation: `O índice é ${degree} e o expoente informado é ${power}.` },
        { title: "Decomponha e agrupe", math: `${Math.abs(a)}${superscript(power)} → ${a === 0 ? "0" : factorizationText(factorMap)}`, explanation: `Separe os fatores em grupos de ${degree}; cada grupo completo sai do radical.` },
        { title: "Escreva a forma simplificada", math: `${expression} = ${exactText(result)}`, explanation: result.radicand === 1n ? "Não restaram fatores dentro da raiz." : "Os fatores que não completam um grupo permanecem sob o radical." },
        { title: "Confira o domínio", math: `Resposta exata: ${exactText(result)}`, explanation: "Para índice par, a quantidade dentro da raiz precisa ser não negativa nos números reais." }
      ];
    } else if (mode === "multiplicar" || mode === "dividir") {
      checkRadicand(BigInt(a), degree, "a");
      checkRadicand(BigInt(b), degree, "b");
      if (mode === "dividir" && b === 0) throw new MathDomainError("O divisor não pode ser zero.", "b");
      const leftFactors = powerFactors(BigInt(a), 1);
      const rightFactors = powerFactors(BigInt(b), 1);
      factorMap = combineFactors(leftFactors, rightFactors, mode === "multiplicar" ? 1n : -1n);
      const leftSign = a < 0 ? -1n : a === 0 ? 0n : 1n;
      const rightSign = b < 0 ? -1n : b === 0 ? 0n : 1n;
      const sign = mode === "dividir" ? leftSign * rightSign : leftSign * rightSign;
      result = normalizedRadical(factorMap, degree, sign);
      const operation = mode === "multiplicar" ? "·" : "÷";
      expression = `${htmlRoot(String(a).replace("-", "−"), degree)} ${operation} ${htmlRoot(String(b).replace("-", "−"), degree)}`;
      transformation = `${htmlRoot(`${a} ${operation} ${b}`, degree)}`;
      meaning = mode === "multiplicar"
        ? "Com índices iguais, juntamos os fatores dos dois radicandos e formamos novos grupos."
        : "Com índices iguais, dividimos os fatores; o radicando do divisor precisa ser diferente de zero.";
      steps = [
        { title: "Confira os índices", math: `${rootText(String(a), degree)} ${operation} ${rootText(String(b), degree)}`, explanation: `Os dois índices são ${degree}; por isso podemos operar com os radicandos.` },
        { title: mode === "multiplicar" ? "Multiplique os radicandos" : "Divida os radicandos", math: `${a} ${operation} ${b}`, explanation: mode === "multiplicar" ? "A multiplicação dos radicandos reúne os fatores sob uma mesma raiz." : "A divisão é possível porque o radicando do divisor não é zero." },
        { title: "Simplifique os fatores", math: `${factorizationText(leftFactors)} ${operation} ${factorizationText(rightFactors)}`, explanation: "Separe grupos completos de fatores iguais ao índice e mantenha apenas os fatores restantes na raiz." },
        { title: "Escreva a resposta", math: `${expression} = ${exactText(result)}`, explanation: `Forma exata simplificada: ${exactText(result)}.` }
      ];
    } else {
      const left = fromInteger(BigInt(a), degree);
      const right = fromInteger(BigInt(b), degree);
      if (left.radicand !== right.radicand) {
        throw new MathDomainError("Depois de simplificar, os radicais precisam ter o mesmo índice e o mesmo radicando para serem somados ou subtraídos.", "b");
      }
      const direction = mode === "somar" ? 1n : -1n;
      const coefficient = addRational(left.coefficient, right.coefficient, direction);
      result = { coefficient, radicand: left.radicand, degree };
      factorMap = factorize(left.radicand);
      const operation = mode === "somar" ? "+" : "−";
      expression = `${htmlRoot(String(a).replace("-", "−"), degree)} ${operation} ${htmlRoot(String(b).replace("-", "−"), degree)}`;
      transformation = `${htmlExact(left)} ${operation} ${htmlExact(right)}`;
      meaning = `Após simplificar, as partes irracionais são iguais; ${mode === "somar" ? "somamos" : "subtraímos"} apenas os coeficientes.`;
      steps = [
        { title: "Simplifique cada radical", math: `${rootText(String(a), degree)} = ${exactText(left)}; ${rootText(String(b), degree)} = ${exactText(right)}`, explanation: "Antes de somar ou subtrair, coloque cada radical na forma mais simples." },
        { title: "Compare as partes irracionais", math: `${htmlExact(left)} ${operation} ${htmlExact(right)}`, explanation: `Os dois radicais têm índice ${degree} e a mesma parte sob a raiz.` },
        { title: "Some ou subtraia os coeficientes", math: `${coefficientText(left.coefficient)} ${operation} ${coefficientText(right.coefficient)} = ${coefficientText(coefficient)}`, explanation: "A parte irracional permanece; somente os coeficientes mudam." },
        { title: "Escreva a resposta", math: `${expression} = ${exactText(result)}`, explanation: `Forma exata simplificada: ${exactText(result)}.` }
      ];
    }

    const approximationValue = approximate(result);
    return {
      mode, fields, result, expression, transformation, meaning, steps, factorMap,
      exact: exactText(result),
      approximate: result.radicand === 1n ? null : formatApproximation(approximationValue),
      groups: groupFactors(factorize(result.radicand), degree)
    };
  }

  window.RadicaisMath = { MathDomainError, solve, exactText, factorize };

  const form = document.querySelector("#radical-form");
  if (!form) return;

  const modeInput = document.querySelector("#mode");
  const fields = Object.fromEntries(["index", "a", "b", "power"].map(name => [name, form.elements.namedItem(name)]));
  const output = {
    expression: document.querySelector("#expression"),
    transformation: document.querySelector("#transformation"),
    answer: document.querySelector("#answer"),
    meaning: document.querySelector("#answer-meaning"),
    approximation: document.querySelector("#approximation"),
    steps: document.querySelector("#steps-list"),
    board: document.querySelector("#factor-board"),
    description: document.querySelector("#visual-description"),
    error: document.querySelector("#lab-error")
  };

  const PRESETS = {
    simplificar: { mode: "raiz", index: 2, a: 72 },
    cubo: { mode: "raiz", index: 3, a: -216 },
    potencia: { mode: "potencia", index: 2, a: 2, power: 6 },
    multiplicar: { mode: "multiplicar", index: 2, a: 2, b: 8 },
    dividir: { mode: "dividir", index: 2, a: 48, b: 3 },
    "potencia-raiz": { mode: "potencia-raiz", index: 2, a: 2, power: 3 },
    somar: { mode: "somar", index: 2, a: 8, b: 18 }
  };

  function clearErrors() {
    output.error.hidden = true;
    output.error.textContent = "";
    for (const [name, input] of Object.entries(fields)) {
      input.removeAttribute("aria-invalid");
      document.querySelector(`#error-${name}`).textContent = "";
    }
  }

  function syncFields() {
    const active = MODES[modeInput.value];
    for (const [name, input] of Object.entries(fields)) {
      const wrapper = input.closest(".field");
      const visible = active.includes(name);
      wrapper.hidden = !visible;
      input.disabled = !visible;
    }
  }

  function renderSteps(steps) {
    output.steps.innerHTML = steps.map((step, index) => `<details class="step-card" ${index === 0 ? "open" : ""}><summary><span class="step-badge">${index + 1}</span><span>${step.title}</span><span class="step-chevron" aria-hidden="true">⌄</span></summary><div class="step-body"><p class="step-math">${step.math}</p><p>${step.explanation}</p></div></details>`).join("");
    document.querySelector("#next-step").textContent = "Próximo passo ↓";
  }

  function renderFactorBoard(model) {
    const tokens = [];
    for (const factor of model.groups) {
      const groups = Number(factor.groups);
      const remainder = Number(factor.remainder);
      if (groups > 0) tokens.push(`<span class="factor-token grouped">${factor.prime}${groups > 1 ? ` × ${groups}` : ""} sai</span>`);
      if (remainder > 0) tokens.push(`<span class="factor-token leftover">${factor.prime}${remainder > 1 ? ` × ${remainder}` : ""} fica</span>`);
    }
    output.board.innerHTML = tokens.length ? tokens.join('<span class="factor-separator" aria-hidden="true">→</span>') : '<span class="factor-token grouped">sem fatores restantes</span>';
    output.description.textContent = tokens.length
      ? `Na decomposição em grupos de ${model.fields.index}, fatores completos saem da raiz e os demais continuam dentro.`
      : "O radicando não tem fatores primos restantes sob o radical.";
  }

  function renderError(error) {
    clearErrors();
    const message = error instanceof Error ? error.message : "O cálculo não pôde ser concluído.";
    if (error instanceof MathDomainError && error.field && fields[error.field]) {
      fields[error.field].setAttribute("aria-invalid", "true");
      document.querySelector(`#error-${error.field}`).textContent = message;
    } else {
      output.error.textContent = message;
      output.error.hidden = false;
    }
    output.expression.textContent = "Confira os valores";
    output.transformation.textContent = "";
    output.answer.textContent = "—";
    output.meaning.textContent = "Corrija o valor indicado para continuar.";
    output.approximation.textContent = "";
    output.steps.innerHTML = '<p class="waiting-message">Os passos aparecem quando os valores forem válidos.</p>';
    output.board.replaceChildren();
    output.description.textContent = "O mapa de fatores aguarda valores válidos.";
  }

  function renderLab() {
    clearErrors();
    try {
      const model = solve({ mode: modeInput.value, ...Object.fromEntries(Object.entries(fields).map(([name, input]) => [name, input.value])) });
      output.expression.innerHTML = model.expression;
      output.transformation.innerHTML = `= ${model.transformation}`;
      output.answer.textContent = model.exact;
      output.meaning.textContent = model.meaning;
      output.approximation.textContent = model.approximate === null ? "" : `Aproximadamente ${model.approximate} (valor arredondado).`;
      renderSteps(model.steps);
      renderFactorBoard(model);
    } catch (error) {
      renderError(error);
    }
  }

  modeInput.addEventListener("change", () => { syncFields(); renderLab(); });
  for (const input of Object.values(fields)) input.addEventListener("input", renderLab);
  form.addEventListener("submit", event => event.preventDefault());
  document.querySelectorAll("[data-preset], [data-example]").forEach(button => button.addEventListener("click", () => {
    const preset = PRESETS[button.dataset.preset || button.dataset.example];
    if (!preset) return;
    modeInput.value = preset.mode;
    for (const [key, value] of Object.entries(preset)) if (fields[key]) fields[key].value = String(value);
    syncFields();
    renderLab();
    if (button.dataset.example) document.querySelector("#laboratorio").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }));
  document.querySelector("#next-step").addEventListener("click", () => {
    const steps = [...output.steps.querySelectorAll("details")];
    const next = steps.find(step => !step.open);
    if (next) {
      next.open = true;
      next.scrollIntoView({ block: "nearest" });
    } else {
      steps.forEach((step, index) => { step.open = index === 0; });
    }
    document.querySelector("#next-step").textContent = steps.every(step => step.open) ? "Recomeçar passos ↺" : "Próximo passo ↓";
  });

  const questions = [
    { topic: "Raiz quadrada", expression: "√72", answer: "6 · √2", hint: "Separe 72 como 36 · 2; a raiz de 36 sai do radical." },
    { topic: "Raiz cúbica", expression: "³√(−216)", answer: "−6", hint: "O índice é ímpar, então a raiz negativa é real. Procure o cubo de 6." },
    { topic: "Raiz de potência", expression: "√(2⁶)", answer: "8", hint: "Agrupe os seis fatores 2 em pares, pois o índice é 2." },
    { topic: "Multiplicação", expression: "√2 · √8", answer: "4", hint: "Com índices iguais, junte os radicandos: 2 · 8 = 16." },
    { topic: "Divisão", expression: "√48 ÷ √3", answer: "4", hint: "Divida os radicandos: 48 ÷ 3 = 16." },
    { topic: "Potência de radical", expression: "(√2)³", answer: "2 · √2", hint: "Escreva (√2)² · √2; a primeira parte vale 2." },
    { topic: "Radicais semelhantes", expression: "√8 + √18", answer: "5 · √2", hint: "Simplifique os dois radicais para obter 2√2 e 3√2." },
    { topic: "Raiz de índice 4", expression: "⁴√256", answer: "4", hint: "Procure o número que elevado à quarta potência dá 256." }
  ];
  let questionIndex = 0;
  let questionSolved = false;
  let score = { correct: 0, attempts: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem("radiciacao-score-v1"));
    if (saved && Number.isSafeInteger(saved.correct) && Number.isSafeInteger(saved.attempts) && saved.correct >= 0 && saved.attempts >= saved.correct) score = saved;
  } catch (_) {
    score = { correct: 0, attempts: 0 };
  }
  const practiceForm = document.querySelector("#practice-form");
  const feedback = document.querySelector("#practice-feedback");

  function saveScore() {
    try {
      localStorage.setItem("radiciacao-score-v1", JSON.stringify(score));
    } catch (_) {
      feedback.textContent = "A pontuação desta sessão não pôde ser salva, mas a prática continua normalmente.";
    }
  }

  function renderScore() {
    document.querySelector("#correct-count").textContent = String(score.correct);
    document.querySelector("#attempt-count").textContent = String(score.attempts);
  }

  function renderQuestion() {
    const question = questions[questionIndex];
    questionSolved = false;
    feedback.hidden = true;
    feedback.classList.remove("is-incorrect");
    document.querySelector("#question-count").textContent = `QUESTÃO ${questionIndex + 1} DE ${questions.length}`;
    document.querySelector("#question-topic").textContent = question.topic;
    document.querySelector("#question-expression").textContent = question.expression;
    const options = [question.answer, "√(a + b)", "2 · √3"].filter((value, index, list) => list.indexOf(value) === index);
    const alternatives = options.includes(question.answer) && options.length < 3
      ? [...options, "Não é possível nos reais"].slice(0, 3)
      : options;
    document.querySelector("#answer-options").innerHTML = alternatives.map((option, index) => `<label class="answer-option"><input type="radio" name="practice-answer" value="${index}"><span>${option}</span></label>`).join("");
  }

  document.querySelector("#new-question").addEventListener("click", () => {
    questionIndex = (questionIndex + 1) % questions.length;
    renderQuestion();
  });
  document.querySelector("#clear-answer").addEventListener("click", () => {
    practiceForm.reset();
    practiceForm.querySelectorAll('input[name="practice-answer"]').forEach(input => { input.disabled = false; });
    questionSolved = false;
    feedback.hidden = true;
    feedback.textContent = "";
    feedback.classList.remove("is-incorrect");
  });
  practiceForm.addEventListener("change", () => {
    if (!questionSolved) {
      feedback.hidden = true;
      feedback.textContent = "";
    }
  });
  practiceForm.addEventListener("submit", event => {
    event.preventDefault();
    if (questionSolved) return;
    const selected = practiceForm.querySelector('input[name="practice-answer"]:checked');
    if (!selected) {
      feedback.textContent = "Escolha uma resposta antes de verificar.";
      feedback.hidden = false;
      feedback.classList.add("is-incorrect");
      return;
    }
    const question = questions[questionIndex];
    const option = selected.nextElementSibling.textContent;
    score.attempts += 1;
    if (option === question.answer) {
      score.correct += 1;
      questionSolved = true;
      feedback.textContent = `Correto! ${question.expression} = ${question.answer}. ${question.hint}`;
      practiceForm.querySelectorAll('input[name="practice-answer"]').forEach(input => { input.disabled = true; });
    } else {
      feedback.textContent = `Quase! ${question.hint}`;
      feedback.classList.add("is-incorrect");
    }
    feedback.hidden = false;
    renderScore();
    saveScore();
  });

  syncFields();
  renderLab();
  renderScore();
  renderQuestion();
})();
