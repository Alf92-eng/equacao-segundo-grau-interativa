"use strict";

const DEG_TO_RAD = Math.PI / 180;
const SVG_ORIGIN = { x: 60, y: 290 };
const SVG_RADIUS = 220;

function parseNumber(raw) {
  const value = String(raw).trim();
  if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(value)) return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseAnswer(raw) {
  const parts = String(raw).trim().split("/");
  if (parts.length > 2) return null;
  const numerator = parseNumber(parts[0]);
  if (numerator === null) return null;
  if (parts.length === 1) return numerator;
  const denominator = parseNumber(parts[1]);
  return denominator === null || denominator === 0 ? null : numerator / denominator;
}

function validateInputs(angleRaw, hypotenuseRaw) {
  const angle = parseNumber(angleRaw);
  const hypotenuse = parseNumber(hypotenuseRaw);
  const errors = { angle: "", hypotenuse: "" };
  if (angle === null) errors.angle = "Escreva um ângulo numérico, como 30 ou 45,5.";
  else if (angle < 0.1 || angle > 89.9) errors.angle = "Use um ângulo de 0,1° a 89,9° nesta figura.";
  if (hypotenuse === null) errors.hypotenuse = "Escreva um comprimento numérico, como 10 ou 8,5.";
  else if (hypotenuse < 0.01 || hypotenuse > 10000) errors.hypotenuse = "Use um comprimento de 0,01 a 10.000 unidades.";
  return { valid: !errors.angle && !errors.hypotenuse, angle, hypotenuse, errors };
}

function calculate(angle, hypotenuse) {
  const radians = angle * DEG_TO_RAD;
  const sine = Math.sin(radians);
  const cosine = Math.cos(radians);
  return {
    angle, hypotenuse,
    opposite: hypotenuse * sine,
    adjacent: hypotenuse * cosine,
    sine, cosine,
    tangent: sine / cosine
  };
}

function rounded(value, digits) {
  const multiplier = 10 ** digits;
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

function formatNumber(value, digits = 4, approx = false) {
  const shown = rounded(value, digits);
  const text = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits }).format(shown);
  return `${approx && Math.abs(value - shown) > 1e-9 ? "≈ " : ""}${text}`;
}

function formatLength(value) {
  const absolute = Math.abs(value);
  const digits = absolute >= 1 ? 2 : absolute >= 0.01 ? 4 : 8;
  return formatNumber(value, digits, true);
}

function formatSideLabel(letter, value) {
  const formatted = formatLength(value);
  return formatted.startsWith("≈ ") ? `${letter} ${formatted}` : `${letter} = ${formatted}`;
}

function formatAngleCompact(value) {
  return `${formatNumber(value, 2, true)}°`;
}

function formatAngleWords(value) {
  const compact = formatAngleCompact(value);
  return compact.startsWith("≈ ") ? `aproximadamente ${compact.slice(2)}` : compact;
}

function formatLengthRelation(value) {
  const formatted = formatLength(value);
  return formatted.startsWith("≈ ") ? formatted : `= ${formatted}`;
}

function formatDivision(numerator, denominator, result) {
  const top = formatLength(numerator);
  const bottom = formatLength(denominator);
  const answer = formatNumber(result, 4, true);
  const approxInputs = top.startsWith("≈ ") || bottom.startsWith("≈ ");
  const clean = text => text.replace(/^≈ /, "");
  return `${approxInputs ? "≈" : "="} ${clean(top)} ÷ ${clean(bottom)} ${answer.startsWith("≈ ") || approxInputs ? "≈" : "="} ${clean(answer)}`;
}

window.TrigMath = Object.freeze({ parseNumber, parseAnswer, validateInputs, calculate });

