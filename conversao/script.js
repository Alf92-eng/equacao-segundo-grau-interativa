"use strict";

const categories = [
  {
    id: "currency", label: "Moeda", symbol: "$", baseLabel: "moeda de origem",
    description: "Câmbio depende da cotação entre as moedas. Busque uma cotação online ou informe uma taxa de confiança.",
    units: [
      { code: "BRL", label: "Real brasileiro (BRL)", short: "R$" },
      { code: "USD", label: "Dólar americano (USD)", short: "US$" },
      { code: "EUR", label: "Euro (EUR)", short: "€" },
      { code: "GBP", label: "Libra esterlina (GBP)", short: "£" },
      { code: "JPY", label: "Iene japonês (JPY)", short: "¥" },
      { code: "CAD", label: "Dólar canadense (CAD)", short: "CA$" },
      { code: "AUD", label: "Dólar australiano (AUD)", short: "A$" },
      { code: "CHF", label: "Franco suíço (CHF)", short: "CHF" }
    ]
  },
  {
    id: "volume", label: "Volume", symbol: "m³", baseLabel: "metros cúbicos",
    description: "As unidades cúbicas avançam de mil em mil; litros também entram na conversão: 1 L equivale a 1 dm³.",
    units: [
      { code: "km3", label: "Quilômetro cúbico (km³)", factor: 1e9 },
      { code: "hm3", label: "Hectômetro cúbico (hm³)", factor: 1e6 },
      { code: "dam3", label: "Decâmetro cúbico (dam³)", factor: 1e3 },
      { code: "m3", label: "Metro cúbico (m³)", factor: 1 },
      { code: "dm3", label: "Decímetro cúbico (dm³)", factor: 1e-3 },
      { code: "cm3", label: "Centímetro cúbico (cm³)", factor: 1e-6 },
      { code: "mm3", label: "Milímetro cúbico (mm³)", factor: 1e-9 },
      { code: "kL", label: "Quilolitro (kL)", factor: 1 },
      { code: "L", label: "Litro (L)", factor: 1e-3 },
      { code: "mL", label: "Mililitro (mL)", factor: 1e-6 },
      { code: "USgal", label: "Galão americano (US gal)", factor: 0.003785411784 }
    ]
  },
  {
    id: "length", label: "Comprimento", symbol: "m", baseLabel: "metros",
    description: "No sistema métrico, cada casa vizinha muda por um fator de 10.",
    units: [
      { code: "km", label: "Quilômetro (km)", factor: 1000 },
      { code: "hm", label: "Hectômetro (hm)", factor: 100 },
      { code: "dam", label: "Decâmetro (dam)", factor: 10 },
      { code: "m", label: "Metro (m)", factor: 1 },
      { code: "dm", label: "Decímetro (dm)", factor: 0.1 },
      { code: "cm", label: "Centímetro (cm)", factor: 0.01 },
      { code: "mm", label: "Milímetro (mm)", factor: 0.001 },
      { code: "mi", label: "Milha (mi)", factor: 1609.344 },
      { code: "ft", label: "Pé (ft)", factor: 0.3048 },
      { code: "in", label: "Polegada (in)", factor: 0.0254 }
    ]
  },
  {
    id: "mass", label: "Peso e massa", symbol: "kg", baseLabel: "gramas",
    description: "A escala métrica da massa avança de dez em dez entre unidades vizinhas.",
    units: [
      { code: "t", label: "Tonelada (t)", factor: 1e6 },
      { code: "kg", label: "Quilograma (kg)", factor: 1000 },
      { code: "hg", label: "Hectograma (hg)", factor: 100 },
      { code: "dag", label: "Decagrama (dag)", factor: 10 },
      { code: "g", label: "Grama (g)", factor: 1 },
      { code: "dg", label: "Decigrama (dg)", factor: 0.1 },
      { code: "cg", label: "Centigrama (cg)", factor: 0.01 },
      { code: "mg", label: "Miligrama (mg)", factor: 0.001 },
      { code: "lb", label: "Libra (lb)", factor: 453.59237 },
      { code: "oz", label: "Onça (oz)", factor: 28.349523125 }
    ]
  },
  {
    id: "temperature", label: "Temperatura", symbol: "°C", baseLabel: "graus Celsius",
    description: "Temperatura não usa apenas multiplicação: Celsius, Fahrenheit e Kelvin têm pontos de início diferentes.",
    units: [
      { code: "C", label: "Celsius (°C)" },
      { code: "F", label: "Fahrenheit (°F)" },
      { code: "K", label: "Kelvin (K)" }
    ]
  },
  {
    id: "energy", label: "Energia", symbol: "J", baseLabel: "joules",
    description: "As unidades são comparadas por uma quantidade de referência em joules.",
    units: [
      { code: "J", label: "Joule (J)", factor: 1 },
      { code: "kJ", label: "Quilojoule (kJ)", factor: 1000 },
      { code: "cal", label: "Caloria (cal)", factor: 4.184 },
      { code: "kcal", label: "Quilocaloria (kcal)", factor: 4184 },
      { code: "Wh", label: "Watt-hora (Wh)", factor: 3600 },
      { code: "kWh", label: "Quilowatt-hora (kWh)", factor: 3600000 },
      { code: "eV", label: "Elétron-volt (eV)", factor: 1.602176634e-19 },
      { code: "BTU", label: "Unidade térmica britânica (BTU)", factor: 1055.05585262 }
    ]
  },
  {
    id: "area", label: "Área", symbol: "m²", baseLabel: "metros quadrados",
    description: "Na escada da área, cada passo métrico muda por 100 porque a unidade está ao quadrado.",
    units: [
      { code: "km2", label: "Quilômetro quadrado (km²)", factor: 1e6 },
      { code: "ha", label: "Hectare (ha)", factor: 10000 },
      { code: "hm2", label: "Hectômetro quadrado (hm²)", factor: 10000 },
      { code: "dam2", label: "Decâmetro quadrado (dam²)", factor: 100 },
      { code: "m2", label: "Metro quadrado (m²)", factor: 1 },
      { code: "dm2", label: "Decímetro quadrado (dm²)", factor: 0.01 },
      { code: "cm2", label: "Centímetro quadrado (cm²)", factor: 0.0001 },
      { code: "mm2", label: "Milímetro quadrado (mm²)", factor: 0.000001 },
      { code: "acre", label: "Acre (ac)", factor: 4046.8564224 }
    ]
  },
  {
    id: "speed", label: "Velocidade", symbol: "m/s", baseLabel: "metros por segundo",
    description: "Para comparar velocidades, converta cada medida para a mesma unidade de referência.",
    units: [
      { code: "mps", label: "Metro por segundo (m/s)", factor: 1 },
      { code: "kmh", label: "Quilômetro por hora (km/h)", factor: 1 / 3.6 },
      { code: "mph", label: "Milha por hora (mph)", factor: 0.44704 },
      { code: "knot", label: "Nó (kn)", factor: 0.514444444444 }
    ]
  },
  {
    id: "time", label: "Tempo", symbol: "s", baseLabel: "segundos",
    description: "As unidades de tempo têm relações próprias: por exemplo, 1 hora tem 60 minutos.",
    units: [
      { code: "ms", label: "Milissegundo (ms)", factor: 0.001 },
      { code: "s", label: "Segundo (s)", factor: 1 },
      { code: "min", label: "Minuto (min)", factor: 60 },
      { code: "h", label: "Hora (h)", factor: 3600 },
      { code: "day", label: "Dia (d)", factor: 86400 },
      { code: "week", label: "Semana (sem)", factor: 604800 }
    ]
  },
  {
    id: "power", label: "Potência", symbol: "W", baseLabel: "watts",
    description: "Potência mede a rapidez de transferência ou transformação de energia.",
    units: [
      { code: "mW", label: "Miliwatt (mW)", factor: 0.001 },
      { code: "W", label: "Watt (W)", factor: 1 },
      { code: "kW", label: "Quilowatt (kW)", factor: 1000 },
      { code: "MW", label: "Megawatt (MW)", factor: 1e6 },
      { code: "hp", label: "Cavalo-vapor (hp)", factor: 745.699871582 }
    ]
  },
  {
    id: "data", label: "Dados", symbol: "B", baseLabel: "bits",
    description: "Aqui, kB e MB usam múltiplos decimais; KiB e MiB usam potências de 1.024 bytes.",
    units: [
      { code: "bit", label: "Bit (bit)", factor: 1 },
      { code: "B", label: "Byte (B)", factor: 8 },
      { code: "kB", label: "Quilobyte decimal (kB)", factor: 8e3 },
      { code: "MB", label: "Megabyte decimal (MB)", factor: 8e6 },
      { code: "GB", label: "Gigabyte decimal (GB)", factor: 8e9 },
      { code: "TB", label: "Terabyte decimal (TB)", factor: 8e12 },
      { code: "KiB", label: "Kibibyte binário (KiB)", factor: 8 * 1024 },
      { code: "MiB", label: "Mebibyte binário (MiB)", factor: 8 * 1024 ** 2 },
      { code: "GiB", label: "Gibibyte binário (GiB)", factor: 8 * 1024 ** 3 },
      { code: "TiB", label: "Tebibyte binário (TiB)", factor: 8 * 1024 ** 4 }
    ]
  },
  {
    id: "pressure", label: "Pressão", symbol: "Pa", baseLabel: "pascals",
    description: "A pressão pode aparecer em pascals, atmosferas, milímetros de mercúrio ou psi.",
    units: [
      { code: "Pa", label: "Pascal (Pa)", factor: 1 },
      { code: "kPa", label: "Quilopascal (kPa)", factor: 1000 },
      { code: "MPa", label: "Megapascal (MPa)", factor: 1e6 },
      { code: "bar", label: "Bar (bar)", factor: 100000 },
      { code: "atm", label: "Atmosfera padrão (atm)", factor: 101325 },
      { code: "mmHg", label: "Milímetro de mercúrio (mmHg)", factor: 133.322387415 },
      { code: "psi", label: "Libra por polegada quadrada (psi)", factor: 6894.757293168 }
    ]
  },
  {
    id: "angle", label: "Ângulo", symbol: "∠", baseLabel: "radianos",
    description: "Graus e radianos medem o mesmo ângulo em escalas diferentes; uma volta completa tem 360° ou 2π rad.",
    units: [
      { code: "deg", label: "Grau (°)", factor: Math.PI / 180 },
      { code: "rad", label: "Radiano (rad)", factor: 1 },
      { code: "grad", label: "Grado (gon)", factor: Math.PI / 200 },
      { code: "turn", label: "Volta completa (volta)", factor: 2 * Math.PI }
    ]
  }
];

