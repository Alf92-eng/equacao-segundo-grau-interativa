"use strict";

const elements = {
  form: document.querySelector("#equation-form"),
  inputA: document.querySelector("#input-a"),
  inputB: document.querySelector("#input-b"),
  inputC: document.querySelector("#input-c"),
  equationPreview: document.querySelector("#equation-preview"),
  formError: document.querySelector("#form-error"),
  deltaStatus: document.querySelector("#delta-status"),
  statusIcon: document.querySelector("#status-icon"),
  statusEyebrow: document.querySelector("#status-eyebrow"),
  statusTitle: document.querySelector("#status-title"),
  statusText: document.querySelector("#status-text"),
  answerEquation: document.querySelector("#answer-equation"),
  answerValues: document.querySelector("#answer-values"),
  answerNote: document.querySelector("#answer-note"),
  vertexValue: document.querySelector("#vertex-value"),
  openingValue: document.querySelector("#opening-value"),
  openingText: document.querySelector("#opening-text"),
  yInterceptValue: document.querySelector("#y-intercept-value"),
  graphDescription: document.querySelector("#graph-description"),
  canvas: document.querySelector("#parabola-canvas"),
  canvasCard: document.querySelector(".canvas-card"),
  dragMode: document.querySelector("#drag-mode"),
  pointsMode: document.querySelector("#points-mode"),
  clearGraphMode: document.querySelector("#clear-graph-mode"),
  touchEditToggle: document.querySelector("#touch-edit-toggle"),
  graphModeHelp: document.querySelector("#graph-mode-help"),
  graphModeStatus: document.querySelector("#graph-mode-status"),
  canvasBadge: document.querySelector("#canvas-badge"),
  graphEquationForm: document.querySelector("#graph-equation-form"),
  graphEquationInput: document.querySelector("#graph-equation-input"),
  graphEquationFeedback: document.querySelector("#graph-equation-feedback"),
  graphScale: document.querySelector("#graph-scale"),
  resetView: document.querySelector("#reset-view"),
  zoomIn: document.querySelector("#zoom-in"),
  zoomOut: document.querySelector("#zoom-out"),
  deltaGraphTitle: document.querySelector("#delta-graph-title"),
  deltaGraphText: document.querySelector("#delta-graph-text"),
  miniCurve: document.querySelector("#mini-curve"),
  miniRoot1: document.querySelector("#mini-root-1"),
  miniRoot2: document.querySelector("#mini-root-2"),
  nextStep: document.querySelector("#next-step"),
  exerciseForm: document.querySelector("#exercise-form"),
  exerciseEquation: document.querySelector("#exercise-equation"),
  answerDelta: document.querySelector("#answer-delta"),
  answerX1: document.querySelector("#answer-x1"),
  answerX2: document.querySelector("#answer-x2"),
  answerDeltaHint: document.querySelector("#answer-delta-hint"),
  answerX1Hint: document.querySelector("#answer-x1-hint"),
  answerX2Hint: document.querySelector("#answer-x2-hint"),
  exerciseFeedback: document.querySelector("#exercise-feedback"),
  correctCount: document.querySelector("#correct-count"),
  attemptCount: document.querySelector("#attempt-count"),
  scoreMessage: document.querySelector("#score-message"),
  newExercise: document.querySelector("#new-exercise")
};

const state = {
  current: { a: 1, b: 3, c: -10 },
  activeStep: 0,
  exercise: null,
  score: { correct: 0, attempts: 0 },
  graph: {
    mode: null,
    touchLocked: false,
    points: [],
    editPoints: [],
    dragPointIndex: null,
    hoverPoint: null,
    dragTarget: null,
    transform: null,
    lockedBounds: null,
    zoom: 1,
    pan: { x: 0, y: 0 },
    panStart: null,
    pendingCoefficients: null,
    animationFrame: null,
    zoomAnimationFrame: null
  }
};

const scoreStorageKey = "matematica-interativa:score:v1";
const coarsePointer = window.matchMedia("(pointer: coarse)");

function loadScore() {
  try {
    const saved = JSON.parse(localStorage.getItem(scoreStorageKey));
    if (saved && Number.isSafeInteger(saved.correct) && Number.isSafeInteger(saved.attempts)
      && saved.correct >= 0 && saved.attempts >= saved.correct) {
      state.score = { correct: saved.correct, attempts: saved.attempts };
    }
  } catch (_) {
    // O exercício continua disponível quando o armazenamento está bloqueado.
  }
}

function saveScore() {
  try {
    localStorage.setItem(scoreStorageKey, JSON.stringify(state.score));
  } catch (_) {
    // A pontuação continua válida durante a sessão atual.
  }
}

function normalizeZero(value) {
  return Math.abs(value) < 1e-10 ? 0 : value;
}

function formatNumber(value, maximumDigits = 3) {
  if (!Number.isFinite(value)) return "—";
  const normalized = normalizeZero(value);
  const rounded = Number(normalized.toFixed(maximumDigits));
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: maximumDigits,
    useGrouping: false
  }).format(rounded);
}

function formatInputValue(value) {
  return String(Number(normalizeZero(value).toFixed(4))).replace(".", ",");
}

function mathNumber(value, maximumDigits = 3) {
  const formatted = formatNumber(value, maximumDigits);
  return value < 0 ? `(${formatted})` : formatted;
}

function parseNumber(value) {
  const cleaned = String(value).trim().replace(/\s/g, "").replace(",", ".");
  if (cleaned === "") return NaN;
  return Number(cleaned);
}

function validateInputs() {
  const a = parseNumber(elements.inputA.value);
  const b = parseNumber(elements.inputB.value);
  const c = parseNumber(elements.inputC.value);

  if (![a, b, c].every(Number.isFinite)) {
    return { valid: false, message: "Preencha a, b e c somente com números válidos." };
  }
  if (Math.abs(a) < 1e-12) {
    return {
      valid: false,
      message: "O coeficiente 'a' deve ser diferente de zero para que a expressão seja uma equação do segundo grau."
    };
  }
  return { valid: true, values: { a, b, c } };
}

function calculateDiscriminant(a, b, c) {
  return normalizeZero((b * b) - (4 * a * c));
}

function calculateRoots(a, b, discriminant) {
  if (discriminant < 0) return [];
  const squareRoot = Math.sqrt(discriminant);
  const denominator = 2 * a;
  const x1 = normalizeZero((-b + squareRoot) / denominator);
  const x2 = normalizeZero((-b - squareRoot) / denominator);
  return discriminant === 0 ? [x1] : [x1, x2];
}

function calculateVertex(a, b, c) {
  const x = normalizeZero(-b / (2 * a));
  const y = normalizeZero((a * x * x) + (b * x) + c);
  return { x, y };
}

function coefficientTerm(value, variable, isFirst = false) {
  if (value === 0 && !isFirst) return "";
  const absolute = Math.abs(value);
  const numberPart = absolute === 1 && variable ? "" : formatNumber(absolute);
  const body = `${numberPart}${variable}`;
  if (isFirst) return value < 0 ? `−${body}` : body;
  return value < 0 ? ` − ${body}` : ` + ${body}`;
}

function formatEquation(a, b, c) {
  return `${coefficientTerm(a, "x²", true)}${coefficientTerm(b, "x")}${coefficientTerm(c, "")} = 0`;
}

function formatFunction(a, b, c) {
  let expression;
  if (Math.abs(a) >= 1e-8) {
    expression = `${coefficientTerm(a, "x²", true)}${coefficientTerm(b, "x")}${coefficientTerm(c, "")}`;
  } else if (Math.abs(b) >= 1e-8) {
    expression = `${coefficientTerm(b, "x", true)}${coefficientTerm(c, "")}`;
  } else {
    expression = formatNumber(c);
  }
  return `y = ${expression}`;
}

