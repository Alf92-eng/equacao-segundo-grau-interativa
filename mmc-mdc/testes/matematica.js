"use strict";

const output = document.querySelector("#test-results");
const summary = document.querySelector("#test-summary");
let passed = 0;
let failed = 0;

function test(name, run) {
  const item = document.createElement("li");
  try {
    run();
    passed += 1;
    item.textContent = `PASSOU — ${name}`;
  } catch (error) {
    failed += 1;
    item.textContent = `FALHOU — ${name}: ${error.message}`;
  }
  output.append(item);
}

function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error(`esperado ${String(expected)}, recebido ${String(actual)}`);
}

function assertThrows(callback, errorType) {
  try {
    callback();
  } catch (error) {
    if (error instanceof errorType) return;
    throw new Error(`tipo de erro inesperado: ${error.constructor.name}`);
  }
  throw new Error("esperava uma exceção, mas nenhuma ocorreu");
}

const { calculate, factorize, gcd, InputError, lcm, parseValues } = window.MmcMdcMath;

test("caso comum: MMC(12, 18) = 36 e MDC(12, 18) = 6", () => {
  const result = calculate(parseValues("12, 18"));
  assertEqual(result.mmc, 36n);
  assertEqual(result.mdc, 6);
});

test("múltiplos e divisores com números coprimos", () => {
  const result = calculate(parseValues("7 11"));
  assertEqual(result.mmc, 77n);
  assertEqual(result.mdc, 1);
});

test("fatoração de 1 não inventa fatores primos", () => {
  assertEqual(factorize(1).size, 0);
  const result = calculate(parseValues("1; 7; 11"));
  assertEqual(result.mmc, 77n);
  assertEqual(result.mdc, 1);
  const onlyOnes = calculate(parseValues("1, 1"));
  assertEqual(onlyOnes.mmc, 1n);
  assertEqual(onlyOnes.mdc, 1);
});

test("três números: MMC(6, 10, 15) = 30 e MDC(15, 25, 35) = 5", () => {
  assertEqual(calculate(parseValues("6, 10, 15")).mmc, 30n);
  assertEqual(calculate(parseValues("15, 25, 35")).mdc, 5);
});

test("limite superior permitido permanece exato", () => {
  const result = calculate(parseValues("1000000, 999983"));
  assertEqual(result.mmc, 999983000000n);
  assertEqual(result.mdc, 1);
});

test("separadores por vírgula, espaço e ponto e vírgula", () => {
  const values = parseValues("12; 18 24");
  assertEqual(values.length, 3);
  assertEqual(values[2], 24);
});

test("rejeita lista com apenas um número", () => {
  assertThrows(() => parseValues("12"), InputError);
});

test("rejeita zero, negativos, decimais, texto e valores acima do limite", () => {
  for (const raw of ["0, 12", "-2, 4", "2.5, 5", "abc, 2", "1000001, 2"]) {
    assertThrows(() => parseValues(raw), InputError);
  }
});

test("MDC e MMC de pares são calculados corretamente", () => {
  assertEqual(gcd(48, 18), 6);
  assertEqual(lcm(48, 18), 144n);
});

summary.textContent = `${passed} passaram; ${failed} falharam.`;
summary.dataset.failed = String(failed);