const examples = [
  { label: "2,5 m → cm", category: "length", amount: "2,5", from: "m", to: "cm" },
  { label: "3 L → mL", category: "volume", amount: "3", from: "L", to: "mL" },
  { label: "25 °C → °F", category: "temperature", amount: "25", from: "C", to: "F" },
  { label: "72 km/h → m/s", category: "speed", amount: "72", from: "kmh", to: "mps" }
];

const exercises = [
  { prompt: "Converta 2,5 metros para centímetros.", answer: 250, unit: "cm", hint: "Cada metro tem 100 centímetros. Multiplique 2,5 por 100." },
  { prompt: "Converta 3 litros para mililitros.", answer: 3000, unit: "mL", hint: "Cada litro tem 1.000 mililitros. Multiplique 3 por 1.000." },
  { prompt: "Converta 1,5 quilômetro para metros.", answer: 1500, unit: "m", hint: "Um quilômetro equivale a 1.000 metros." },
  { prompt: "Converta 2 horas para minutos.", answer: 120, unit: "min", hint: "Uma hora tem 60 minutos. Multiplique 2 por 60." },
  { prompt: "Converta 1 metro quadrado para centímetros quadrados.", answer: 10000, unit: "cm²", hint: "Na área, cada passo métrico vale 100. De m² até cm² são dois passos." }
];

