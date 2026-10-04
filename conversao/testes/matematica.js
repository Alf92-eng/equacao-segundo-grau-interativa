"use strict";

const results = document.querySelector("#test-results");
const summary = document.querySelector("#test-summary");
const api = window.ConversorMatematico;
let passed = 0;
let failed = 0;

function assertClose(actual, expected, label, tolerance = 1e-8) {
  if (Math.abs(actual - expected) > Math.max(tolerance, Math.abs(expected) * tolerance)) {
    throw new Error(`${label}: esperado ${expected}, recebido ${actual}.`);
  }
}

function test(label, callback) {
  const item = document.createElement("li");
  try {
    callback();
    passed += 1;
    item.className = "passed";
    item.textContent = `Passou: ${label}`;
  } catch (error) {
    failed += 1;
    item.className = "failed";
    item.textContent = `Falhou: ${label} — ${error.message}`;
  }
  results.append(item);
}

test("comprimento: 2,5 m = 250 cm", () => {
  assertClose(api.convertValue("length", 2.5, "m", "cm").result, 250, "2,5 m em cm");
});
test("área: 1 m² = 10.000 cm²", () => {
  assertClose(api.convertValue("area", 1, "m2", "cm2").result, 10000, "m² em cm²");
});
test("volume e capacidade: 1 L = 1.000 mL", () => {
  assertClose(api.convertValue("volume", 1, "L", "mL").result, 1000, "L em mL");
});
test("temperatura: 0 °C = 32 °F", () => {
  assertClose(api.convertValue("temperature", 0, "C", "F").result, 32, "Celsius em Fahrenheit");
});
test("temperatura: zero absoluto = 0 K", () => {
  assertClose(api.convertValue("temperature", -273.15, "C", "K").result, 0, "zero absoluto em Kelvin");
});
test("temperatura: 273,15 K = 32 °F", () => {
  assertClose(api.convertValue("temperature", 273.15, "K", "F").result, 32, "Kelvin em Fahrenheit");
});
test("temperatura: 25 °C = 298,15 K", () => {
  assertClose(api.convertValue("temperature", 25, "C", "K").result, 298.15, "Celsius em Kelvin");
});
test("velocidade: 72 km/h = 20 m/s", () => {
  assertClose(api.convertValue("speed", 72, "kmh", "mps").result, 20, "km/h em m/s");
});
test("ângulo: 180° = π rad", () => {
  assertClose(api.convertValue("angle", 180, "deg", "rad").result, Math.PI, "graus em radianos");
});
test("dados: 1 KiB = 1.024 bytes", () => {
  assertClose(api.convertValue("data", 1, "KiB", "B").result, 1024, "KiB em bytes");
});
test("massa: 1 kg = 1.000 g", () => {
  assertClose(api.convertValue("mass", 1, "kg", "g").result, 1000, "kg em g");
});
test("energia: 1 kWh = 3.600.000 J", () => {
  assertClose(api.convertValue("energy", 1, "kWh", "J").result, 3600000, "kWh em J");
});
test("tempo: 1 hora = 60 minutos", () => {
  assertClose(api.convertValue("time", 1, "h", "min").result, 60, "h em min");
});
test("potência: 1 kW = 1.000 W", () => {
  assertClose(api.convertValue("power", 1, "kW", "W").result, 1000, "kW em W");
});
test("pressão: 1 atm = 101,325 kPa", () => {
  assertClose(api.convertValue("pressure", 1, "atm", "kPa").result, 101.325, "atm em kPa");
});
test("moeda: usa a taxa informada sem inventar uma cotação", () => {
  assertClose(api.convertValue("currency", 2, "USD", "BRL", 5).result, 10, "USD para BRL a 5");
});
test("vírgula decimal é aceita", () => {
  assertClose(api.parseNumber("2,75"), 2.75, "parse de decimal");
});
test("valor não numérico é rejeitado", () => {
  if (Number.isFinite(api.parseNumber("abc"))) throw new Error("O texto inválido foi aceito.");
});
test("temperatura abaixo do zero absoluto é rejeitada", () => {
  let wasRejected = false;
  try { api.convertValue("temperature", -300, "C", "K"); } catch (error) { wasRejected = error instanceof RangeError; }
  if (!wasRejected) throw new Error("Era esperada uma mensagem de limite físico.");
});
test("taxa cambial zero é rejeitada", () => {
  let wasRejected = false;
  try { api.convertValue("currency", 1, "USD", "BRL", 0); } catch (error) { wasRejected = error instanceof RangeError; }
  if (!wasRejected) throw new Error("Era esperada a recusa de uma taxa nula.");
});
test("mesma moeda mantém o valor sem exigir cotação", () => {
  assertClose(api.convertValue("currency", 12, "BRL", "BRL").result, 12, "BRL para BRL");
});
test("números com espaços internos são rejeitados", () => {
  if (Number.isFinite(api.parseNumber("1 000"))) throw new Error("Um separador de milhar ambíguo foi aceito.");
});
test("valores que excedem a faixa numérica são rejeitados", () => {
  let wasRejected = false;
  try { api.convertValue("length", Number.MAX_VALUE, "mi", "mm"); } catch (error) { wasRejected = error instanceof RangeError; }
  if (!wasRejected) throw new Error("Era esperada a recusa do resultado não finito.");
});

summary.textContent = `${passed} de ${passed + failed} testes passaram${failed ? `; ${failed} falharam` : ""}.`;
