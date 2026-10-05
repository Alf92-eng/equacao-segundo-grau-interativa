"use strict";

(() => {
  const MAX_VALUE = 1_000_000;

  class InputError extends Error {}

  function parseValues(raw) {
    const tokens = raw.trim().split(/[,\s;]+/).filter(Boolean);
    if (tokens.length < 2 || tokens.length > 5) {
      throw new InputError("Informe de 2 a 5 números inteiros.");
    }
    if (tokens.some((token) => !/^\d+$/.test(token))) {
      throw new InputError("Use apenas números inteiros positivos, separados por vírgula, espaço ou ponto e vírgula.");
    }
    const values = tokens.map(Number);
    if (values.some((value) => !Number.isSafeInteger(value) || value < 1 || value > MAX_VALUE)) {
      throw new InputError("Cada número deve estar entre 1 e 1.000.000.");
    }
    return values;
  }

  function gcd(left, right) {
    let a = Math.abs(left);
    let b = Math.abs(right);
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  function lcm(left, right) {
    if (left === 0 || right === 0) return 0n;
    return BigInt(left / gcd(left, right)) * BigInt(right);
  }

  function factorize(value) {
    let remaining = value;
    const factors = new Map();
    for (let prime = 2; prime <= remaining / prime; prime += 1) {
      while (remaining % prime === 0) {
        factors.set(prime, (factors.get(prime) || 0) + 1);
        remaining /= prime;
      }
    }
    if (remaining > 1) factors.set(remaining, (factors.get(remaining) || 0) + 1);
    return factors;
  }

  function calculate(values) {
    if (!Array.isArray(values) || values.length < 2 || values.length > 5
      || values.some((value) => !Number.isSafeInteger(value) || value < 1 || value > MAX_VALUE)) {
      throw new RangeError("A lista deve conter de 2 a 5 inteiros entre 1 e 1.000.000.");
    }

    const factorizations = values.map(factorize);
    const primes = [...new Set(factorizations.flatMap((factors) => [...factors.keys()]))].sort((a, b) => a - b);
    const exponents = primes.map((prime) => factorizations.map((factors) => factors.get(prime) || 0));
    const minimumExponents = exponents.map((row) => Math.min(...row));
    const maximumExponents = exponents.map((row) => Math.max(...row));
    const mdc = primes.reduce((product, prime, index) => product * prime ** minimumExponents[index], 1);
    const mmc = primes.reduce((product, prime, index) => product * BigInt(prime) ** BigInt(maximumExponents[index]), 1n);

    return { values, factorizations, primes, exponents, minimumExponents, maximumExponents, mdc, mmc };
  }

  window.MmcMdcMath = Object.freeze({ MAX_VALUE, InputError, calculate, factorize, gcd, lcm, parseValues });
})();
