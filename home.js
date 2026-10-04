"use strict";

const searchInput = document.querySelector("#topic-search");
const topicCards = [...document.querySelectorAll(".topic-card")];
const searchStatus = document.querySelector("#search-status");
const emptySearch = document.querySelector("#empty-search");
const answerButtons = [...document.querySelectorAll(".answer-option")];
const challengeFeedback = document.querySelector("#challenge-feedback");

function normalizeSearchText(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

searchInput.addEventListener("input", () => {
  const query = normalizeSearchText(searchInput.value.trim());
  let visibleCount = 0;

  for (const card of topicCards) {
    const searchableText = normalizeSearchText(`${card.dataset.search} ${card.textContent}`);
    const matches = searchableText.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  }

  searchStatus.textContent = query
    ? `${visibleCount} ${visibleCount === 1 ? "assunto encontrado" : "assuntos encontrados"}`
    : `${visibleCount} assuntos para explorar`;
  emptySearch.hidden = visibleCount !== 0;
});

for (const button of answerButtons) {
  button.addEventListener("click", () => {
    const isCorrect = button.dataset.answer === "8";

    for (const option of answerButtons) {
      const selected = option === button;
      option.setAttribute("aria-pressed", String(selected));
      option.dataset.result = selected ? (isCorrect ? "correct" : "wrong") : "";
    }

    challengeFeedback.dataset.state = isCorrect ? "correct" : "wrong";
    challengeFeedback.textContent = isCorrect
      ? "Isso! 2 × 2 × 2 = 8. Três fatores iguais a 2."
      : "Ainda não. Multiplique três fatores iguais: 2 × 2 × 2.";
  });
}