const dom = {
  categories: document.querySelector("#category-list"),
  categoryName: document.querySelector("#category-name"),
  categoryKicker: document.querySelector("#category-kicker"),
  categoryDescription: document.querySelector("#category-description"),
  categorySymbol: document.querySelector("#category-symbol"),
  amount: document.querySelector("#amount-input"),
  amountError: document.querySelector("#amount-error"),
  from: document.querySelector("#from-unit"),
  to: document.querySelector("#to-unit"),
  form: document.querySelector("#conversion-form"),
  error: document.querySelector("#conversion-error"),
  result: document.querySelector("#result-value"),
  resultCaption: document.querySelector("#result-caption"),
  steps: document.querySelector("#solution-steps"),
  stepCounter: document.querySelector("#step-counter"),
  nextStep: document.querySelector("#next-step"),
  examples: document.querySelector("#example-list"),
  swap: document.querySelector("#swap-units"),
  currencyField: document.querySelector("#currency-field"),
  currencyRate: document.querySelector("#currency-rate"),
  currencyStatus: document.querySelector("#currency-status"),
  fetchRate: document.querySelector("#fetch-rate"),
  exercisePrompt: document.querySelector("#exercise-prompt"),
  exerciseForm: document.querySelector("#exercise-form"),
  exerciseAnswer: document.querySelector("#exercise-answer"),
  exerciseUnit: document.querySelector("#exercise-unit"),
  exerciseFeedback: document.querySelector("#exercise-feedback"),
  correctCount: document.querySelector("#correct-count"),
  attemptCount: document.querySelector("#attempt-count"),
  scoreMessage: document.querySelector("#score-message"),
  newExercise: document.querySelector("#new-exercise")
};

