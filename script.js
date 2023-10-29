//TODO IDEA: show button to continue next step!!! say Bohdan
//WARNING: bag where user should click 2-3 times swill exist!!!!

// UI elements
const playerNameInput = document.querySelector('#player_name_input');
const startButton = document.querySelector('#start');
const startButtonBlock = document.querySelector('.start_button');
const gameInterfaceBlock = document.querySelector('.game_interface');
const gameBoardBlock = document.querySelector('.game_board');
const buttonContainer = document.querySelector('#button-container');
const helpText = document.querySelector('.help_text');
const selectedPlayer = document.querySelector('#selected_player');
const selectedComputer = document.getElementById('selected_computer');
const guessPlayer = document.querySelector('#guess_player');
const guessComputer = document.querySelector('#guess_computer');
const roundNumber = document.querySelector('#round_number');
const playerScore = document.querySelector('#player_score');
const playerName = document.querySelector('#player_name');
const computerName = document.querySelector('#computer_name');
const computerScore = document.querySelector('#computer_score');
const gameLogs = document.querySelector('.game_logs');

// default states
startButton.disabled = true;
gameInterfaceBlock.style.display = 'none';


// popups
const rulesPopup = new Popup({
    id: "rules",
    title: "Rules",
    content:
        "At the beginning, each player has 10 marbles. Each round, players take an arbitrary number of marbles in their fist and take turns guessing whether the opponent has taken an even or odd number of marbles.",
    sideMargin: "2.9vw",
    titleColor: "#fff",
    textColor: "#fff",
    backgroundColor: "#222",
    closeColor: "#fff",
    fontSizeMultiplier: 1.2,
    linkColor: "#888",
});

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

    machineSelectMarbles = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        const selectedMaribles = Math.floor(Math.random() * (max - min + 1)) + min;

        this.setSelectedMarbles(selectedMaribles);
        selectedComputer.innerHTML = `${selectedMaribles}`;
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
        this.roundNumber = 0;
    }

    getRandomBoolean = () => Math.random() < 0.5;
    setIsMachineTurn = () => this.isMachineTurn = !this.isMachineTurn;
    getIsMachineTurn = () => this.isMachineTurn;

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
        this.renderPlayerMarblesSelection();
        this.renderRound();

        this.machine.machineSelectMarbles(1, this.machine.getCurrentMarbles());
    }

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
            if (this.isMachineTurn) {
                computerName.classList.add('active');
                playerName.classList.remove('active');
            } else {
                playerName.classList.add('active');
                computerName.classList.remove('active');
            }
            helpText.innerHTML = `Select marbles for your move.`;
        }
        //todo: remove!!!
        this.renderMatrix();

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
            this.defineWinner(this.player, this.machine);
        });
        buttonContainer.appendChild(oddButton);

        const evenButton = document.createElement('button');
        evenButton.classList.add('marble_btn');
        evenButton.textContent = 'Even';

        evenButton.addEventListener('click', () => {
            this.player.choise = 'even';
            guessPlayer.innerHTML = this.player.choise;
            buttonContainer.innerHTML = '';
            this.defineWinner(this.player, this.machine);
        });
        buttonContainer.appendChild(evenButton);

        helpText.innerHTML = 'Select odd or even';
    }

    selectOddOrEven = () => {
        const turn = this.getIsMachineTurn();
        if (this.getIsMachineTurn()) {
            this.machine.machineGuessOddOrEven();
            guessComputer.innerHTML = this.machine.choise;
            buttonContainer.innerHTML = '';
            this.defineWinner(this.machine, this.player);
        } else {
            this.renderPlayerSelectOddEven();
        }
    }

    defineWinner = (player, oponent) => { // player is a side, who choose odd or even
        this.setIsMachineTurn();
        const isEvenOrOdd = oponent.getSelectedMarbles() % 2 === 0 ? 'even' : 'odd';
        const result = isEvenOrOdd === player.choise ? 'win' : 'lose';
        const playerSelectedMarbles = player.getSelectedMarbles();
        const oponentCurrentMarbles = oponent.getCurrentMarbles();

        const roundLogText = `Round ${this.roundNumber}: ${player.name} ${result}: (${player.choise} for ${oponent.getSelectedMarbles()}) with ${player.getSelectedMarbles()} on hand`;
        const newLogElem = document.createElement('div');
        newLogElem.innerHTML = roundLogText;
        gameLogs.prepend(newLogElem);

        if (result === 'win') {
            //todo: it looks here should smth be changed
            if(oponentCurrentMarbles <= playerSelectedMarbles) {
                player.addMarbles(oponentCurrentMarbles);
                oponent.addMarbles(-oponentCurrentMarbles);
                helpText.innerHTML = `Winner is: ${player.name}`;
                playerScore.innerHTML = GAME.player.getCurrentMarbles();
                computerScore.innerHTML = GAME.machine.getCurrentMarbles();
                return; // return finish popup
            }

            player.addMarbles(playerSelectedMarbles);
            oponent.addMarbles(-playerSelectedMarbles);

        } else {
            oponent.addMarbles(oponentCurrentMarbles);
            player.addMarbles(-oponentCurrentMarbles);
        }

        this.computeNextLevel();
    }

    renderMatrix() {
        //matrix data generation
        const playerCurrentMarbles = this.player.getCurrentMarbles();
        const length = this.machine.getCurrentMarbles();
        const machineMarblesList = Array.from({ length }).map((_, i) => i + 1);

        const generateMatrixRow = (isEvenSelect) => machineMarblesList.map((marblesQty) => {
            const isEvenQty = marblesQty % 2 === 0;
            const expectedProfit = playerCurrentMarbles > marblesQty ? marblesQty : playerCurrentMarbles;
        
            if(isEvenSelect) {
                return isEvenQty ? `(${expectedProfit}, 0)` : `(0, ${-expectedProfit})`;
            }
            return isEvenQty ? `(0, ${-expectedProfit})` : `(${expectedProfit}, 0)`;    
        });

        const matrixData = [machineMarblesList, generateMatrixRow(true), generateMatrixRow(false)];
        
        // matrix creation
        const tableContainer = document.querySelector(".game_matrix");
        const table = document.createElement("table");
        const headers = ["Marbles in the fist", "Player guessed even", "Player guessed edd"];
        headers.forEach(headerText => {
            const headerCell = document.createElement("th");
            headerCell.textContent = headerText;
        });

        matrixData.forEach((rowData, rowIndex) => {
            const row = document.createElement("tr");
            const firstCell = document.createElement("td");
                firstCell.textContent = headers[rowIndex];
                row.appendChild(firstCell);
            rowData.forEach(cellData => {
                const cell = document.createElement("td");
                cell.textContent = cellData;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
        tableContainer.innerHTML = "";
        tableContainer.appendChild(table);
    }
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
    playerName.innerHTML = playerNameInput.value;
    GAME.player.name = playerNameInput.value;

    startButtonBlock.style.display = 'none';
    gameInterfaceBlock.style.display = 'flex';

    GAME.computeNextLevel();
});

window.addEventListener('load', () => {
    const savedPlayerName = localStorage.getItem('playerName');
    if (savedPlayerName) {
        playerNameInput.value = savedPlayerName;
        startButton.disabled = false;
    }
});

document.querySelector('#rules').addEventListener('click', () => {
    rulesPopup.show();
});