// MC = Memory Clear sets the memory to 0 
// MR = Memory Recall uses the number in memory, acts as if you had keyed in that number yourself 
// MS = Memory Store puts the number on the display into the memory 
// M+ = Memory Add takes the number on the display, adds it to the memory, and puts the result into memory
// M- = Memory Substract takes the number on the display, substracts it from the memory, and puts the result into memory
// C  = Clears the entire memory including storage, display and current calculation
// CE = Clears the actual number from the display, but not from the memory nor from the calculation


/* Get Elements from the DOM */

const calcBtn = document.querySelector('.calc__keyboard');
const equalBtn = document.querySelector('.calc__btn--equal');
const secondaryDisp = document.querySelector('.calc__display--secondary');
const mainDisp = document.querySelector('.calc__display--main');

/* Calculator State */

const CALCULATOR_STATE = {
    formula: [],
    currElement: '',
    prevElement: '',
    memory: '',

    getResult: function() {
        return this.formula.length > 0 ? eval(this.formula.join(' ')) : 0;
    },

    cleanFormula: function() {
        if(this.formula[this.formula.length - 1] === '') {
            this.formula = this.formula.slice(0, -2);
        }
    },

    trimZeros: function() {
        if(/^0{1,}/.test(this.currElement)) {
            this.currElement = this.currElement.replace(/^0+(?=\d)/, '')
        }
    }
}


/* CALCULATOR CONTROLS */
const mainCalcFn = (event) => {
   const btnValue = event.target.textContent;

    switch(btnValue !== '') {
        case /\.|[0-9]/.test(btnValue):
            buildNumber(CALCULATOR_STATE, btnValue);
            break;

        case /[+-/*]/.test(btnValue) && isValidNumber(CALCULATOR_STATE.currElement):
            handleOperators(CALCULATOR_STATE, btnValue);
            break;
        
        case /[=]/.test(btnValue):
            calcResult(CALCULATOR_STATE, CALCULATOR_STATE);
            break;

        case /^OPP$/.test(btnValue):
            handleOpposite(CALCULATOR_STATE);
            break;

        case /√/.test(btnValue):
            console.log('SAY HOOORAY =)');
            break;

        case /^C$/.test(btnValue):
            resetCurrElement(CALCULATOR_STATE);
            updateMainDisplay('0');
            break;
        
        case /^CE$/.test(btnValue):
            resetAll(CALCULATOR_STATE);
            updateMainDisplay('0');
            updateProcess(CALCULATOR_STATE.formula);
            break;
        
        default: 
            showError();

   }

}


const showError = () => {
    updateMainDisplay('ERR');
}

const buildNumber = (state, newChar) => {

    preventMultiDots(state, newChar);
    state.trimZeros();
    updateMainDisplay(state.currElement);

    if(state.currElement.endsWith('.') && state.currElement.length > 2) {
        state.currElement.slice(0, state.currElement.length - 1);
    }
}

const preventMultiDots = (state, char) => {
    if(char === '.' && !state.currElement.includes('.')) {
        state.currElement += char;
    }

    else if(char !== '.') {
        state.currElement += char;
    }
}


/* Ensures the last typed operator applied, adds operator and number to formula */
const handleOperators = (state, operator) => {
    state.trimZeros();

    state.formula.push(state.currElement, operator);

    if(state.formula[state.formula.length - 1] !== operator ) {
        state.formula = state.formula.slice(0, -1);
        state.formula.push(operator);
    }


    updateProcess(state.formula);
    resetCurrElement(state);
    updateMainDisplay(state.currElement);
}


const handleOpposite = state => {
    state.currElement = (state.currElement * -1).toString();
    updateMainDisplay(state.currElement);
}

/* After Pressing the EQUAL Button calculates given formula and updates display */

const calcResult = (state, {formula, currElement}) => {

    formula.push(currElement);
    state.cleanFormula();
    resetCurrElement(state);
    updateMainDisplay(state.getResult());
    CALCULATOR_STATE.formula = [];
    updateProcess(CALCULATOR_STATE.formula);
}

calcBtn.addEventListener('click', mainCalcFn);


/* Validate whether input is a Valid number or not */
const isValidNumber = n => {
    return /^[+-.]?[0-9]{1,}(?:\.[0-9]{1,})?$/.test(n);
}


/* Resets Current Element */
const resetCurrElement = (state) => state.currElement = '';

const resetAll = (state) => {
    state.formula = [];
    state.currElement = '';
    state.memory = '';
}


/* Process Expression */


/* Display Result on the UI */

const updateProcess = formula => secondaryDisp.textContent = formula.join(' ');

const updateMainDisplay = result => mainDisp.textContent = result;

const handleUIChange = () => {
    updateProcess(CALCULATOR_STATE.formula);
}

updateMainDisplay(CALCULATOR_STATE.getResult());