const state = {
  categoryId: "currency",
  activeStep: 0,
  currentExercise: 0,
  score: { correct: 0, attempts: 0 },
  currencyRequest: null,
  lastCurrencyRate: null,
  lastRateDate: null
};

const scoreStorageKey = "caderno-matematica:conversor-score:v1";
const unitSymbols = {
  km3: "km³", hm3: "hm³", dam3: "dam³", m3: "m³", dm3: "dm³", cm3: "cm³", mm3: "mm³",
  km2: "km²", hm2: "hm²", dam2: "dam²", m2: "m²", dm2: "dm²", cm2: "cm²", mm2: "mm²",
  C: "°C", F: "°F", K: "K", mps: "m/s", kmh: "km/h", day: "d", week: "sem",
  deg: "°", grad: "gon", turn: "volta", knot: "kn", USgal: "US gal"
};

function parseNumber(input) {
  const text = String(input).trim().replace(",", ".");
  if (!text || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) return NaN;
  const value = Number(text);
  return Number.isFinite(value) ? value : NaN;
}

function formatNumber(value, maximumSignificantDigits = 12) {
  if (!Number.isFinite(value)) return "—";
  const normalized = Object.is(value, -0) ? 0 : value;
  const absolute = Math.abs(normalized);
  const notation = absolute > 0 && (absolute < 1e-9 || absolute >= 1e15) ? "scientific" : "standard";
  return new Intl.NumberFormat("pt-BR", {
    maximumSignificantDigits,
    notation,
    useGrouping: notation === "standard"
  }).format(normalized);
}

function isRoundedForDisplay(value) {
  if (!Number.isFinite(value) || value === 0) return false;
  const rounded = Number(value.toPrecision(12));
  return Math.abs(value - rounded) > Number.EPSILON * Math.abs(value) * 2;
}

function getCategory(categoryId) {
  const category = categories.find((item) => item.id === categoryId);
  if (!category) throw new RangeError("Categoria de conversão desconhecida.");
  return category;
}

function getUnit(category, code) {
  const unit = category.units.find((item) => item.code === code);
  if (!unit) throw new RangeError("Unidade de conversão desconhecida.");
  return unit;
}

function toBaseTemperature(value, unitCode) {
  if (unitCode === "C") return value;
  if (unitCode === "F") return (value - 32) * 5 / 9;
  if (unitCode === "K") return value - 273.15;
  throw new RangeError("Unidade de temperatura desconhecida.");
}

function fromBaseTemperature(value, unitCode) {
  if (unitCode === "C") return value;
  if (unitCode === "F") return value * 9 / 5 + 32;
  if (unitCode === "K") return value + 273.15;
  throw new RangeError("Unidade de temperatura desconhecida.");
}

function convertValue(categoryId, value, fromCode, toCode, exchangeRate) {
  if (!Number.isFinite(value)) throw new TypeError("Informe um número finito para converter.");
  const category = getCategory(categoryId);
  const fromUnit = getUnit(category, fromCode);
  const toUnit = getUnit(category, toCode);

  if (categoryId === "currency") {
    if (fromCode === toCode) return { result: value, baseValue: value, factor: 1 };
    if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
      throw new RangeError("Informe uma taxa de câmbio maior que zero.");
    }
    return { result: value * exchangeRate, baseValue: value, factor: exchangeRate };
  }

  if (categoryId === "temperature") {
    const baseValue = toBaseTemperature(value, fromCode);
    if (baseValue < -273.15) {
      throw new RangeError("A temperatura não pode ficar abaixo do zero absoluto (−273,15 °C).");
    }
    return { result: fromBaseTemperature(baseValue, toCode), baseValue, factor: null };
  }

  const baseValue = value * fromUnit.factor;
  const result = baseValue / toUnit.factor;
  if (!Number.isFinite(baseValue) || !Number.isFinite(result)) {
    throw new RangeError("O valor é grande demais para uma conversão segura.");
  }
  return { result, baseValue, factor: fromUnit.factor / toUnit.factor };
}

function getUnitShort(categoryId, code) {
  const unit = getUnit(getCategory(categoryId), code);
  return unit.short || unitSymbols[code] || code;
}

