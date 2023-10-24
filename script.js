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
 - display Players status (currentMarbles, selectedMarbles);
 

 - pop-ups for messages prompt/confirm etc...
 - name of player entering
*/

const getRandomBoolean = () => Math.random() < 0.5;

class Player {
    constructor() {
        this.currentMarbles = 10;
        this.selectedMarbles = 0;
    }
    getCurrentMarbles = () => this.currentMarbles;
    getSelectedMarbles = () => this.selectedMarbles;
    addMarbles = marbles => this.currentMarbles += marbles;
    setSelectedMarbles = marbles => this.selectedMarbles = marbles;
};

class GameTemplate {
    constructor() {
        this.isMachineTurn = getRandomBoolean();
        this.players = [MACHINE, HUMAN]; //todo: think about automation player turn
    }
    setIsMachineTurn = () => this.isMachineTurn = !this.isMachineTurn;
    getIsMachineTurn = () => this.isMachineTurn;
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

const MACHINE = new Player();
const HUMAN = new Player();
let GAME = new GameTemplate();

// console.log(GAME.getPlayers())

const humanSelectMarbles = () => {
    const currentMarbles = HUMAN.getCurrentMarbles();
    const message_HumanSelectMarbles = `How much marbles you'd like to select ? You can turn from 1 to ${currentMarbles >= 10 ? 10 : currentMarbles}`;
    const selectedMaribles = prompt(message_HumanSelectMarbles);
    console.log(`you select ${selectedMaribles}`)
    HUMAN.setSelectedMarbles(selectedMaribles);
};

const machineSelectMarbles = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const marblesSelected = Math.floor(Math.random() * (max - min + 1)) + min;
    
    MACHINE.setSelectedMarbles(marblesSelected);
    console.log('Machine selected:', MACHINE.selectedMarbles)
};

const machineGuessEven = () => getRandomBoolean(); //true is even, false is odd

const startRound = () => {
    humanSelectMarbles();
    machineSelectMarbles(1, MACHINE.getCurrentMarbles());

    if(GAME.getIsMachineTurn()) {
        const machineGuessed = machineGuessEven();
        console.log(`machine guessed ${machineGuessed ? 'even number' : 'odd number'}`);
        
        if((machineGuessed === !(HUMAN.getSelectedMarbles() % 2))) {
            console.log('machine guessed right');
            return
        }
        console.log('machine guessed wrong');
    };

    const confirm = window.confirm('Чет или не чет ?');
    
    if(confirm === !(MACHINE.getSelectedMarbles() % 2)) {
        console.log('you win');
    }
};

startRound();