function initPage() {
  const byId = id => document.getElementById(id);
  const angleInput = byId("angle-input");
  const hypotenuseInput = byId("hypotenuse-input");
  const angleRange = byId("angle-range");
  const triangle = byId("triangle-svg");
  const hit = byId("triangle-hit");
  const point = byId("triangle-point");
  const editToggle = byId("edit-toggle");
  const steps = [...document.querySelectorAll(".step-item")];
  const state = { angle: 30, hypotenuse: 10, editMode: false, dragging: false, currentQuestion: 0, solvedInVisit: new Set(), score: readScore() };
  let announcementTimer;

  function sizeDragHandle() {
    const matrix = triangle.getScreenCTM();
    if (!matrix) return;
    const scale = Math.hypot(matrix.a, matrix.b);
    if (!scale) return;
    point.setAttribute("r", String(6 / scale));
    point.setAttribute("stroke-width", String(2 / scale));
    hit.setAttribute("r", String(22 / scale));
  }

  function renderValidation(check) {
    byId("angle-error").textContent = check.errors.angle;
    byId("hypotenuse-error").textContent = check.errors.hypotenuse;
    angleInput.setAttribute("aria-invalid", String(Boolean(check.errors.angle)));
    hypotenuseInput.setAttribute("aria-invalid", String(Boolean(check.errors.hypotenuse)));
    byId("lab-status").hidden = check.valid;
    byId("result-content").hidden = !check.valid;
    triangle.style.opacity = check.valid ? "1" : ".38";
    byId("lab-status").textContent = check.valid ? "" : "Corrija os campos indicados para atualizar a figura e as contas.";
    byId("next-step").disabled = !check.valid;
    if (!check.valid) {
      clearTimeout(announcementTimer);
      byId("lab-announcement").textContent = "";
      const note = "Os valores digitados ainda não formam um triângulo válido. A figura esmaecida mostra o último exemplo válido.";
      byId("triangle-desc").textContent = note;
      byId("visual-description").textContent = note;
    }
  }

  function renderTriangle(data) {
    const theta = data.angle * DEG_TO_RAD;
    const x = SVG_ORIGIN.x + SVG_RADIUS * data.cosine;
    const y = SVG_ORIGIN.y - SVG_RADIUS * data.sine;
    const ox = SVG_ORIGIN.x;
    const oy = SVG_ORIGIN.y;
    byId("triangle-fill").setAttribute("d", `M ${ox} ${oy} L ${x} ${oy} L ${x} ${y} Z`);
    const corner = Math.min(14, (x - ox) / 3, (oy - y) / 3);
    byId("triangle-right").setAttribute("d", `M ${x - corner} ${oy} L ${x - corner} ${oy - corner} L ${x} ${oy - corner}`);
    const arcRadius = 35;
    const arcEndX = ox + arcRadius * Math.cos(theta);
    const arcEndY = oy - arcRadius * Math.sin(theta);
    byId("triangle-angle").setAttribute("d", `M ${ox + arcRadius} ${oy} A ${arcRadius} ${arcRadius} 0 0 0 ${arcEndX} ${arcEndY}`);
    const angleLabel = byId("label-angle");
    angleLabel.setAttribute("x", ox + 46 * Math.cos(theta / 2));
    angleLabel.setAttribute("y", oy - 46 * Math.sin(theta / 2));
    angleLabel.textContent = formatAngleCompact(data.angle);
    const adjacentLabel = byId("label-adjacent");
    adjacentLabel.setAttribute("x", Math.max(118, (ox + x) / 2));
    adjacentLabel.setAttribute("y", 316);
    adjacentLabel.setAttribute("text-anchor", "middle");
    adjacentLabel.textContent = formatSideLabel("A", data.adjacent);
    adjacentLabel.style.visibility = x - ox < 50 ? "hidden" : "visible";
    const oppositeLabel = byId("label-opposite");
    oppositeLabel.setAttribute("x", Math.min(293, x + 12));
    oppositeLabel.setAttribute("y", Math.max(80, (oy + y) / 2));
    oppositeLabel.textContent = formatSideLabel("O", data.opposite);
    oppositeLabel.style.visibility = oy - y < 50 ? "hidden" : "visible";
    const hypotenuseLabel = byId("label-hypotenuse");
    const hypotenuseLabelX = (ox + x) / 2 - 15 * data.sine;
    const hypotenuseLabelY = (oy + y) / 2 - 15 * data.cosine;
    hypotenuseLabel.setAttribute("x", hypotenuseLabelX);
    hypotenuseLabel.setAttribute("y", hypotenuseLabelY);
    hypotenuseLabel.setAttribute("text-anchor", "middle");
    hypotenuseLabel.setAttribute("dominant-baseline", "middle");
    hypotenuseLabel.setAttribute("transform", `rotate(${-data.angle} ${hypotenuseLabelX} ${hypotenuseLabelY})`);
    hypotenuseLabel.textContent = formatSideLabel("H", data.hypotenuse);
    point.setAttribute("cx", x);
    point.setAttribute("cy", y);
    hit.setAttribute("cx", x);
    hit.setAttribute("cy", y);
    hit.setAttribute("aria-valuenow", String(rounded(data.angle, 1)));
    hit.setAttribute("aria-valuetext", formatAngleWords(data.angle));
    const description = `Triângulo retângulo com ângulo θ de ${formatAngleWords(data.angle)} e hipotenusa de ${formatLength(data.hypotenuse)} unidades. O cateto oposto mede ${formatLength(data.opposite)} e o adjacente mede ${formatLength(data.adjacent)} unidades.`;
    byId("triangle-desc").textContent = description;
    byId("visual-description").textContent = description;
  }

  function renderResults(data) {
    byId("opposite-value").textContent = formatLength(data.opposite);
    byId("adjacent-value").textContent = formatLength(data.adjacent);
    byId("sine-value").textContent = formatNumber(data.sine, 4, true);
    byId("cosine-value").textContent = formatNumber(data.cosine, 4, true);
    byId("tangent-value").textContent = formatNumber(data.tangent, 4, true);
    byId("result-meaning").textContent = `Para θ de ${formatAngleWords(data.angle)}, o cateto oposto mede ${formatNumber(data.sine * 100, 1, true)}% da hipotenusa. A tangente compara o cateto oposto com o adjacente.`;
    byId("identity-proof").textContent = `${formatNumber(data.sine, 4)}² + ${formatNumber(data.cosine, 4)}² ≈ 1. Com valores completos, a soma é 1.`;
    byId("step-one").textContent = `Você escolheu θ = ${formatNumber(data.angle, 8)}° e hipotenusa H = ${formatLength(data.hypotenuse)} unidades. O cateto oposto (O) fica em frente a θ; o adjacente (A) toca θ.`;
    byId("step-two").textContent = `O = H × sen θ = ${formatLength(data.hypotenuse)} × sen ${formatNumber(data.angle, 8)}° ${formatLengthRelation(data.opposite)}. A = H × cos θ = ${formatLength(data.hypotenuse)} × cos ${formatNumber(data.angle, 8)}° ${formatLengthRelation(data.adjacent)} unidades.`;
    byId("step-three").textContent = `sen θ = O/H ${formatDivision(data.opposite, data.hypotenuse, data.sine)}. cos θ = A/H ${formatDivision(data.adjacent, data.hypotenuse, data.cosine)}. tg θ = O/A ${formatDivision(data.opposite, data.adjacent, data.tangent)}.`;
    byId("step-four").textContent = `Ao manter θ e mudar apenas H, os comprimentos mudam, mas as razões continuam iguais. Para este triângulo, O é ${formatNumber(data.sine * 100, 1, true)}% de H.`;
  }

  function updateLab() {
    const check = validateInputs(angleInput.value, hypotenuseInput.value);
    renderValidation(check);
    if (!check.valid) return;
    state.angle = check.angle;
    state.hypotenuse = check.hypotenuse;
    angleRange.value = String(check.angle);
    const data = calculate(check.angle, check.hypotenuse);
    renderTriangle(data);
    renderResults(data);
    updateActivePreset();
    clearTimeout(announcementTimer);
    announcementTimer = setTimeout(() => {
      byId("lab-announcement").textContent = `Ângulo ${formatAngleWords(data.angle)}. Cateto oposto ${formatLength(data.opposite)} e adjacente ${formatLength(data.adjacent)} unidades.`;
    }, 550);
  }

  function updateActivePreset() {
    document.querySelectorAll("[data-angle]").forEach(button => {
      const sameAngle = Math.abs(Number(button.dataset.angle) - state.angle) < 0.0001;
      const sameH = Math.abs(Number(button.dataset.hypotenuse) - state.hypotenuse) < 0.0001;
      button.classList.toggle("active", sameAngle && sameH);
    });
  }

  function applyValues(angle, hypotenuse) {
    angleInput.value = String(rounded(angle, 8)).replace(".", ",");
    hypotenuseInput.value = String(hypotenuse).replace(".", ",");
    updateLab();
  }

  function angleFromPointer(event) {
    const svgPoint = triangle.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    const pointInSvg = svgPoint.matrixTransform(triangle.getScreenCTM().inverse());
    const radians = Math.atan2(SVG_ORIGIN.y - pointInSvg.y, pointInSvg.x - SVG_ORIGIN.x);
    return Math.max(0.1, Math.min(89.9, radians / DEG_TO_RAD));
  }

  angleInput.addEventListener("input", updateLab);
  hypotenuseInput.addEventListener("input", updateLab);
  angleRange.addEventListener("input", () => { angleInput.value = angleRange.value.replace(".", ","); updateLab(); });
  document.querySelectorAll("[data-angle]").forEach(button => button.addEventListener("click", () => applyValues(Number(button.dataset.angle), Number(button.dataset.hypotenuse))));
  document.querySelectorAll("[data-table-angle]").forEach(button => button.addEventListener("click", () => {
    applyValues(Number(button.dataset.tableAngle), state.hypotenuse);
    byId("laboratorio").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    angleInput.focus({ preventScroll: true });
  }));
  editToggle.addEventListener("click", () => {
    state.editMode = !state.editMode;
    editToggle.setAttribute("aria-pressed", String(state.editMode));
    editToggle.textContent = state.editMode ? "Voltar a rolar" : "Ativar arraste";
    triangle.classList.toggle("editing", state.editMode);
    byId("drag-help").textContent = state.editMode ? "Arraste o ponto com o dedo. Toque em ‘Voltar a rolar’ para navegar pela página." : "Ative o arraste para mover o ponto com o dedo. Use as setas do teclado quando o ponto estiver em foco.";
  });
  hit.addEventListener("pointerdown", event => {
    if (event.pointerType !== "mouse" && !state.editMode) return;
    if (!validateInputs(angleInput.value, hypotenuseInput.value).valid) return;
    state.dragging = true;
    triangle.classList.add("dragging");
    hit.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  hit.addEventListener("pointermove", event => {
    if (!state.dragging) return;
    angleInput.value = String(rounded(angleFromPointer(event), 1)).replace(".", ",");
    updateLab();
  });
  function endDrag() { state.dragging = false; triangle.classList.remove("dragging"); }
  hit.addEventListener("pointerup", endDrag);
  hit.addEventListener("pointercancel", endDrag);
  hit.addEventListener("lostpointercapture", endDrag);
  hit.addEventListener("keydown", event => {
    const direction = event.key === "ArrowUp" || event.key === "ArrowRight" ? 1 : event.key === "ArrowDown" || event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    angleInput.value = String(rounded(Math.max(0.1, Math.min(89.9, state.angle + direction * (event.shiftKey ? 5 : 1))), 1)).replace(".", ",");
    updateLab();
  });
  byId("next-step").addEventListener("click", () => {
    const next = steps.find(item => !item.open);
    if (next) { next.open = true; next.querySelector("summary").focus(); }
    else { steps.forEach((item, index) => { item.open = index === 0; }); steps[0].querySelector("summary").focus(); }
  });

  const questions = [
    { title: "Encontre as razões", prompt: "Em um triângulo retângulo, em relação a θ, o cateto oposto mede 3, o adjacente mede 4 e a hipotenusa mede 5.", sketch: ["3", "4", "5"], sides: [3, 4], fields: [
      { label: "sen θ", expected: 3 / 5, hint: "Seno usa oposto ÷ hipotenusa: 3 ÷ 5.", tolerance: 0.0005 },
      { label: "cos θ", expected: 4 / 5, hint: "Cosseno usa adjacente ÷ hipotenusa: 4 ÷ 5.", tolerance: 0.0005 },
      { label: "tg θ", expected: 3 / 4, hint: "Tangente usa oposto ÷ adjacente: 3 ÷ 4.", tolerance: 0.0005 }
    ] },
    { title: "Troque os comprimentos", prompt: "Agora o cateto oposto mede 5, o adjacente mede 12 e a hipotenusa mede 13. Calcule as três razões para θ.", sketch: ["5", "12", "13"], sides: [5, 12], fields: [
      { label: "sen θ", expected: 5 / 13, hint: "Seno compara 5 com 13. Escreva 5/13 ou um decimal próximo.", tolerance: 0.001 },
      { label: "cos θ", expected: 12 / 13, hint: "Cosseno compara 12 com 13: 12 ÷ 13.", tolerance: 0.001 },
      { label: "tg θ", expected: 5 / 12, hint: "Tangente compara os catetos: 5 ÷ 12.", tolerance: 0.001 }
    ] },
    { title: "Uma rampa de 30°", prompt: "Uma rampa de 10 m faz 30° com o chão. Encontre a altura alcançada (cateto oposto), o avanço horizontal (adjacente) e sen 30°. Para o avanço, aproxime a duas casas decimais.", sketch: ["?", "?", "10 m"], sides: [5, 5 * Math.sqrt(3)], fields: [
      { label: "Altura (m)", expected: 5, hint: "sen 30° = 1/2. Então a altura é 10 × 1/2.", tolerance: 0.001 },
      { label: "Avanço (m)", expected: 5 * Math.sqrt(3), hint: "cos 30° = √3/2. Multiplique por 10: 5√3 ≈ 8,66 m.", tolerance: 0.005 },
      { label: "sen 30°", expected: 0.5, hint: "Divida o cateto oposto pela hipotenusa: 5 ÷ 10.", tolerance: 0.001 }
    ] }
  ];

  function readScore() {
    try {
      const saved = JSON.parse(localStorage.getItem("trigonometria-score-v1") || "null");
      if (saved && Number.isSafeInteger(saved.correct) && Number.isSafeInteger(saved.attempts) && saved.correct >= 0 && saved.attempts >= 0) return saved;
    } catch (_) { /* O exercício funciona sem armazenamento. */ }
    return { correct: 0, attempts: 0 };
  }

  function saveScore() {
    try { localStorage.setItem("trigonometria-score-v1", JSON.stringify(state.score)); }
    catch (_) { /* O exercício funciona sem armazenamento. */ }
  }

  function renderScore() {
    byId("score").textContent = `${state.score.correct} ${state.score.correct === 1 ? "acerto" : "acertos"} · ${state.score.attempts} ${state.score.attempts === 1 ? "tentativa" : "tentativas"}`;
    document.querySelectorAll(".progress-dots span").forEach((dot, index) => dot.classList.toggle("on", state.solvedInVisit.has(index)));
    byId("progress-text").textContent = state.solvedInVisit.size ? `Você concluiu ${state.solvedInVisit.size} ${state.solvedInVisit.size === 1 ? "desafio" : "desafios"} nesta visita.` : "Cada tentativa ajuda a encontrar o próximo passo.";
  }

  function clearPracticeFeedback() {
    const feedback = byId("practice-feedback");
    feedback.textContent = "Preencha as três etapas e confira sua resposta.";
    feedback.className = "practice-feedback";
    document.querySelectorAll(".practice-field").forEach(field => {
      field.querySelector("input").removeAttribute("aria-invalid");
      field.querySelector("small").textContent = "";
    });
  }

  function renderQuestion() {
    const question = questions[state.currentQuestion];
    byId("question-number").textContent = String(state.currentQuestion + 1);
    byId("question-title").textContent = question.title;
    byId("question-prompt").textContent = question.prompt;
    byId("sketch-opposite").textContent = question.sketch[0];
    byId("sketch-adjacent").textContent = question.sketch[1];
    byId("sketch-hypotenuse").textContent = question.sketch[2];
    const [opposite, adjacent] = question.sides;
    const scale = Math.min(180 / adjacent, 135 / opposite);
    const rightX = 15 + adjacent * scale;
    const topY = 160 - opposite * scale;
    byId("sketch-fill").setAttribute("d", `M 15 160 L ${rightX} 160 L ${rightX} ${topY} Z`);
    byId("sketch-right").setAttribute("d", `M ${rightX - 14} 160 L ${rightX - 14} 146 L ${rightX} 146`);
    byId("sketch-adjacent").setAttribute("x", (15 + rightX) / 2);
    byId("sketch-adjacent").setAttribute("text-anchor", "middle");
    byId("sketch-opposite").setAttribute("x", rightX + 11);
    byId("sketch-opposite").setAttribute("y", (160 + topY) / 2 + 5);
    byId("sketch-hypotenuse").setAttribute("x", (15 + rightX) / 2);
    byId("sketch-hypotenuse").setAttribute("y", (160 + topY) / 2 - 10);
    byId("sketch-hypotenuse").setAttribute("text-anchor", "middle");
    const halfAngle = Math.atan2(opposite, adjacent) / 2;
    const angleLabelRadius = Math.max(30, 11 / Math.sin(halfAngle));
    byId("sketch-angle").setAttribute("x", 15 + angleLabelRadius * Math.cos(halfAngle));
    byId("sketch-angle").setAttribute("y", 160 - angleLabelRadius * Math.sin(halfAngle) + 4);
    const container = byId("practice-fields");
    container.replaceChildren();
    question.fields.forEach((field, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "practice-field";
      const label = document.createElement("label");
      label.htmlFor = `answer-${index}`;
      label.textContent = field.label;
      const input = document.createElement("input");
      input.id = `answer-${index}`;
      input.name = `answer-${index}`;
      input.type = "text";
      input.inputMode = "decimal";
      input.autocomplete = "off";
      input.setAttribute("aria-describedby", `answer-hint-${index}`);
      input.addEventListener("input", clearPracticeFeedback);
      const hint = document.createElement("small");
      hint.id = `answer-hint-${index}`;
      wrapper.append(label, input, hint);
      container.append(wrapper);
    });
    clearPracticeFeedback();
    renderScore();
  }

  byId("practice-form").addEventListener("submit", event => {
    event.preventDefault();
    const question = questions[state.currentQuestion];
    const fields = [...document.querySelectorAll(".practice-field")];
    clearPracticeFeedback();
    state.score.attempts += 1;
    const firstError = question.fields.findIndex((field, index) => {
      const value = parseAnswer(fields[index].querySelector("input").value);
      return value === null || Math.abs(value - field.expected) > field.tolerance;
    });
    const feedback = byId("practice-feedback");
    if (firstError >= 0) {
      const input = fields[firstError].querySelector("input");
      const field = question.fields[firstError];
      input.setAttribute("aria-invalid", "true");
      fields[firstError].querySelector("small").textContent = field.hint;
      feedback.textContent = `Quase! Confira ${field.label}. ${field.hint}`;
      feedback.classList.add("try-again");
      input.focus();
    } else {
      feedback.textContent = "Correto! Você identificou os lados e formou as razões na ordem certa. Experimente outra questão.";
      feedback.classList.add("correct");
      if (!state.solvedInVisit.has(state.currentQuestion)) {
        state.score.correct += 1;
        state.solvedInVisit.add(state.currentQuestion);
      }
    }
    saveScore();
    renderScore();
  });
  byId("new-question").addEventListener("click", () => { state.currentQuestion = (state.currentQuestion + 1) % questions.length; renderQuestion(); byId("answer-0").focus(); });

  const navLinks = [...document.querySelectorAll(".step-nav a")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-22% 0px -65% 0px" });
    ["entenda", "laboratorio", "pratique", "resumo"].forEach(id => observer.observe(byId(id)));
  }

  updateLab();
  renderQuestion();
  sizeDragHandle();
  if ("ResizeObserver" in window) {
    const handleObserver = new ResizeObserver(sizeDragHandle);
    handleObserver.observe(triangle);
  }
  window.addEventListener("resize", () => requestAnimationFrame(sizeDragHandle));
}

if (document.getElementById("angle-input")) initPage();