function renderCategories() {
  dom.categories.replaceChildren();
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-button";
    button.dataset.category = category.id;
    button.setAttribute("aria-pressed", String(category.id === state.categoryId));
    const glyph = document.createElement("span");
    glyph.className = "category-glyph";
    glyph.setAttribute("aria-hidden", "true");
    glyph.textContent = category.symbol;
    const label = document.createElement("span");
    label.textContent = category.label;
    button.append(glyph, label);
    button.addEventListener("click", () => selectCategory(category.id));
    dom.categories.append(button);
  });
}

function fillUnitSelect(select, category, selectedCode) {
  select.replaceChildren();
  category.units.forEach((unit) => {
    const option = document.createElement("option");
    option.value = unit.code;
    option.textContent = unit.label;
    select.append(option);
  });
  select.value = selectedCode;
}

function defaultUnits(category) {
  if (category.id === "currency") return { from: "USD", to: "BRL" };
  if (category.id === "length") return { from: "m", to: "cm" };
  if (category.id === "volume") return { from: "L", to: "mL" };
  if (category.id === "mass") return { from: "kg", to: "g" };
  if (category.id === "temperature") return { from: "C", to: "F" };
  if (category.id === "energy") return { from: "kWh", to: "J" };
  if (category.id === "area") return { from: "m2", to: "cm2" };
  if (category.id === "speed") return { from: "kmh", to: "mps" };
  if (category.id === "time") return { from: "h", to: "min" };
  if (category.id === "power") return { from: "kW", to: "W" };
  if (category.id === "data") return { from: "GB", to: "GiB" };
  if (category.id === "pressure") return { from: "atm", to: "kPa" };
  return { from: "deg", to: "rad" };
}

function setCategoryUnits(category, requestedFrom, requestedTo) {
  const defaults = defaultUnits(category);
  const fromCode = category.units.some((unit) => unit.code === requestedFrom) ? requestedFrom : defaults.from;
  const toCode = category.units.some((unit) => unit.code === requestedTo) ? requestedTo : defaults.to;
  fillUnitSelect(dom.from, category, fromCode);
  fillUnitSelect(dom.to, category, toCode);
}

function updateCategoryHeading(category) {
  dom.categoryName.textContent = category.label;
  dom.categoryKicker.textContent = category.label.toLocaleUpperCase("pt-BR");
  dom.categoryDescription.textContent = category.description;
  dom.categorySymbol.textContent = category.symbol;
}

function updateCurrencyState() {
  const isCurrency = state.categoryId === "currency";
  dom.currencyField.hidden = !isCurrency;
  if (!isCurrency) return;
  const fromCode = dom.from.value;
  const toCode = dom.to.value;
  if (fromCode === toCode) {
    dom.currencyRate.value = "1";
    dom.currencyRate.disabled = true;
    dom.fetchRate.disabled = true;
    dom.currencyStatus.textContent = "As moedas são iguais; a taxa de conversão é 1.";
    state.lastCurrencyRate = 1;
    return;
  }
  dom.currencyRate.disabled = false;
  dom.fetchRate.disabled = false;
}

function selectCategory(categoryId) {
  const category = getCategory(categoryId);
  state.categoryId = category.id;
  state.activeStep = 0;
  renderCategories();
  updateCategoryHeading(category);
  setCategoryUnits(category);
  dom.amount.value = category.id === "temperature" ? "25" : category.id === "currency" ? "1" : "1";
  dom.amountError.textContent = "";
  if (category.id === "currency") {
    dom.currencyRate.value = "";
    dom.currencyStatus.textContent = "Buscando cotação recente… Se não houver conexão, informe a taxa manualmente.";
  }
  updateCurrencyState();
  renderExamples();
  renderConversion();
  if (category.id === "currency" && dom.from.value !== dom.to.value) fetchCurrencyRate();
}

function renderExamples() {
  dom.examples.replaceChildren();
  examples.forEach((example) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "example-button";
    button.textContent = example.label;
    button.addEventListener("click", () => {
      selectCategory(example.category);
      dom.amount.value = example.amount;
      dom.from.value = example.from;
      dom.to.value = example.to;
      renderConversion();
      dom.amount.focus();
    });
    dom.examples.append(button);
  });
}

