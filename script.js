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

guess_computer
const roundNumber = document.querySelector('#round_number');
const playerScore = document.querySelector('#player_score');
const playerName = document.querySelector('#player_name');
const computerName = document.querySelector('#computer_name');
const computerScore = document.querySelector('#computer_score');
const gameLogs = document.querySelector('.game_logs');
const tableContainer = document.querySelector(".game_matrix");

// default states
startButton.disabled = true;
gameInterfaceBlock.style.display = 'none';

const RoundSteps = {
    SELECT_MARABLES_TO_FIST: 'SELECT_MARABLES_TO_FIST',
    SELECT_EVEN_OR_ADD: 'SELECT_MARABLES_TO_FIST',
}


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
    getName = () => this.name;

    machineSelectMarbles = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        const selectedMaribles = Math.floor(Math.random() * (max - min + 1)) + min;

        this.setSelectedMarbles(selectedMaribles);
        // selectedComputer.innerHTML = `${selectedMaribles}`;
        showLoader(selectedComputer, `${selectedMaribles}`);
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

    renderButtonAfterMachineTurn() {
        buttonContainer.innerHTML = ''
        const finshRoundWrapper = document.createElement('div');
        const finishRoundButton = document.createElement('button');
        const finishRoundTextElem = document.createElement('span');
        finishRoundTextElem.innerHTML = 'Computer has selected guess. Click "OK" button to finish round'
        finishRoundButton.classList.add('marble_btn');
        finishRoundButton.textContent = 'Ok';
        //todo: update dynamic styles to similar focus behaviour
        // finishRoundButton.disabled = true;
        finishRoundButton.addEventListener('click', () => {
            this.defineWinner(this.machine, this.player);
        });

        finshRoundWrapper.appendChild(finishRoundTextElem);
        finshRoundWrapper.appendChild(finishRoundButton);

        buttonContainer.appendChild(finshRoundWrapper);
    };

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

                this.getIsMachineTurn() && this.renderButtonAfterMachineTurn();
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
        // this.isMachineTurn ? 
        //     this.renderMatrix(this.machine, this.player, RoundSteps.SELECT_MARABLES_TO_FIST) : 
        //     this.renderMatrix(this.player, this.machine, RoundSteps.SELECT_MARABLES_TO_FIST);
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
        //can be removed
        this.renderMatrix(this.player, this.machine, RoundSteps.SELECT_EVEN_OR_ADD);
    }

    selectOddOrEven = () => {
        if (this.getIsMachineTurn()) {
            this.machine.machineGuessOddOrEven();
            showLoader(guessComputer, this.machine.choise);

            //todo: if with loader everything fine, lines under can be deleted
            // guessComputer.innerHTML = this.machine.choise;
            // buttonContainer.innerHTML = '';
            // this.defineWinner(this.machine, this.player);
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
        const oponentSelectedMarbles = oponent.getSelectedMarbles();

        const roundLogText = `Round ${this.roundNumber}: ${player.name} ${result}: (${player.choise} for ${oponent.getSelectedMarbles()}) with ${player.getSelectedMarbles()} on hand`;
        const newLogElem = document.createElement('div');
        newLogElem.innerHTML = roundLogText;
        gameLogs.prepend(newLogElem);

        if (result === 'win') {
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
            oponent.addMarbles(oponentSelectedMarbles);
            player.addMarbles(-oponentSelectedMarbles);
        }

        this.computeNextLevel();
    }

    renderMatrix(player, oponent, roundStep) { // player is a side, who choose odd or even; round step can be remomed at the moment
        const isPlayerMachine = player.getName() === 'Computer';
        tableContainer.innerHTML = "";

        //matrix data generation
        const playerCurrentMarbles = player.getCurrentMarbles();
        const playerSelectedMarbles = player.getSelectedMarbles();
        const oponentCurrentMarbles = oponent.getCurrentMarbles();
        const length = player.getCurrentMarbles();
        const oponentMarblesList = Array.from({ length }).map((_, i) => i + 1);
        const generateMatrixRow = (isEvenSelect) => oponentMarblesList.map((marblesQty) => {
            const isEvenQty = marblesQty % 2 === 0;
            //todo: here should be fixed 10+
            const expectedProfit = playerCurrentMarbles > marblesQty ? marblesQty : playerCurrentMarbles;
        
            if(isEvenSelect) {
                return isEvenQty ? `+${playerSelectedMarbles}` : `-${-marblesQty}`;
            }
            return isEvenQty ? `-${-marblesQty}` : `+${playerSelectedMarbles}`;    
        });

        const matrixData = [oponentMarblesList, generateMatrixRow(true), generateMatrixRow(false)];
        
        // table 1 creation
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        for (let i = 0; i <= oponent.getCurrentMarbles(); i++) {
            const headerCell = document.createElement("th");
            headerCell.textContent = i == 0 ? `${player.name} / ${oponent.name}` : i;
            thead.appendChild(headerCell);
        }
        table.appendChild(thead);

        for (let i = 1; i <= player.getCurrentMarbles(); i++) {
            const row = document.createElement("tr");
            if (i == player.getSelectedMarbles()) {
                row.classList.add("act");
            }
            for (let j = 0; j <= oponent.getCurrentMarbles(); j++) {
                const cell = document.createElement("td");
                let fill = "";
                if (j == 0) {
                    fill = i;
                } else if (player.getCurrentMarbles() > 2) {
                    if (i > player.getCurrentMarbles() -2) {
                        fill = "X";
                    }
                }
                cell.textContent = fill === "" ? `${i} - ${j}`: fill;
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody);

        // table 2 creation
        const table2 = document.createElement("table");
        const headers = isPlayerMachine ? ["Marbles in the machine fist", "Machine guessed even", "Machine guessed edd"] : ["Marbles in machine fist", "Player guessed even", "Player guessed edd"]
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
            table2.appendChild(row);
        });

        
        tableContainer.innerHTML = "";
        let h1 = document.createElement("h3");
        h1.innerHTML = "Matrix for selection";
        tableContainer.appendChild(h1);
        tableContainer.appendChild(table);
        let h2 = document.createElement("h3");
        h2.innerHTML = "Matrix for odd or even";
        tableContainer.appendChild(h2);
        tableContainer.appendChild(table2);
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

//loader
const showLoader = (targetElem, afterLoaderElem, callback) => { //you can pass afterLoaderElem as string as HTML elem
    const loaderWrapper = document.createElement('span');
    loaderWrapper.className = "loader";
    for(var i = 1; i <= 4; i++) { 
        const box = document.createElement('span');
        box.className = 'loader-box';
        loaderWrapper.appendChild(box);
    }
    targetElem.appendChild(loaderWrapper);

    setTimeout(() => {
        loaderWrapper.remove();
        targetElem.innerHTML = afterLoaderElem;

        //remove comment and previous line if there will be any bug after removing loader
        // if(afterLoaderElem.nodeType) {
        //     targetElem.appendChild(afterLoaderElem);
        // } else {
            // targetElem.innerHTML = afterLoaderElem;
        // }
    }, 3000)
}; 