function parsePolynomialExpression(value) {
  let expression = String(value)
    .toLowerCase()
    .replace(/−/g, "-")
    .replace(/,/g, ".")
    .replace(/²/g, "^2")
    .replace(/\*\*/g, "^")
    .replace(/\s+/g, "")
    .replace(/\*/g, "");

  if (expression.startsWith("f(x)=")) expression = expression.slice(5);
  else if (expression.startsWith("y=")) expression = expression.slice(2);
  else if (expression.includes("=")) {
    const sides = expression.split("=");
    if (sides.length !== 2 || sides[0] === "") {
      return { valid: false, message: "Use uma única igualdade, como y = x² + 3x − 10." };
    }
    const rightValue = Number(sides[1]);
    if (!Number.isFinite(rightValue)) {
      return { valid: false, message: "Depois do sinal de igual, use y ou um número real." };
    }
    expression = `${sides[0]}${rightValue >= 0 ? "-" : "+"}${Math.abs(rightValue)}`;
  }

  if (!expression || !/^[0-9x+\-.^]+$/.test(expression)) {
    return { valid: false, message: "Use somente números, x, x², + e −." };
  }

  const terms = expression.match(/[+-]?[^+-]+/g) || [];
  if (terms.join("") !== expression) {
    return { valid: false, message: "Não foi possível separar os termos da função." };
  }

  const readCoefficient = (rawValue) => {
    if (rawValue === "" || rawValue === "+") return 1;
    if (rawValue === "-") return -1;
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(rawValue)) return NaN;
    return Number(rawValue);
  };

  let a = 0;
  let b = 0;
  let c = 0;
  for (const term of terms) {
    if (term.endsWith("x^2") && term.indexOf("x") === term.lastIndexOf("x")) {
      const coefficient = readCoefficient(term.slice(0, -3));
      if (!Number.isFinite(coefficient)) return { valid: false, message: `O termo “${term}” não é válido.` };
      a += coefficient;
    } else if (term.endsWith("x") && term.indexOf("x") === term.lastIndexOf("x") && !term.includes("^")) {
      const coefficient = readCoefficient(term.slice(0, -1));
      if (!Number.isFinite(coefficient)) return { valid: false, message: `O termo “${term}” não é válido.` };
      b += coefficient;
    } else {
      const constant = readCoefficient(term);
      if (!Number.isFinite(constant)) return { valid: false, message: `O termo “${term}” não é válido.` };
      c += constant;
    }
  }

  return { valid: true, values: { a: normalizeZero(a), b: normalizeZero(b), c: normalizeZero(c) } };
}

function updateEquation() {
  const a = parseNumber(elements.inputA.value);
  const b = parseNumber(elements.inputB.value);
  const c = parseNumber(elements.inputC.value);
  const safeA = Number.isFinite(a) ? a : "a";
  const safeB = Number.isFinite(b) ? b : "b";
  const safeC = Number.isFinite(c) ? c : "c";

  if ([safeA, safeB, safeC].every(Number.isFinite)) {
    elements.equationPreview.textContent = formatEquation(safeA, safeB, safeC);
    state.current = { a: safeA, b: safeB, c: safeC };
    drawGraph(state.current);
  } else {
    elements.equationPreview.textContent = `${safeA}x² + ${safeB}x + ${safeC} = 0`;
  }
}

function createMathLines(lines) {
  return `<div class="math-lines">${lines.map((line) => `<p class="math-line">${line}</p>`).join("")}</div>`;
}

function renderSteps({ a, b, c, discriminant, roots }) {
  const bSquared = b * b;
  const product = 4 * a * c;
  const operationLine = product < 0
    ? `${formatNumber(bSquared)} + ${formatNumber(Math.abs(product))}`
    : `${formatNumber(bSquared)} − ${formatNumber(product)}`;

  document.querySelector("#step-1").innerHTML = `
    <p class="explanation">Compare a equação com a forma geral <strong>ax² + bx + c = 0</strong>.</p>
    ${createMathLines([
      `a = ${formatNumber(a)} → coeficiente de x²`,
      `b = ${formatNumber(b)} → coeficiente de x`,
      `c = ${formatNumber(c)} → termo independente`
    ])}`;

  document.querySelector("#step-2").innerHTML = `
    <p class="explanation">Substituímos cada coeficiente em <strong>Δ = b² − 4ac</strong>.</p>
    ${createMathLines([
      "Δ = b² − 4ac",
      `Δ = ${mathNumber(b)}² − 4 × ${mathNumber(a)} × ${mathNumber(c)}`,
      `Δ = ${operationLine}`,
      `Δ = ${formatNumber(discriminant)}`
    ])}`;

  const interpretation = discriminant > 0
    ? "Como Δ > 0, existem duas raízes reais diferentes."
    : discriminant === 0
      ? "Como Δ = 0, existe uma raiz real dupla."
      : "Como Δ < 0, não existem raízes reais.";
  document.querySelector("#step-3").innerHTML = `
    <p class="explanation">O sinal de delta revela quantos encontros a parábola tem com o eixo x.</p>
    ${createMathLines([`Δ = ${formatNumber(discriminant)}`, interpretation])}`;

  if (discriminant < 0) {
    document.querySelector("#step-4").innerHTML = `
      <p class="explanation">A fórmula de Bhaskara usa √Δ. Nos números reais, não existe raiz quadrada de número negativo.</p>
      ${createMathLines(["x = (−b ± √Δ) / (2a)", `√${formatNumber(discriminant)} não é um número real`])}`;
    document.querySelector("#step-5").innerHTML = `
      <p class="explanation">Encerramos a resolução no conjunto dos números reais.</p>
      ${createMathLines(["Esta equação não possui raízes reais."])}`;
    return;
  }

  const squareRoot = Math.sqrt(discriminant);
  const denominator = 2 * a;
  document.querySelector("#step-4").innerHTML = `
    <p class="explanation">Calculamos a raiz de delta e substituímos na fórmula.</p>
    ${createMathLines([
      "x = (−b ± √Δ) / (2a)",
      `√${formatNumber(discriminant)} = ${formatNumber(squareRoot)}`,
      `x = (−${mathNumber(b)} ± ${formatNumber(squareRoot)}) / (2 × ${mathNumber(a)})`
    ])}`;

  const numerator1 = -b + squareRoot;
  const x1Lines = [
    `x₁ = (−${mathNumber(b)} + ${formatNumber(squareRoot)}) / (2 × ${mathNumber(a)})`,
    `x₁ = ${formatNumber(numerator1)} / ${formatNumber(denominator)}`,
    `x₁ = ${formatNumber(roots[0])}`
  ];

  if (discriminant === 0) {
    document.querySelector("#step-5").innerHTML = `
      <p class="explanation">Os sinais + e − produzem o mesmo valor: uma raiz real dupla.</p>
      ${createMathLines(x1Lines)}`;
  } else {
    const numerator2 = -b - squareRoot;
    document.querySelector("#step-5").innerHTML = `
      <p class="explanation">Separamos o sinal positivo para x₁ e o negativo para x₂.</p>
      ${createMathLines([
        ...x1Lines,
        `x₂ = (−${mathNumber(b)} − ${formatNumber(squareRoot)}) / (2 × ${mathNumber(a)})`,
        `x₂ = ${formatNumber(numerator2)} / ${formatNumber(denominator)}`,
        `x₂ = ${formatNumber(roots[1])}`
      ])}`;
  }
}