function buildSteps(category, value, fromUnit, toUnit, conversion, exchangeRate) {
  const amountText = formatNumber(value);
  const resultText = formatNumber(conversion.result);
  const resultOperator = category.id !== "currency" && isRoundedForDisplay(conversion.result) ? "≈" : "=";
  const fromShort = getUnitShort(category.id, fromUnit.code);
  const toShort = getUnitShort(category.id, toUnit.code);
  const steps = [
    `${amountText} ${fromShort} é o valor de partida. A unidade de destino é ${toUnit.label}.`
  ];

  if (category.id === "currency") {
    steps.push(`A taxa informada é ${formatNumber(exchangeRate, 8)} ${toShort} para cada 1 ${fromShort}.`);
    steps.push(`${amountText} × ${formatNumber(exchangeRate, 8)} = ${resultText} ${toShort}.`);
  } else if (category.id === "temperature") {
    if (fromUnit.code === toUnit.code) {
      steps.push("As unidades são iguais; não é preciso aplicar uma fórmula.");
    } else if (fromUnit.code === "C" && toUnit.code === "F") {
      steps.push("Para passar de Celsius a Fahrenheit, use °F = (°C × 9/5) + 32.");
      steps.push(`(${amountText} × 9/5) + 32 ${resultOperator} ${resultText} °F.`);
    } else if (fromUnit.code === "F" && toUnit.code === "C") {
      steps.push("Para passar de Fahrenheit a Celsius, use °C = (°F − 32) × 5/9.");
      steps.push(`(${amountText} − 32) × 5/9 ${resultOperator} ${resultText} °C.`);
    } else if (toUnit.code === "K") {
      steps.push("Para encontrar Kelvin, some 273,15 ao valor em Celsius.");
      steps.push(`${formatNumber(conversion.baseValue)} °C + 273,15 ${resultOperator} ${resultText} K.`);
    } else if (fromUnit.code === "K") {
      if (toUnit.code === "C") {
        steps.push("Para encontrar Celsius, subtraia 273,15 do valor em Kelvin.");
        steps.push(`${amountText} K − 273,15 ${resultOperator} ${resultText} °C.`);
      } else {
        steps.push(`Primeiro, subtraia 273,15: ${amountText} K − 273,15 = ${formatNumber(conversion.baseValue)} °C.`);
        steps.push(`Depois aplique °F = (°C × 9/5) + 32: ${resultOperator} ${resultText} °F.`);
      }
    } else {
      steps.push(`Primeiro, a medida equivale a ${formatNumber(conversion.baseValue)} °C.`);
      steps.push(`Aplicando a fórmula da unidade de destino, obtemos ${resultOperator} ${resultText} ${toShort}.`);
    }
  } else {
    const fromFactor = getUnit(category, fromUnit.code).factor;
    const toFactor = getUnit(category, toUnit.code).factor;
    const baseOperator = isRoundedForDisplay(conversion.baseValue) ? "≈" : "=";
    steps.push(`Na unidade de referência (${category.baseLabel}), ${amountText} × ${formatNumber(fromFactor, 12)} ${baseOperator} ${formatNumber(conversion.baseValue, 12)}.`);
    steps.push(`Agora divida pela equivalência de ${toUnit.label}: ${formatNumber(conversion.baseValue, 12)} ÷ ${formatNumber(toFactor, 12)} ${resultOperator} ${resultText} ${toShort}.`);
  }
  return steps;
}

function renderSteps(messages) {
  const list = [...messages];
  dom.steps.replaceChildren();
  list.forEach((message, index) => {
    const item = document.createElement("li");
    item.className = `solution-step${index === state.activeStep ? " is-current" : ""}`;
    const number = document.createElement("span");
    number.textContent = String(index + 1);
    const text = document.createElement("p");
    text.textContent = message;
    item.append(number, text);
    dom.steps.append(item);
  });
  const lastStep = Math.max(0, list.length - 1);
  state.activeStep = Math.min(state.activeStep, lastStep);
  dom.stepCounter.textContent = `Passo ${state.activeStep + 1} de ${list.length}`;
  dom.nextStep.disabled = state.activeStep >= lastStep;
  dom.nextStep.textContent = state.activeStep >= lastStep ? "Todos os passos exibidos" : "Próximo passo →";
}

