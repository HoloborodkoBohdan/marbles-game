const playerNameInput = document.querySelector('#player_name_input');
const startButton = document.querySelector('#start');
const startButtonBlock = document.querySelector('.start_button');
const gameBoardBlock = document.querySelector('.game_board');

// default states
startButton.disabled = true;
gameBoardBlock.style.display = 'none';

playerNameInput.addEventListener('input', () => {
  startButton.disabled = !playerNameInput.value;
});

startButton.addEventListener('click', () => {
  if (playerNameInput.value === '') {
    alert('Please enter your player name.');
    return;
  }

  localStorage.setItem('playerName', playerNameInput.value);
  document.querySelector('#player_name').innerHTML = playerNameInput.value;
  startButtonBlock.style.display = 'none';
  gameBoardBlock.style.display = 'flex';
  
});

window.addEventListener('load', () => {
  const savedPlayerName = localStorage.getItem('playerName');
  if (savedPlayerName) {
    playerNameInput.value = savedPlayerName;
    startButton.disabled = false;
  }
});