function renderStatus(discriminant) {
  elements.deltaStatus.classList.remove("status-positive", "status-zero", "status-negative");
  const keys = document.querySelectorAll(".delta-key span");
  keys.forEach((key) => key.classList.remove("is-current"));

  if (discriminant > 0) {
    elements.deltaStatus.classList.add("status-positive");
    elements.statusIcon.textContent = "↔";
    elements.statusEyebrow.textContent = `Δ = ${formatNumber(discriminant)} • positivo`;
    elements.statusTitle.textContent = "Duas raízes reais diferentes";
    elements.statusText.textContent = "A parábola cruza o eixo x em dois pontos.";
    elements.deltaGraphTitle.textContent = "Δ > 0: dois encontros com o eixo x";
    elements.deltaGraphText.textContent = "Como existem duas raízes reais diferentes, a parábola cruza o eixo x em dois pontos.";
    document.querySelector('[data-case="positive"]').classList.add("is-current");
    elements.miniCurve.setAttribute("d", "M20 8 Q75 142 130 8");
    elements.miniRoot1.setAttribute("cx", "43");
    elements.miniRoot1.hidden = false;
    elements.miniRoot2.hidden = false;
  } else if (discriminant === 0) {
    elements.deltaStatus.classList.add("status-zero");
    elements.statusIcon.textContent = "◇";
    elements.statusEyebrow.textContent = "Δ = 0 • nulo";
    elements.statusTitle.textContent = "Uma raiz real dupla";
    elements.statusText.textContent = "A parábola toca o eixo x em um único ponto.";
    elements.deltaGraphTitle.textContent = "Δ = 0: um toque no eixo x";
    elements.deltaGraphText.textContent = "A raiz é dupla, então o vértice da parábola apenas toca o eixo x.";
    document.querySelector('[data-case="zero"]').classList.add("is-current");
    elements.miniCurve.setAttribute("d", "M20 12 Q75 124 130 12");
    elements.miniRoot1.setAttribute("cx", "75");
    elements.miniRoot1.hidden = false;
    elements.miniRoot2.hidden = true;
  } else {
    elements.deltaStatus.classList.add("status-negative");
    elements.statusIcon.textContent = "∅";
    elements.statusEyebrow.textContent = `Δ = ${formatNumber(discriminant)} • negativo`;
    elements.statusTitle.textContent = "Nenhuma raiz real";
    elements.statusText.textContent = "A parábola não cruza o eixo x.";
    elements.deltaGraphTitle.textContent = "Δ < 0: nenhum encontro com o eixo x";
    elements.deltaGraphText.textContent = "Como não existem raízes reais, a parábola permanece sem cruzar o eixo x.";
    document.querySelector('[data-case="negative"]').classList.add("is-current");
    elements.miniCurve.setAttribute("d", "M20 5 Q75 100 130 5");
    elements.miniRoot1.hidden = true;
    elements.miniRoot2.hidden = true;
  }
}

function renderAnswer(values, roots) {
  const { a, b, c } = values;
  elements.answerEquation.textContent = formatEquation(a, b, c);
  elements.answerValues.classList.toggle("single", roots.length < 2);

  if (roots.length === 2) {
    elements.answerValues.innerHTML = `<p><span>x₁</span><strong>${formatNumber(roots[0])}</strong></p><p><span>x₂</span><strong>${formatNumber(roots[1])}</strong></p>`;
    elements.answerNote.textContent = `Ao substituir ${formatNumber(roots[0])} ou ${formatNumber(roots[1])}, a expressão resulta em zero.`;
  } else if (roots.length === 1) {
    elements.answerValues.innerHTML = `<p><span>x₁ = x₂</span><strong>${formatNumber(roots[0])}</strong></p>`;
    elements.answerNote.textContent = "Os dois caminhos de Bhaskara chegam à mesma raiz.";
  } else {
    elements.answerValues.innerHTML = "<p><span>Resultado</span><strong>∅</strong></p>";
    elements.answerNote.textContent = "Esta equação não possui raízes reais.";
  }
}

function renderGraphFacts({ a, b, c }, vertex) {
  if (Math.abs(a) < 1e-8) {
    elements.vertexValue.textContent = "Não se aplica à reta";
    elements.openingValue.textContent = "Função linear";
    elements.openingText.textContent = Math.abs(b) < 1e-8
      ? "A função é constante e forma uma reta horizontal."
      : `O coeficiente b = ${formatNumber(b)} determina a inclinação da reta.`;
    elements.yInterceptValue.textContent = `(0; ${formatNumber(c)})`;
    return;
  }
  elements.vertexValue.textContent = `V(${formatNumber(vertex.x)}; ${formatNumber(vertex.y)})`;
  elements.openingValue.textContent = a > 0 ? "Para cima" : "Para baixo";
  elements.openingText.textContent = `Como a é ${a > 0 ? "positivo" : "negativo"}, a curva se abre para ${a > 0 ? "cima" : "baixo"}.`;
  elements.yInterceptValue.textContent = `(0; ${formatNumber(c)})`;
}

function niceStep(range, targetLines = 8) {
  const rough = range / targetLines;
  const exponent = 10 ** Math.floor(Math.log10(Math.max(rough, 1e-10)));
  const fraction = rough / exponent;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * exponent;
}