function renderConversion() {
  const category = getCategory(state.categoryId);
  const value = parseNumber(dom.amount.value);
  dom.error.hidden = true;
  dom.error.textContent = "";
  dom.amountError.textContent = "";
  if (!Number.isFinite(value)) {
    dom.result.textContent = "—";
    dom.resultCaption.textContent = "Digite um número válido para calcular.";
    dom.amountError.textContent = "Informe um número. Use vírgula ou ponto para casas decimais.";
    renderSteps(["Informe um número válido para começar.", "Escolha as unidades de origem e destino.", "O resultado aparecerá após a correção do valor."]);
    return;
  }

  const fromUnit = getUnit(category, dom.from.value);
  const toUnit = getUnit(category, dom.to.value);
  const exchangeRate = category.id === "currency" ? parseNumber(dom.currencyRate.value) : undefined;

  try {
    const conversion = convertValue(category.id, value, fromUnit.code, toUnit.code, exchangeRate);
    const resultText = formatNumber(conversion.result);
    const fromShort = getUnitShort(category.id, fromUnit.code);
    const toShort = getUnitShort(category.id, toUnit.code);
    const isApproximate = category.id !== "currency" && isRoundedForDisplay(conversion.result);
    dom.result.textContent = `${isApproximate ? "≈ " : ""}${resultText} ${toShort}`;
    dom.resultCaption.textContent = `${formatNumber(value)} ${fromShort} ${isApproximate ? "equivalem aproximadamente a" : "equivalem a"} ${resultText} ${toShort}.`;
    renderSteps(buildSteps(category, value, fromUnit, toUnit, conversion, exchangeRate));
  } catch (error) {
    dom.result.textContent = "—";
    dom.resultCaption.textContent = "Corrija a informação indicada para continuar.";
    dom.error.textContent = error instanceof Error ? error.message : "Não foi possível fazer esta conversão.";
    dom.error.hidden = false;
    renderSteps(["Confira o valor digitado.", "Ajuste a unidade ou a taxa de conversão.", "Faça a conversão novamente."]);
  }
}

function updateRateMessage(message, isError = false) {
  dom.currencyStatus.textContent = message;
  dom.currencyStatus.dataset.state = isError ? "error" : "ready";
}

async function fetchCurrencyRate() {
  if (state.categoryId !== "currency" || dom.from.value === dom.to.value) return;
  if (state.currencyRequest) state.currencyRequest.abort();
  const controller = new AbortController();
  state.currencyRequest = controller;
  const fromCode = dom.from.value;
  const toCode = dom.to.value;
  dom.fetchRate.disabled = true;
  dom.currencyRate.value = "";
  dom.currencyRate.setAttribute("aria-busy", "true");
  updateRateMessage("Buscando cotação recente…");

  try {
    const url = new URL("https://api.frankfurter.dev/v1/latest");
    url.searchParams.set("base", fromCode);
    url.searchParams.set("symbols", toCode);
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`O serviço de cotação respondeu com status ${response.status}.`);
    const data = await response.json();
    const rate = data.rates && data.rates[toCode];
    if (!Number.isFinite(rate) || rate <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(data.date || "")) {
      throw new Error("O serviço não retornou uma cotação válida.");
    }
    if (state.currencyRequest !== controller || dom.from.value !== fromCode || dom.to.value !== toCode) return;
    state.lastCurrencyRate = rate;
    state.lastRateDate = data.date;
    dom.currencyRate.value = String(rate).replace(".", ",");
    updateRateMessage(`Cotação de referência de ${data.date}, fornecida pelo Frankfurter. Taxas podem variar entre instituições.`);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    if (state.currencyRequest !== controller) return;
    state.lastCurrencyRate = null;
    state.lastRateDate = null;
    dom.currencyRate.value = "";
    const reason = error instanceof Error ? error.message : "falha de conexão";
    updateRateMessage(`Não foi possível buscar a cotação (${reason}). Verifique a conexão ou informe a taxa manualmente.`, true);
  } finally {
    if (state.currencyRequest === controller) {
      state.currencyRequest = null;
      dom.fetchRate.disabled = false;
      dom.currencyRate.removeAttribute("aria-busy");
      renderConversion();
    }
  }
}

function loadScore() {
  try {
    const saved = JSON.parse(localStorage.getItem(scoreStorageKey));
    if (saved && Number.isSafeInteger(saved.correct) && Number.isSafeInteger(saved.attempts)
      && saved.correct >= 0 && saved.attempts >= saved.correct) {
      state.score = { correct: saved.correct, attempts: saved.attempts };
    }
  } catch (_) {
    state.score = { correct: 0, attempts: 0 };
  }
  updateScore();
}

function saveScore() {
  try {
    localStorage.setItem(scoreStorageKey, JSON.stringify(state.score));
  } catch (_) {
    dom.scoreMessage.textContent = "A pontuação vale nesta sessão; o navegador não permitiu salvá-la.";
  }
}

function updateScore() {
  dom.correctCount.textContent = String(state.score.correct);
  dom.attemptCount.textContent = String(state.score.attempts);
  if (state.score.attempts > 0) {
    dom.scoreMessage.textContent = `${Math.round(state.score.correct / state.score.attempts * 100)}% de acertos até agora.`;
  }
}

