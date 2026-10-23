(() => {
  const pairs = [
    { name: 'Капитал', pos: '0% 0%' }, { name: 'Инвестиции', pos: '50% 0%' },
    { name: 'Рынок', pos: '100% 0%' }, { name: 'Платежи', pos: '0% 33.333%' },
    { name: 'Риск', pos: '50% 33.333%' }, { name: 'Аналитика', pos: '100% 33.333%' },
    { name: 'Кредит', pos: '0% 66.666%' }, { name: 'Банк', pos: '50% 66.666%' },
    { name: 'Валюты', pos: '100% 66.666%' }, { name: 'Рост', pos: '0% 100%' },
    { name: 'Защита', pos: '50% 100%' }, { name: 'Стратегия', pos: '100% 100%' }
  ];
  const board = document.querySelector('#board');
  const movesEl = document.querySelector('#moves');
  const matchesEl = document.querySelector('#matches');
  const progressEl = document.querySelector('#progress');
  const resultPanel = document.querySelector('#result-panel');
  const gamePanel = document.querySelector('#game-panel');
  const startButton = document.querySelector('#start-button');
  const playAgainButton = document.querySelector('#play-again-button');
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matches = 0;
  let moves = 0;

  const pad = (value) => String(value).padStart(2, '0');
  const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

  function updateStats() {
    movesEl.textContent = pad(moves);
    matchesEl.textContent = pad(matches);
    progressEl.style.width = `${(matches / pairs.length) * 100}%`;
  }

  function createCard(pair, index) {
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.type = 'button';
    card.dataset.pair = pair.id;
    card.dataset.index = index;
    card.setAttribute('aria-label', `Закрытая карточка ${index + 1}`);
    card.innerHTML = `<span class="card-inner"><span class="card-face card-back" aria-hidden="true"></span><span class="card-face card-front" style="--pos:${pair.pos}" aria-hidden="true"></span></span>`;
    card.addEventListener('click', () => flipCard(card));
    return card;
  }

  function flipCard(card) {
    if (lockBoard || card === firstCard || card.classList.contains('is-matched')) return;
    card.classList.add('is-flipped');
    card.setAttribute('aria-label', `${pairs[Number(card.dataset.pair)].name}, открыта`);
    if (!firstCard) { firstCard = card; return; }
    secondCard = card;
    moves += 1;
    updateStats();
    checkForMatch();
  }

  function checkForMatch() {
    lockBoard = true;
    const match = firstCard.dataset.pair === secondCard.dataset.pair;
    if (match) {
      firstCard.classList.add('is-matched');
      secondCard.classList.add('is-matched');
      firstCard.setAttribute('aria-label', 'Найденная пара');
      secondCard.setAttribute('aria-label', 'Найденная пара');
      matches += 1;
      updateStats();
      resetTurn();
      if (matches === pairs.length) finishGame();
    } else {
      setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');
        resetTurn();
      }, 780);
    }
  }

  function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function finishGame() {
    const accuracy = Math.round((pairs.length / moves) * 100);
    document.querySelector('#final-moves').textContent = pad(moves);
    document.querySelector('#final-accuracy').textContent = `${accuracy}%`;
    resultPanel.hidden = false;
    document.body.classList.add('is-finished');
  }

  function startGame(enterGame = true) {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matches = 0;
    moves = 0;
    const deck = shuffle(pairs.flatMap((pair, id) => [{ ...pair, id }, { ...pair, id }]));
    board.innerHTML = '';
    deck.forEach((pair, index) => board.appendChild(createCard(pair, index)));
    gamePanel.hidden = !enterGame;
    resultPanel.hidden = true;
    document.body.classList.toggle('is-playing', enterGame);
    document.body.classList.remove('is-finished');
    if (enterGame) window.scrollTo({ top: 0, behavior: 'smooth' });
    updateStats();
  }

  startButton.addEventListener('click', () => startGame(true));
  playAgainButton.addEventListener('click', () => startGame(true));
  document.addEventListener('keydown', (event) => { if (event.key.toLowerCase() === 'r') startGame(true); });
  startGame(false);
})();