function drawGraph({ a, b, c }, { lightweight = false } = {}) {
  const canvas = elements.canvas;
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(300, rect.width || 760);
  const cssHeight = Math.max(300, Math.min(500, cssWidth * 0.66));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const requiredWidth = Math.round(cssWidth * dpr);
  const requiredHeight = Math.round(cssHeight * dpr);
  if (canvas.width !== requiredWidth || canvas.height !== requiredHeight) {
    canvas.width = requiredWidth;
    canvas.height = requiredHeight;
  }
  canvas.style.height = `${cssHeight}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const isLinear = Math.abs(a) < 1e-8;
  const discriminant = isLinear ? null : calculateDiscriminant(a, b, c);
  const roots = isLinear
    ? (Math.abs(b) < 1e-8 ? [] : [normalizeZero(-c / b)])
    : calculateRoots(a, b, discriminant);
  const vertex = isLinear ? null : calculateVertex(a, b, c);
  const importantX = [0, ...(vertex ? [vertex.x] : []), ...roots];
  const dataMinX = Math.min(...importantX);
  const dataMaxX = Math.max(...importantX);
  const naturalSpan = Math.max(8, dataMaxX - dataMinX);
  const centerX = (dataMinX + dataMaxX) / 2;
  let xMin = centerX - naturalSpan * 0.72;
  let xMax = centerX + naturalSpan * 0.72;

  const sampleValues = [];
  for (let index = 0; index <= 160; index += 1) {
    const x = xMin + ((xMax - xMin) * index / 160);
    sampleValues.push((a * x * x) + (b * x) + c);
  }
  sampleValues.push(0, c);
  if (vertex) sampleValues.push(vertex.y);
  let yMin = Math.min(...sampleValues);
  let yMax = Math.max(...sampleValues);
  const ySpan = Math.max(6, yMax - yMin);
  yMin -= ySpan * 0.1;
  yMax += ySpan * 0.1;

  const padding = { left: 48, right: 22, top: 25, bottom: 38 };
  const plotWidth = cssWidth - padding.left - padding.right;
  const plotHeight = cssHeight - padding.top - padding.bottom;
  const zoom = state.graph.zoom;
  const naturalCenterX = (xMin + xMax) / 2;
  const naturalCenterY = (yMin + yMax) / 2;
  const rawNaturalWidth = xMax - xMin;
  const rawNaturalHeight = yMax - yMin;
  const unitsPerPixel = Math.max(rawNaturalWidth / plotWidth, rawNaturalHeight / plotHeight);
  const naturalWidth = unitsPerPixel * plotWidth;
  const naturalHeight = unitsPerPixel * plotHeight;
  const zoomCenterX = naturalCenterX + state.graph.pan.x;
  const zoomCenterY = naturalCenterY + state.graph.pan.y;
  const zoomHalfWidth = naturalWidth / (2 * zoom);
  const zoomHalfHeight = naturalHeight / (2 * zoom);
  xMin = zoomCenterX - zoomHalfWidth;
  xMax = zoomCenterX + zoomHalfWidth;
  yMin = zoomCenterY - zoomHalfHeight;
  yMax = zoomCenterY + zoomHalfHeight;

  if (state.graph.lockedBounds) {
    ({ xMin, xMax, yMin, yMax } = state.graph.lockedBounds);
  }

  const toCanvasX = (x) => padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const toCanvasY = (y) => padding.top + ((yMax - y) / (yMax - yMin)) * plotHeight;
  const toGraphX = (px) => xMin + ((px - padding.left) / plotWidth) * (xMax - xMin);
  const toGraphY = (py) => yMax - ((py - padding.top) / plotHeight) * (yMax - yMin);

  context.clearRect(0, 0, cssWidth, cssHeight);
  context.fillStyle = "#fbfdfc";
  context.fillRect(0, 0, cssWidth, cssHeight);

  const xStep = niceStep(xMax - xMin);
  const yStep = niceStep(yMax - yMin);
  context.lineWidth = 1;
  context.strokeStyle = "#e3e9e5";
  context.fillStyle = "#718078";
  context.font = "11px system-ui, sans-serif";

  const firstX = Math.ceil(xMin / xStep) * xStep;
  for (let x = firstX; x <= xMax + xStep * 0.01; x += xStep) {
    const px = toCanvasX(x);
    context.beginPath(); context.moveTo(px, padding.top); context.lineTo(px, cssHeight - padding.bottom); context.stroke();
    if (Math.abs(x) > xStep * 0.01) context.fillText(formatNumber(x, 2), px + 3, Math.min(cssHeight - 8, Math.max(padding.top + 12, toCanvasY(0) + 15)));
  }
  const firstY = Math.ceil(yMin / yStep) * yStep;
  for (let y = firstY; y <= yMax + yStep * 0.01; y += yStep) {
    const py = toCanvasY(y);
    context.beginPath(); context.moveTo(padding.left, py); context.lineTo(cssWidth - padding.right, py); context.stroke();
    if (Math.abs(y) > yStep * 0.01) context.fillText(formatNumber(y, 2), Math.min(cssWidth - 35, Math.max(4, toCanvasX(0) + 5)), py - 5);
  }

  context.strokeStyle = "#65736c";
  context.lineWidth = 1.5;
  if (xMin <= 0 && xMax >= 0) {
    const axisX = toCanvasX(0);
    context.beginPath(); context.moveTo(axisX, padding.top); context.lineTo(axisX, cssHeight - padding.bottom); context.stroke();
    context.fillStyle = "#26332d"; context.fillText("y", axisX + 7, padding.top + 10);
  }
  if (yMin <= 0 && yMax >= 0) {
    const axisY = toCanvasY(0);
    context.beginPath(); context.moveTo(padding.left, axisY); context.lineTo(cssWidth - padding.right, axisY); context.stroke();
    context.fillStyle = "#26332d"; context.fillText("x", cssWidth - padding.right - 7, axisY - 8);
  }
  if (xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0) {
    context.fillStyle = "#26332d"; context.fillText("0", toCanvasX(0) + 5, toCanvasY(0) + 15);
  }

  context.save();
  context.beginPath();
  context.rect(padding.left, padding.top, plotWidth, plotHeight);
  context.clip();
  context.beginPath();
  for (let index = 0; index <= 400; index += 1) {
    const x = xMin + ((xMax - xMin) * index / 400);
    const y = (a * x * x) + (b * x) + c;
    if (index === 0) context.moveTo(toCanvasX(x), toCanvasY(y));
    else context.lineTo(toCanvasX(x), toCanvasY(y));
  }
  context.strokeStyle = "#2e8b61";
  context.lineWidth = 3.5;
  context.lineJoin = "round";
  context.stroke();
  context.restore();

  roots.forEach((root, index) => {
    const px = toCanvasX(root);
    const py = toCanvasY(0);
    context.beginPath(); context.arc(px, py, 5.5, 0, Math.PI * 2); context.fillStyle = "#2f648a"; context.fill();
    context.fillStyle = "#244e6a";
    context.font = "700 12px system-ui, sans-serif";
    context.fillText(`${roots.length === 1 ? "x" : `x${index + 1}`} = ${formatNumber(root)}`, px + 8, py - 9);
  });

  const anchor = isLinear ? { x: 0, y: c } : vertex;
  const anchorX = toCanvasX(anchor.x);
  const anchorY = toCanvasY(anchor.y);
  context.beginPath(); context.arc(anchorX, anchorY, 6, 0, Math.PI * 2); context.fillStyle = "#9a741f"; context.fill();
  context.fillStyle = "#725615"; context.font = "700 12px system-ui, sans-serif";
  context.fillText(isLinear ? "P" : "V", anchorX + 9, Math.max(padding.top + 12, anchorY - 8));

  let editHandles = [];
  if (state.graph.mode === "drag") {
    if (state.graph.editPoints.length !== 3) {
      const visibleCenter = (xMin + xMax) / 2;
      const preferredCenter = vertex ? vertex.x : 0;
      const controlCenter = preferredCenter > xMin && preferredCenter < xMax ? preferredCenter : visibleCenter;
      const visibleUnitsPerPixel = (xMax - xMin) / plotWidth;
      const horizontalSpacing = visibleUnitsPerPixel * 72;
      const verticalLimit = visibleUnitsPerPixel * 76;
      const curvatureSpacing = Math.abs(a) < 1e-8
        ? horizontalSpacing
        : Math.sqrt(verticalLimit / Math.abs(a));
      const controlSpacing = Math.max(
        visibleUnitsPerPixel * 34,
        Math.min(horizontalSpacing, curvatureSpacing, (xMax - xMin) * 0.14)
      );
      state.graph.editPoints = [-1, 0, 1].map((direction) => {
        const x = controlCenter + (direction * controlSpacing);
        return { x, y: (a * x * x) + (b * x) + c };
      });
    } else {
      state.graph.editPoints = state.graph.editPoints.map((point) => ({
        x: point.x,
        y: (a * point.x * point.x) + (b * point.x) + c
      }));
    }
    editHandles = state.graph.editPoints.map((point) => ({
      ...point,
      canvasX: toCanvasX(point.x),
      canvasY: toCanvasY(point.y)
    }));

    context.save();
    context.setLineDash([5, 5]);
    context.strokeStyle = "rgba(138, 77, 157, 0.5)";
    context.lineWidth = 1.5;
    context.beginPath();
    editHandles.forEach((handle, index) => {
      if (index === 0) context.moveTo(handle.canvasX, handle.canvasY);
      else context.lineTo(handle.canvasX, handle.canvasY);
    });
    context.stroke();
    context.restore();
    editHandles.forEach((handle, index) => {
      context.beginPath();
      context.arc(handle.canvasX, handle.canvasY, 6, 0, Math.PI * 2);
      context.fillStyle = "#8a4d9d";
      context.fill();
    });
  }

  if (state.graph.mode === "points") {
    state.graph.points.forEach((point, index) => {
      const px = toCanvasX(point.x);
      const py = toCanvasY(point.y);
      context.beginPath();
      context.arc(px, py, 7, 0, Math.PI * 2);
      context.fillStyle = "#2f648a";
      context.fill();
      context.strokeStyle = "#ffffff";
      context.lineWidth = 2;
      context.stroke();
      context.fillStyle = "#244e6a";
      context.font = "800 11px system-ui, sans-serif";
      context.fillText(`P${index + 1} (${formatNumber(point.x)}; ${formatNumber(point.y)})`, px + 10, py - 9);
    });

    if (state.graph.hoverPoint && state.graph.points.length < 3) {
      const hoverX = toCanvasX(state.graph.hoverPoint.x);
      const hoverY = toCanvasY(state.graph.hoverPoint.y);
      context.save();
      context.setLineDash([4, 4]);
      context.strokeStyle = "rgba(47, 100, 138, 0.65)";
      context.lineWidth = 1.5;
      context.beginPath(); context.moveTo(hoverX, padding.top); context.lineTo(hoverX, cssHeight - padding.bottom); context.stroke();
      context.beginPath(); context.moveTo(padding.left, hoverY); context.lineTo(cssWidth - padding.right, hoverY); context.stroke();
      context.restore();
    }
  }

  const xSnap = (xMax - xMin) <= 30 ? 1 : niceStep(xMax - xMin, 30);
  const ySnap = (yMax - yMin) <= 30 ? 1 : niceStep(yMax - yMin, 30);
  state.graph.transform = {
    toCanvasX,
    toCanvasY,
    toGraphX,
    toGraphY,
    xSnap,
    ySnap,
    bounds: { xMin, xMax, yMin, yMax },
    naturalCenter: { x: naturalCenterX, y: naturalCenterY },
    naturalSize: { width: naturalWidth, height: naturalHeight },
    plotSize: { width: plotWidth, height: plotHeight },
    padding,
    isLinear,
    vertex: { ...anchor, canvasX: anchorX, canvasY: anchorY },
    editHandles
  };

  if (document.activeElement !== elements.graphEquationInput) {
    elements.graphEquationInput.value = formatFunction(a, b, c);
  }
  elements.graphScale.textContent = `Zoom ${Math.round(state.graph.zoom * 100)}% • ${isLinear ? "função linear" : "função quadrática"}`;

  const rootDescription = roots.length === 2
    ? `raízes ${formatNumber(roots[0])} e ${formatNumber(roots[1])}`
    : roots.length === 1
      ? `raiz dupla ${formatNumber(roots[0])}`
      : "nenhuma raiz real";
  if (!lightweight) {
    elements.graphDescription.textContent = isLinear
      ? `Gráfico da função linear ${formatFunction(a, b, c)}, com ${roots.length ? `raiz ${formatNumber(roots[0])}` : "nenhuma raiz única"}.`
      : `Gráfico da função ${formatFunction(a, b, c)}, com ${rootDescription} e vértice em (${formatNumber(vertex.x)}; ${formatNumber(vertex.y)}).`;
    renderGraphFacts({ a, b, c }, vertex);
  }
}

function updateGraphStatus(message, active = true) {
  elements.graphModeStatus.classList.toggle("is-active", active);
  elements.graphModeStatus.lastElementChild.textContent = message;
}

function updateTouchEditing() {
  const available = coarsePointer.matches && Boolean(state.graph.mode);
  if (!available) state.graph.touchLocked = false;
  elements.touchEditToggle.hidden = !available;
  elements.touchEditToggle.setAttribute("aria-pressed", String(state.graph.touchLocked));
  elements.touchEditToggle.textContent = state.graph.touchLocked ? "Voltar a rolar a página" : "Ativar toque no gráfico";
  elements.canvas.classList.toggle("is-touch-locked", state.graph.touchLocked);
}

function setGraphMode(mode) {
  const isSameMode = state.graph.mode === mode;
  state.graph.mode = isSameMode ? null : mode;
  state.graph.touchLocked = false;
  state.graph.points = [];
  state.graph.editPoints = [];
  state.graph.dragPointIndex = null;
  state.graph.hoverPoint = null;
  state.graph.dragTarget = null;
  state.graph.lockedBounds = null;

  const isDragMode = state.graph.mode === "drag";
  const isPointsMode = state.graph.mode === "points";
  elements.dragMode.setAttribute("aria-pressed", String(isDragMode));
  elements.pointsMode.setAttribute("aria-pressed", String(isPointsMode));
  elements.clearGraphMode.hidden = !state.graph.mode;
  elements.canvas.classList.toggle("is-interactive", Boolean(state.graph.mode));
  elements.canvas.classList.remove("is-dragging");
  elements.canvasCard.classList.toggle("is-editing", Boolean(state.graph.mode));
  elements.canvas.tabIndex = state.graph.mode ? 0 : -1;
  updateTouchEditing();

  if (isDragMode) {
    elements.graphModeHelp.textContent = "Arraste qualquer bolinha roxa. Alinhe as três para criar uma reta; retire qualquer uma do alinhamento para voltar à parábola.";
    elements.canvasBadge.hidden = false;
    elements.canvasBadge.textContent = "Arraste as bolinhas roxas";
    elements.canvas.setAttribute("aria-label", "Gráfico editável com três pontos. Pontos alinhados formam uma reta; pontos fora do alinhamento formam uma parábola.");
    updateGraphStatus("Modo contínuo ativo: alinhe os pontos para criar uma reta ou desalinhe para formar uma parábola.");
  } else if (isPointsMode) {
    elements.graphModeHelp.textContent = "Clique em três pontos da grade com valores de x diferentes. A equação que passa por eles será calculada.";
    elements.canvasBadge.hidden = false;
    elements.canvasBadge.textContent = "0 de 3 pontos";
    elements.canvas.setAttribute("aria-label", "Gráfico editável. Escolha três pontos cartesianos com valores de x diferentes.");
    updateGraphStatus("Escolha o primeiro ponto cartesiano no gráfico.");
  } else {
    elements.graphModeHelp.textContent = "Escolha um modo para manipular a parábola diretamente no plano cartesiano.";
    elements.canvasBadge.hidden = true;
    elements.canvas.removeAttribute("aria-label");
    updateGraphStatus("Modo de edição desativado.", false);
  }
  drawGraph(state.current);
}

function snapValue(value, step) {
  return normalizeZero(Math.round(value / step) * step);
}

function getGraphPointFromPointer(event, shouldSnap = true) {
  const transform = state.graph.transform;
  if (!transform) return null;
  const rect = elements.canvas.getBoundingClientRect();
  const canvasX = event.clientX - rect.left;
  const canvasY = event.clientY - rect.top;
  const { xMin, xMax, yMin, yMax } = transform.bounds;
  const rawX = transform.toGraphX(canvasX);
  const rawY = transform.toGraphY(canvasY);
  const boundedX = Math.min(xMax, Math.max(xMin, rawX));
  const boundedY = Math.min(yMax, Math.max(yMin, rawY));
  return {
    x: shouldSnap ? snapValue(boundedX, transform.xSnap) : boundedX,
    y: shouldSnap ? snapValue(boundedY, transform.ySnap) : boundedY,
    canvasX,
    canvasY
  };
}

function setCoefficientsFromGraph(a, b, c) {
  if (![a, b, c].every(Number.isFinite)) return false;
  const normalizedA = Math.abs(a) < 1e-8 ? 0 : a;
  elements.inputA.value = formatInputValue(normalizedA);
  elements.inputB.value = formatInputValue(b);
  elements.inputC.value = formatInputValue(c);
  elements.equationPreview.textContent = formatEquation(normalizedA, b, c);
  if (normalizedA === 0) {
    state.current = { a: 0, b, c };
    elements.formError.hidden = true;
    drawGraph(state.current);
    return true;
  }
  return calculateAndRender();
}

function applyGraphPreview({ a, b, c, badge }) {
  if (![a, b, c].every(Number.isFinite)) return;
  const normalizedA = Math.abs(a) < 1e-8 ? 0 : a;
  state.current = { a: normalizedA, b, c };
  elements.inputA.value = formatInputValue(normalizedA);
  elements.inputB.value = formatInputValue(b);
  elements.inputC.value = formatInputValue(c);
  elements.equationPreview.textContent = formatEquation(normalizedA, b, c);
  elements.canvasBadge.textContent = badge;
  drawGraph(state.current, { lightweight: true });
}

function queueGraphPreview(a, b, c, badge) {
  state.graph.pendingCoefficients = { a, b, c, badge };
  if (state.graph.animationFrame !== null) return;
  state.graph.animationFrame = requestAnimationFrame(() => {
    state.graph.animationFrame = null;
    const preview = state.graph.pendingCoefficients;
    state.graph.pendingCoefficients = null;
    if (preview) applyGraphPreview(preview);
  });
}

function flushGraphPreview() {
  if (state.graph.animationFrame !== null) {
    cancelAnimationFrame(state.graph.animationFrame);
    state.graph.animationFrame = null;
  }
  const preview = state.graph.pendingCoefficients;
  state.graph.pendingCoefficients = null;
  if (preview) applyGraphPreview(preview);
}

function solveQuadraticFromPoints(points) {
  const [p1, p2, p3] = points;
  const denominator1 = (p1.x - p2.x) * (p1.x - p3.x);
  const denominator2 = (p2.x - p1.x) * (p2.x - p3.x);
  const denominator3 = (p3.x - p1.x) * (p3.x - p2.x);
  if ([denominator1, denominator2, denominator3].some((value) => Math.abs(value) < 1e-10)) return null;

  const a = (p1.y / denominator1) + (p2.y / denominator2) + (p3.y / denominator3);
  const b = (-(p1.y * (p2.x + p3.x)) / denominator1)
    + (-(p2.y * (p1.x + p3.x)) / denominator2)
    + (-(p3.y * (p1.x + p2.x)) / denominator3);
  const c = ((p1.y * p2.x * p3.x) / denominator1)
    + ((p2.y * p1.x * p3.x) / denominator2)
    + ((p3.y * p1.x * p2.x) / denominator3);
  return { a: normalizeZero(a), b: normalizeZero(b), c: normalizeZero(c) };
}

function addGraphPoint(point) {
  if (state.graph.points.length === 3) state.graph.points = [];
  const repeatedX = state.graph.points.some((savedPoint) => Math.abs(savedPoint.x - point.x) < 1e-8);
  if (repeatedX) {
    updateGraphStatus(`Escolha outro valor de x: já existe um ponto com x = ${formatNumber(point.x)}.`);
    return;
  }

  state.graph.points.push({ x: point.x, y: point.y });
  elements.canvasBadge.textContent = `${state.graph.points.length} de 3 pontos`;
  if (state.graph.points.length < 3) {
    updateGraphStatus(`P${state.graph.points.length} = (${formatNumber(point.x)}; ${formatNumber(point.y)}). Escolha o próximo ponto.`);
    drawGraph(state.current);
    return;
  }

  const coefficients = solveQuadraticFromPoints(state.graph.points);
  if (!coefficients) {
    updateGraphStatus("Não foi possível formar uma função com esses pontos. Tente outra combinação.");
    elements.canvasBadge.textContent = "Tente 3 novos pontos";
    drawGraph(state.current);
    return;
  }

  if (Math.abs(coefficients.a) < 0.0001) coefficients.a = 0;
  setCoefficientsFromGraph(coefficients.a, coefficients.b, coefficients.c);
  elements.canvasBadge.textContent = "Equação criada ✓";
  updateGraphStatus(`${coefficients.a === 0 ? "Reta" : "Parábola"} criada: ${formatFunction(coefficients.a, coefficients.b, coefficients.c)}. Clique novamente para começar outra.`);
}

function handleCanvasPointerDown(event) {
  if (event.button === 1 && state.graph.transform) {
    event.preventDefault();
    state.graph.dragTarget = "pan";
    state.graph.panStart = {
      clientX: event.clientX,
      clientY: event.clientY,
      panX: state.graph.pan.x,
      panY: state.graph.pan.y,
      bounds: { ...state.graph.transform.bounds },
      plotSize: { ...state.graph.transform.plotSize }
    };
    elements.canvas.classList.add("is-panning");
    elements.canvas.setPointerCapture?.(event.pointerId);
    updateGraphStatus("Movendo o plano cartesiano…");
    return;
  }
  if (!state.graph.mode) return;
  if (event.pointerType === "touch" && !state.graph.touchLocked) return;
  const point = getGraphPointFromPointer(event, state.graph.mode === "points");
  if (!point) return;
  event.preventDefault();

  if (state.graph.mode === "points") {
    addGraphPoint(point);
    return;
  }

  const { editHandles, bounds } = state.graph.transform;
  const distances = editHandles.map((handle) => Math.hypot(point.canvasX - handle.canvasX, point.canvasY - handle.canvasY));
  const closestDistance = Math.min(...distances);
  const closestIndex = distances.indexOf(closestDistance);
  if (closestDistance <= 24) {
    state.graph.dragTarget = "shape-point";
    state.graph.dragPointIndex = closestIndex;
    updateGraphStatus(`Movendo o ponto ${closestIndex + 1}… alinhe ou desalinhe livremente.`);
  } else {
    updateGraphStatus("Aproxime o cursor de uma bolinha roxa para alterar a curva.");
    return;
  }

  state.graph.lockedBounds = { ...bounds };
  elements.canvas.classList.add("is-dragging");
  elements.canvas.setPointerCapture?.(event.pointerId);
}

function handleCanvasPointerMove(event) {
  if (state.graph.dragTarget === "pan" && state.graph.panStart) {
    event.preventDefault();
    const start = state.graph.panStart;
    const deltaX = event.clientX - start.clientX;
    const deltaY = event.clientY - start.clientY;
    const rangeX = start.bounds.xMax - start.bounds.xMin;
    const rangeY = start.bounds.yMax - start.bounds.yMin;
    state.graph.pan.x = start.panX - ((deltaX / start.plotSize.width) * rangeX);
    state.graph.pan.y = start.panY + ((deltaY / start.plotSize.height) * rangeY);
    if (state.graph.zoomAnimationFrame === null) {
      state.graph.zoomAnimationFrame = requestAnimationFrame(() => {
        state.graph.zoomAnimationFrame = null;
        drawGraph(state.current, { lightweight: true });
      });
    }
    return;
  }
  if (event.pointerType === "touch" && !state.graph.touchLocked) return;
  if (!state.graph.mode) return;
  const point = getGraphPointFromPointer(event, state.graph.mode === "points");
  if (!point) return;

  if (state.graph.mode === "points") {
    state.graph.hoverPoint = { x: point.x, y: point.y };
    drawGraph(state.current);
    return;
  }
  if (!state.graph.dragTarget) return;

  event.preventDefault();
  if (state.graph.dragTarget !== "shape-point" || state.graph.dragPointIndex === null) return;
  const movedIndex = state.graph.dragPointIndex;
  const nextPoints = state.graph.editPoints.map((savedPoint) => ({ ...savedPoint }));
  const minimumXGap = (state.graph.transform.bounds.xMax - state.graph.transform.bounds.xMin)
    * (18 / state.graph.transform.plotSize.width);
  const xIsTooClose = nextPoints.some((savedPoint, index) => index !== movedIndex && Math.abs(savedPoint.x - point.x) < minimumXGap);
  const candidateX = xIsTooClose ? nextPoints[movedIndex].x : point.x;
  let candidateY = point.y;
  const fixedPoints = nextPoints.filter((_, index) => index !== movedIndex);
  const alignedY = fixedPoints[0].y
    + ((candidateX - fixedPoints[0].x) * (fixedPoints[1].y - fixedPoints[0].y)
      / (fixedPoints[1].x - fixedPoints[0].x));
  const alignmentDistance = Math.abs(
    state.graph.transform.toCanvasY(candidateY) - state.graph.transform.toCanvasY(alignedY)
  );
  if (alignmentDistance <= 10) candidateY = alignedY;
  nextPoints[movedIndex] = {
    x: candidateX,
    y: candidateY
  };
  const coefficients = solveQuadraticFromPoints(nextPoints);
  if (!coefficients) return;
  if (Math.abs(coefficients.a) < 0.00001) coefficients.a = 0;
  state.graph.editPoints = nextPoints;
  queueGraphPreview(
    coefficients.a,
    coefficients.b,
    coefficients.c,
    `P${movedIndex + 1} (${formatNumber(nextPoints[movedIndex].x)}; ${formatNumber(nextPoints[movedIndex].y)})`
  );
}

function handleCanvasPointerUp(event) {
  if (!state.graph.dragTarget) return;
  if (state.graph.dragTarget === "pan") {
    elements.canvas.releasePointerCapture?.(event.pointerId);
    state.graph.dragTarget = null;
    state.graph.panStart = null;
    elements.canvas.classList.remove("is-panning");
    drawGraph(state.current);
    updateGraphStatus("Plano reposicionado. Use a roda para aproximar ou afastar.");
    return;
  }
  flushGraphPreview();
  elements.canvas.releasePointerCapture?.(event.pointerId);
  state.graph.dragTarget = null;
  state.graph.dragPointIndex = null;
  state.graph.lockedBounds = null;
  elements.canvas.classList.remove("is-dragging");
  elements.canvasBadge.textContent = "Arraste as bolinhas roxas";
  if (Math.abs(state.current.a) < 1e-8) {
    setCoefficientsFromGraph(0, state.current.b, state.current.c);
    updateGraphStatus(`Reta atualizada: ${formatFunction(0, state.current.b, state.current.c)}.`);
  } else {
    calculateAndRender();
    updateGraphStatus(`Parábola atualizada: ${formatFunction(state.current.a, state.current.b, state.current.c)}.`);
  }
}

function handleCanvasKeyboard(event) {
  if (state.graph.mode !== "drag" || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
  event.preventDefault();
  if (state.graph.editPoints.length !== 3) return;
  const points = state.graph.editPoints.map((point) => ({ ...point }));
  const selectedPoint = points[1];
  const baseStep = event.shiftKey ? 0.5 : 1;
  if (event.key === "ArrowLeft") selectedPoint.x -= baseStep;
  if (event.key === "ArrowRight") selectedPoint.x += baseStep;
  if (event.key === "ArrowUp") selectedPoint.y += baseStep;
  if (event.key === "ArrowDown") selectedPoint.y -= baseStep;
  if (Math.abs(selectedPoint.x - points[0].x) < 0.01 || Math.abs(selectedPoint.x - points[2].x) < 0.01) return;
  const coefficients = solveQuadraticFromPoints(points);
  if (!coefficients) return;
  if (Math.abs(coefficients.a) < 0.00001) coefficients.a = 0;
  state.graph.editPoints = points;
  setCoefficientsFromGraph(coefficients.a, coefficients.b, coefficients.c);
  updateGraphStatus(`P2 movido pelo teclado. ${coefficients.a === 0 ? "Os pontos estão alinhados: reta formada." : "Os pontos formam uma parábola."}`);
}

function setGraphZoom(percent, { announce = true, focusPoint = null } = {}) {
  const safePercent = Math.min(5000, Math.max(1, percent));
  const nextZoom = safePercent / 100;

  if (focusPoint && state.graph.transform) {
    const transform = state.graph.transform;
    const horizontalRatio = (focusPoint.canvasX - transform.padding.left) / transform.plotSize.width;
    const verticalRatio = (focusPoint.canvasY - transform.padding.top) / transform.plotSize.height;
    const nextRangeX = transform.naturalSize.width / nextZoom;
    const nextRangeY = transform.naturalSize.height / nextZoom;
    const nextCenterX = focusPoint.x - ((horizontalRatio - 0.5) * nextRangeX);
    const nextCenterY = focusPoint.y - ((0.5 - verticalRatio) * nextRangeY);
    state.graph.pan.x = nextCenterX - transform.naturalCenter.x;
    state.graph.pan.y = nextCenterY - transform.naturalCenter.y;
  }

  state.graph.zoom = nextZoom;
  if (!state.graph.dragTarget) state.graph.lockedBounds = null;

  if (state.graph.zoomAnimationFrame === null) {
    state.graph.zoomAnimationFrame = requestAnimationFrame(() => {
      state.graph.zoomAnimationFrame = null;
      drawGraph(state.current, { lightweight: Boolean(state.graph.dragTarget) });
    });
  }
  if (announce) updateGraphStatus(`Zoom do gráfico: ${Math.round(safePercent)}%. ${safePercent > 100 ? "Visualização aproximada." : safePercent < 100 ? "Visualização afastada." : "Escala restaurada."}`);
}

function handleGraphWheel(event) {
  event.preventDefault();
  const focusPoint = getGraphPointFromPointer(event, false);
  const factor = event.deltaY < 0 ? 1.12 : (1 / 1.12);
  setGraphZoom((state.graph.zoom * 100) * factor, { announce: false, focusPoint });
  if (state.graph.mode) {
    elements.canvasBadge.hidden = false;
    elements.canvasBadge.textContent = `Zoom ${Math.round(state.graph.zoom * 100)}%`;
  }
}

function resetGraphView() {
  state.graph.zoom = 1;
  state.graph.pan = { x: 0, y: 0 };
  state.graph.lockedBounds = null;
  drawGraph(state.current);
  updateGraphStatus("Visão centralizada e zoom restaurado para 100%.");
}

function applyGraphEquation({ showErrors = true } = {}) {
  const parsed = parsePolynomialExpression(elements.graphEquationInput.value);
  elements.graphEquationFeedback.classList.remove("is-error", "is-success");

  if (!parsed.valid) {
    elements.graphEquationInput.setAttribute("aria-invalid", "true");
    if (showErrors) {
      elements.graphEquationFeedback.textContent = parsed.message;
      elements.graphEquationFeedback.classList.add("is-error");
    }
    return false;
  }

  const { a, b, c } = parsed.values;
  elements.graphEquationInput.removeAttribute("aria-invalid");
  state.graph.zoom = 1;
  state.graph.pan = { x: 0, y: 0 };
  state.graph.lockedBounds = null;
  state.graph.editPoints = [];
  setCoefficientsFromGraph(a, b, c);
  const functionType = Math.abs(a) < 1e-8 ? "reta" : "parábola";
  elements.graphEquationFeedback.textContent = `${functionType === "reta" ? "Reta" : "Parábola"} gerada: ${formatFunction(a, b, c)}.`;
  elements.graphEquationFeedback.classList.add("is-success");
  updateGraphStatus(`${functionType === "reta" ? "Reta" : "Parábola"} criada a partir da equação digitada.`);
  return true;
}

function calculateAndRender({ scroll = false } = {}) {
  const validation = validateInputs();
  if (!validation.valid) {
    elements.formError.textContent = validation.message;
    elements.formError.hidden = false;
    elements.inputA.setAttribute("aria-invalid", String(Math.abs(parseNumber(elements.inputA.value)) < 1e-12 || !Number.isFinite(parseNumber(elements.inputA.value))));
    return false;
  }

  elements.formError.hidden = true;
  [elements.inputA, elements.inputB, elements.inputC].forEach((input) => input.removeAttribute("aria-invalid"));
  const { a, b, c } = validation.values;
  const discriminant = calculateDiscriminant(a, b, c);
  const roots = calculateRoots(a, b, discriminant);
  state.current = { a, b, c };

  renderSteps({ a, b, c, discriminant, roots });
  renderStatus(discriminant);
  renderAnswer({ a, b, c }, roots);
  drawGraph({ a, b, c });
  state.activeStep = 0;

  if (scroll) document.querySelector("#delta").scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

function showNextStep() {
  const steps = [...document.querySelectorAll(".step-card")];
  state.activeStep = (state.activeStep + 1) % steps.length;
  steps.forEach((step, index) => { step.open = index === state.activeStep; });
  steps[state.activeStep].scrollIntoView({ behavior: "smooth", block: "center" });
  elements.nextStep.firstChild.textContent = state.activeStep === steps.length - 1 ? "Recomeçar  " : "Próximo passo  ";
}

function setExample(button) {
  elements.inputA.value = button.dataset.a;
  elements.inputB.value = button.dataset.b;
  elements.inputC.value = button.dataset.c;
  updateEquation();
  calculateAndRender({ scroll: true });
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateExercise() {
  const a = Math.random() < 0.75 ? 1 : 2;
  const root1 = randomInteger(-6, 6);
  let root2 = randomInteger(-6, 6);
  if (Math.random() < 0.8) {
    while (root2 === root1) root2 = randomInteger(-6, 6);
  } else {
    root2 = root1;
  }
  const b = -a * (root1 + root2);
  const c = a * root1 * root2;
  const discriminant = calculateDiscriminant(a, b, c);
  const roots = calculateRoots(a, b, discriminant);
  state.exercise = { a, b, c, discriminant, roots };
  elements.exerciseEquation.textContent = formatEquation(a, b, c);
  [elements.answerDelta, elements.answerX1, elements.answerX2].forEach((input) => {
    input.value = "";
    input.removeAttribute("aria-invalid");
  });
  [elements.answerDeltaHint, elements.answerX1Hint, elements.answerX2Hint].forEach((hint) => {
    hint.hidden = true;
    hint.textContent = "";
  });
  elements.exerciseFeedback.hidden = true;
  elements.answerX2.closest("label").hidden = roots.length === 1;
  elements.answerX1.closest("label").querySelector("span:first-child").textContent = roots.length === 1 ? "Qual é a raiz dupla?" : "Qual é x₁?";
}

function approximatelyEqual(value, expected) {
  return Number.isFinite(value) && Math.abs(value - expected) <= 0.005;
}

function checkExercise(event) {
  event.preventDefault();
  const deltaAnswer = parseNumber(elements.answerDelta.value);
  const x1Answer = parseNumber(elements.answerX1.value);
  const x2Answer = parseNumber(elements.answerX2.value);
  const { discriminant, roots } = state.exercise;
  const deltaCorrect = approximatelyEqual(deltaAnswer, discriminant);
  const x1Correct = approximatelyEqual(x1Answer, roots[0]);
  const x2Correct = roots.length === 1 || approximatelyEqual(x2Answer, roots[1]);
  state.score.attempts += 1;

  [
    [elements.answerDelta, elements.answerDeltaHint, deltaCorrect, "Confira Δ = b² − 4ac."],
    [elements.answerX1, elements.answerX1Hint, x1Correct, "Use +√Δ no numerador de x₁."],
    [elements.answerX2, elements.answerX2Hint, x2Correct, "Use −√Δ no numerador de x₂."]
  ].forEach(([input, hint, correct, message]) => {
    input.setAttribute("aria-invalid", String(!correct));
    hint.hidden = correct || input.closest("label").hidden;
    hint.textContent = hint.hidden ? "" : message;
  });

  elements.exerciseFeedback.hidden = false;
  if (deltaCorrect && x1Correct && x2Correct) {
    state.score.correct += 1;
    elements.exerciseFeedback.className = "feedback success";
    elements.exerciseFeedback.textContent = "Correto! Você calculou delta e as raízes com precisão.";
  } else {
    elements.exerciseFeedback.className = "feedback hint";
    if (!deltaCorrect) {
      elements.exerciseFeedback.textContent = "Quase! Confira primeiro o cálculo de Δ = b² − 4ac; um sinal pode ter mudado o restante.";
    } else if (!x1Correct) {
      elements.exerciseFeedback.textContent = "Delta está certo! Revise x₁: use o sinal + antes de √Δ e divida todo o numerador por 2a.";
    } else {
      elements.exerciseFeedback.textContent = "Você acertou delta e x₁! Em x₂, use o sinal − antes de √Δ e divida todo o numerador por 2a.";
    }
  }
  updateScore();
  saveScore();
}

function updateScore() {
  elements.correctCount.textContent = state.score.correct;
  elements.attemptCount.textContent = state.score.attempts;
  if (state.score.correct === 0) {
    elements.scoreMessage.textContent = "Cada tentativa faz parte do aprendizado.";
  } else if (state.score.correct === state.score.attempts) {
    elements.scoreMessage.textContent = "Excelente! Você acertou todas até agora.";
  } else {
    elements.scoreMessage.textContent = "Continue: reveja as pistas e tente outra equação.";
  }
}

function setupProgressObserver() {
  const sections = ["conceito", "delta", "bhaskara", "grafico", "pratica"]
    .map((id) => document.getElementById(id));
  const links = document.querySelectorAll(".progress-item");
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.section === visible.target.id));
  }, { rootMargin: "-25% 0px -60%", threshold: [0, 0.15, 0.4] });
  sections.forEach((section) => observer.observe(section));
}

let resizeFrame;
let equationInputTimer;
function handleResize() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => drawGraph(state.current));
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateAndRender({ scroll: true });
});
[elements.inputA, elements.inputB, elements.inputC].forEach((input) => input.addEventListener("input", updateEquation));
document.querySelectorAll(".example-button").forEach((button) => button.addEventListener("click", () => setExample(button)));
elements.nextStep.addEventListener("click", showNextStep);
elements.exerciseForm.addEventListener("submit", checkExercise);
[
  [elements.answerDelta, elements.answerDeltaHint],
  [elements.answerX1, elements.answerX1Hint],
  [elements.answerX2, elements.answerX2Hint]
].forEach(([input, hint]) => input.addEventListener("input", () => {
  input.removeAttribute("aria-invalid");
  hint.hidden = true;
  hint.textContent = "";
}));
elements.newExercise.addEventListener("click", generateExercise);
elements.graphEquationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearTimeout(equationInputTimer);
  applyGraphEquation();
});
elements.graphEquationInput.addEventListener("input", () => {
  clearTimeout(equationInputTimer);
  elements.graphEquationFeedback.classList.remove("is-error", "is-success");
  elements.graphEquationFeedback.textContent = "Aguardando uma função completa…";
  equationInputTimer = setTimeout(() => applyGraphEquation(), 550);
});
elements.graphEquationInput.addEventListener("blur", () => {
  const parsed = parsePolynomialExpression(elements.graphEquationInput.value);
  if (parsed.valid) elements.graphEquationInput.value = formatFunction(parsed.values.a, parsed.values.b, parsed.values.c);
});
elements.dragMode.addEventListener("click", () => setGraphMode("drag"));
elements.pointsMode.addEventListener("click", () => setGraphMode("points"));
elements.clearGraphMode.addEventListener("click", () => setGraphMode(null));
elements.touchEditToggle.addEventListener("click", () => {
  state.graph.touchLocked = !state.graph.touchLocked;
  updateTouchEditing();
  updateGraphStatus(state.graph.touchLocked
    ? "Toque no gráfico ativado. Para rolar a página novamente, toque em ‘Voltar a rolar a página’."
    : "Rolagem da página ativada. O gráfico não será alterado por toques acidentais.");
});
coarsePointer.addEventListener?.("change", updateTouchEditing);
elements.canvas.addEventListener("pointerdown", handleCanvasPointerDown);
elements.canvas.addEventListener("pointermove", handleCanvasPointerMove);
elements.canvas.addEventListener("pointerup", handleCanvasPointerUp);
elements.canvas.addEventListener("pointercancel", handleCanvasPointerUp);
elements.canvas.addEventListener("pointerleave", () => {
  if (state.graph.mode === "points" && state.graph.hoverPoint) {
    state.graph.hoverPoint = null;
    drawGraph(state.current);
  }
});
elements.canvas.addEventListener("keydown", handleCanvasKeyboard);
elements.canvas.addEventListener("wheel", handleGraphWheel, { passive: false });
elements.canvas.addEventListener("auxclick", (event) => {
  if (event.button === 1) event.preventDefault();
});
elements.resetView.addEventListener("click", resetGraphView);
elements.zoomIn.addEventListener("click", () => setGraphZoom(state.graph.zoom * 125));
elements.zoomOut.addEventListener("click", () => setGraphZoom(state.graph.zoom * 80));
window.addEventListener("resize", handleResize);

loadScore();
updateScore();
updateTouchEditing();
calculateAndRender();
generateExercise();
setupProgressObserver();