function showExercise() {
  const exercise = exercises[state.currentExercise];
  dom.exercisePrompt.textContent = exercise.prompt;
  dom.exerciseUnit.textContent = exercise.unit;
  dom.exerciseAnswer.value = "";
  dom.exerciseFeedback.hidden = true;
  dom.exerciseFeedback.textContent = "";
  dom.exerciseFeedback.classList.remove("is-error");
}

function checkExercise(event) {
  event.preventDefault();
  const answer = parseNumber(dom.exerciseAnswer.value);
  dom.exerciseAnswer.setAttribute("aria-invalid", String(!Number.isFinite(answer)));
  if (!Number.isFinite(answer)) {
    dom.exerciseFeedback.textContent = "Digite um número para conferir sua resposta.";
    dom.exerciseFeedback.classList.add("is-error");
    dom.exerciseFeedback.hidden = false;
    dom.exerciseAnswer.focus();
    return;
  }
  const exercise = exercises[state.currentExercise];
  const isCorrect = Math.abs(answer - exercise.answer) <= Math.max(1e-8, Math.abs(exercise.answer) * 1e-8);
  state.score.attempts += 1;
  if (isCorrect) state.score.correct += 1;
  updateScore();
  saveScore();
  dom.exerciseFeedback.textContent = isCorrect
    ? `Correto! A resposta é ${formatNumber(exercise.answer)} ${exercise.unit}.`
    : `Quase. ${exercise.hint}`;
  dom.exerciseFeedback.classList.toggle("is-error", !isCorrect);
  dom.exerciseFeedback.hidden = false;
  dom.exerciseAnswer.removeAttribute("aria-invalid");
}

function initialize() {
  if (!dom.categories) return;
  renderCategories();
  updateCategoryHeading(getCategory(state.categoryId));
  setCategoryUnits(getCategory(state.categoryId));
  renderExamples();
  loadScore();
  showExercise();
  updateCurrencyState();
  renderConversion();

  dom.form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderConversion();
    if (!dom.error.hidden) dom.amount.focus();
  });
  dom.amount.addEventListener("input", () => {
    state.activeStep = 0;
    renderConversion();
  });
  dom.from.addEventListener("change", () => {
    state.activeStep = 0;
    if (state.categoryId === "currency") {
      updateCurrencyState();
      fetchCurrencyRate();
    }
    renderConversion();
  });
  dom.to.addEventListener("change", () => {
    state.activeStep = 0;
    if (state.categoryId === "currency") {
      updateCurrencyState();
      fetchCurrencyRate();
    }
    renderConversion();
  });
  dom.currencyRate.addEventListener("input", () => {
    state.activeStep = 0;
    updateRateMessage("Usando a taxa informada manualmente.");
    renderConversion();
  });
  dom.swap.addEventListener("click", () => {
    const fromCode = dom.from.value;
    const toCode = dom.to.value;
    dom.from.value = toCode;
    dom.to.value = fromCode;
    state.activeStep = 0;
    if (state.categoryId === "currency") {
      updateCurrencyState();
      fetchCurrencyRate();
    }
    renderConversion();
  });
  dom.fetchRate.addEventListener("click", fetchCurrencyRate);
  dom.nextStep.addEventListener("click", () => {
    const stepCount = dom.steps.children.length;
    if (state.activeStep < stepCount - 1) state.activeStep += 1;
    [...dom.steps.children].forEach((step, index) => step.classList.toggle("is-current", index === state.activeStep));
    dom.stepCounter.textContent = `Passo ${state.activeStep + 1} de ${stepCount}`;
    dom.nextStep.disabled = state.activeStep >= stepCount - 1;
    dom.nextStep.textContent = state.activeStep >= stepCount - 1 ? "Todos os passos exibidos" : "Próximo passo →";
  });
  dom.exerciseForm.addEventListener("submit", checkExercise);
  dom.exerciseAnswer.addEventListener("input", () => {
    dom.exerciseAnswer.removeAttribute("aria-invalid");
    dom.exerciseFeedback.hidden = true;
  });
  dom.newExercise.addEventListener("click", () => {
    state.currentExercise = (state.currentExercise + 1) % exercises.length;
    showExercise();
  });

  if (state.categoryId === "currency") fetchCurrencyRate();
}

window.ConversorMatematico = Object.freeze({ categories, convertValue, formatNumber, parseNumber });
initialize();
