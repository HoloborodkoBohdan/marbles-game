/* todo:
 - Players classes
 - PC q-ty of rocks selection
 - user select q-ty of rocks pop-up
 - bi/non-bi popup asking select
 - add notification about "угадал или нет" -> calculate rocks
 - 
*/

/* UI:
 - round number
 - pop-ups for messages prompt/confirm etc...
*/

// UI elements
const playerNameInput = document.querySelector('#player_name_input');
const startButton = document.querySelector('#start');
const startButtonBlock = document.querySelector('.start_button');
const gameBoardBlock = document.querySelector('.game_board');
const buttonContainer = document.querySelector('#button-container');
const helpText = document.querySelector('.help_text');
const selectedPlayer = document.querySelector('#selected_player');
const selectedComputer = document.querySelector('#selected_computer');
const guessPlayer = document.querySelector('#guess_player');
const guessComputer = document.querySelector('#guess_computer');
const roundNumber = document.querySelector('#round_number');
const playerScore = document.querySelector('#player_score');
const computerScore = document.querySelector('#computer_score');

// default states
startButton.disabled = true;
gameBoardBlock.style.display = 'none';


class Player {
    constructor(isMachine) {
        this.currentMarbles = 10;
        this.selectedMarbles = 0;
        this.isMachine = isMachine;
        this.choise = null;
        this.name = isMachine ? 'Computer' : 'Player';
    }
    getCurrentMarbles = () => this.currentMarbles;
    getSelectedMarbles = () => this.selectedMarbles;
    addMarbles = marbles => this.currentMarbles += marbles;
    setSelectedMarbles = marbles => this.selectedMarbles = marbles;

    selectMarbles = () => {
        if (this.isMachine) {
            this.machineSelectMarbles(1, this.getCurrentMarbles())
        } else {
            this.humanSelectMarbles();
        }
    }

    machineSelectMarbles = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        const selectedMaribles = Math.floor(Math.random() * (max - min + 1)) + min;

        this.setSelectedMarbles(selectedMaribles);
        selectedComputer.innerHTML = `${selectedMaribles}`;
    };

    humanSelectMarbles = () => { // wtf?
        const currentMarbles = this.getCurrentMarbles();
    };

    machineGuessOddOrEven = () => {
        this.choise = Math.random() < 0.5 ? 'even' : 'odd';
        return this.choise;
    }
};

class GameTemplate {
    constructor() {
        this.isMachineTurn = this.getRandomBoolean();
        this.player = new Player(false);
        this.machine = new Player(true);
        this.roundNumber = 1;
    }

    getRandomBoolean = () => Math.random() < 0.5;
    setIsMachineTurn = () => this.isMachineTurn = !this.isMachineTurn;
    getIsMachineTurn = () => this.isMachineTurn;

    renderPlayerMarblesSelection = () => {
        buttonContainer.innerHTML = '';

        for (let i = 1; i <= this.player.getCurrentMarbles(); i++) {
            const button = document.createElement('button');
            button.classList.add('marble_btn');
            button.textContent = i;
            button.addEventListener('click', () => {
                this.player.selectedMarbles = i;
                this.player.setSelectedMarbles(i);
                selectedPlayer.innerHTML = `${i}`;
                this.selectOddOrEven();
            });
            buttonContainer.appendChild(button);
            helpText.innerHTML = 'Select marbles for your move';
        }

    }

    renderRound = () => {
        roundNumber.innerHTML = GAME.roundNumber;
        playerScore.innerHTML = GAME.player.getCurrentMarbles();
        computerScore.innerHTML = GAME.machine.getCurrentMarbles();
        guessComputer.innerHTML = '';
        guessPlayer.innerHTML = '';
        selectedComputer.innerHTML = '';
        selectedPlayer.innerHTML = '';
    }

    computeNextLevel() {
        this.roundNumber++;
        this.player.selectedMarbles = 0;
        this.machine.selectedMarbles = 0;
        this.player.choise = null;
        this.machine.choise = null;
        this.player.selectMarbles();
        this.machine.selectMarbles();
        this.renderPlayerMarblesSelection();
        renderRound();
    }

    renderPlayerSelectOddEven = () => {
        buttonContainer.innerHTML = '';

        const oddButton = document.createElement('button');
        oddButton.classList.add('marble_btn');
        oddButton.textContent = 'Odd';

        oddButton.addEventListener('click', () => {
            this.player.choise = 'odd';
            guessPlayer.innerHTML = this.player.choise;
            buttonContainer.innerHTML = '';
        });
        buttonContainer.appendChild(oddButton);

        const evenButton = document.createElement('button');
        evenButton.classList.add('marble_btn');
        evenButton.textContent = 'Even';

        evenButton.addEventListener('click', () => {
            this.player.choise = 'even';
            guessPlayer.innerHTML = this.player.choise;
            buttonContainer.innerHTML = '';
        });
        buttonContainer.appendChild(evenButton);

        helpText.innerHTML = 'Select odd or even';
    }

    selectOddOrEven = () => {
        if (this.getIsMachineTurn()) {
            this.machine.machineGuessOddOrEven();
            guessComputer.innerHTML = this.machine.choise;
            buttonContainer.innerHTML = '';
            this.defineWinner(this.machine, this.player);
        } else {
            this.renderPlayerSelectOddEven();
            this.defineWinner(this.player, this.machine);
        }
    }

    defineWinner = (player, oponent) => { // player is a side, who choose odd or even
        let result = null;
        if (player.choise === 'even') {
            result = oponent.getSelectedMarbles() % 2 === 0 ? 'win' : 'lose';
        } else {
            result = oponent.getSelectedMarbles() % 2 === 0 ? 'lose' : 'win';
        }

        helpText.innerHTML = `Round result: ${player.name} ${result}`;

        if (result === 'win') {
            player.addMarbles(oponent.getSelectedMarbles());
            oponent.addMarbles(-oponent.getSelectedMarbles());
            this.computeNextLevel()
        } else {
            // oponent make guess for same quantity of marbles
            this.setIsMachineTurn();
            this.selectOddOrEven();
        }
        return result;
    }

    /*
    - start game
    - validation on continue game (and start next round)
    - end game
    - add current round index
  
  
    - matrix creation/rendering here
    - analysis how much marbles user should select
    - analysis even or odd selection
    */
};

let GAME = new GameTemplate();


// events
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
    GAME.player.name = playerNameInput.value;

    startButtonBlock.style.display = 'none';
    gameBoardBlock.style.display = 'flex';

    GAME.machine.selectMarbles();
    GAME.player.selectMarbles();
    GAME.renderPlayerMarblesSelection();

});

window.addEventListener('load', () => {
    const savedPlayerName = localStorage.getItem('playerName');
    if (savedPlayerName) {
        playerNameInput.value = savedPlayerName;
        startButton.disabled = false;
    }
});