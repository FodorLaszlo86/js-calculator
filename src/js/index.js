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
const fractionBtn = document.querySelector('#fraction');
const secondaryDisp = document.querySelector('.calc__display--secondary');
const mainDisp = document.querySelector('.calc__display--main');

/* Calculator State */

const CALCULATOR_STATE = {
    formula: [],
    currElement: '',
    equalOpPressed: false,
    prevOperator: '',
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

        case /\.|[0-9]/.test(btnValue) && !CALCULATOR_STATE.equalOpPressed:
            buildNumber(CALCULATOR_STATE, btnValue);
            break;

        case /\.|[0-9]/.test(btnValue) && CALCULATOR_STATE.equalOpPressed:
            CALCULATOR_STATE.formula = [];
            buildNumber(CALCULATOR_STATE,btnValue);
            CALCULATOR_STATE.equalOpPressed = false;
            break;


        case /[+-\/*]/.test(btnValue) && isValidNumber(CALCULATOR_STATE.currElement):
            handleOperators(CALCULATOR_STATE, btnValue);
            changeOperator(CALCULATOR_STATE, btnValue);
            break;
        
        case /[=]/.test(btnValue):
            console.log(CALCULATOR_STATE.formula.join(''));

            calcResult(CALCULATOR_STATE);
            CALCULATOR_STATE.equalOpPressed = true;
            break;

        // case where some operator pressed and equal is set to true
        case /[+-\/*]/.test(btnValue) && CALCULATOR_STATE.equalOpPressed:
            handleOperators(CALCULATOR_STATE, btnValue);
            CALCULATOR_STATE.equalOpPressed = false;
            break;

        case /^OPP$/.test(btnValue):
            handleOpposite(CALCULATOR_STATE);
            break;

        case /√/.test(btnValue):
            console.log('SAY HOOORAY =)');
            break;

        case /^FR$/.test(btnValue):
            handleFraction(CALCULATOR_STATE);
            CALCULATOR_STATE.currElement = '';
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

        case /^MC$/.test(btnValue):
            resetAll(CALCULATOR_STATE);
            console.log('After MC press current memory:', CALCULATOR_STATE.memory);
            break;

        case /^MR$/.test(btnValue):
            console.log('Calling Memory');
            console.log(CALCULATOR_STATE.formula);
            if(!/\.|[0-9]/.test(CALCULATOR_STATE.formula[CALCULATOR_STATE.formula.length - 1])) {
                console.log('coming from if block formula:', CALCULATOR_STATE.formula);
                CALCULATOR_STATE.formula.push(callMemory(CALCULATOR_STATE));
                updateMainDisplay(callMemory(CALCULATOR_STATE));
                updateProcess(CALCULATOR_STATE.formula);
            }
            console.log('final formula:', CALCULATOR_STATE.formula);
            break;
        
        default: 
            console.log('Default switch statement');

   }

}


const showError = () => {
    updateMainDisplay('ERR');
}

const buildNumber = (state, newChar) => {

    preventMultiDots(state, newChar);
    state.trimZeros();
    updateMainDisplay(state.currElement);

    if(state.currElement.endsWith('.') && state.currElement.length > 1) {
        state.currElement.slice(0, state.currElement.length - 1);
    }
}

const preventMultiDots = (state, char) => {
    if(char === '.' && !state.currElement.includes('.')) {
        state.currElement += char;
    }

    else if(/[0-9]/.test(char)) {
        state.currElement += char;
    }
}


/* Ensures the last typed operator applied, adds operator and number to formula */
const handleOperators = (state, operator) => {
    state.trimZeros();
    state.formula.push(state.currElement, operator);
    updateProcess(state.formula);
    resetCurrElement(state);
    updateMainDisplay(state.currElement);
    console.log('from handleOperators:', state.formula);
}

const changeOperator = (state, operator) => {
    if(/[+-/*]/.test(state.formula[state.formula.length - 1]) && state.formula[state.formula.length - 1] !== operator) {
        state.formula[state.formula.length - 1] = operator;
    }
}


const handleOpposite = state => {
    state.currElement = (state.currElement * -1).toString();
    updateMainDisplay(state.currElement);
}

/* After Pressing the EQUAL Button calculates given formula and updates display */

const calcResult = (state) => {

    state.formula.push(state.currElement);
    //state.cleanFormula();
    updateMainDisplay(state.getResult());
    saveToMemory(state);
    console.log('Current Memory:', state.memory);
    resetCurrElement(state);
    state.formula = [];
    updateProcess(state.formula);
    state.formula.push(state.memory.toString());
    console.log(`Memory after equality: ${state.memory}`);
}

calcBtn.addEventListener('click', mainCalcFn);

const saveToMemory = (state) => {
    state.memory = state.getResult();
}


/* Validate whether input is a Valid number or not */
const isValidNumber = n => {
    return /^[+-.]?[0-9]{1,}(?:\.[0-9]{1,})?$/.test(n);
}


/* Resets Current Element */
const resetCurrElement = (state) => state.currElement = '';



/* Process Expression */


/* Display Result on the UI */

const updateProcess = formula => secondaryDisp.textContent = formula.join(' ');

const updateMainDisplay = result => mainDisp.textContent = result;

const handleUIChange = state => updateProcess(state.formula);

updateMainDisplay(CALCULATOR_STATE.getResult());
document.addEventListener('load', updateMainDisplay);

const handleFraction = state => {
    if(state.currElement > 0) {
        state.currElement =  1 / state.currElement;
        const newEl = state.currElement
        state.formula.push(newEl.toString());
        updateMainDisplay(state.currElement);
    }
};


/* Memory Management Functions */

const resetAll = (state) => {
    state.formula = [];
    state.currElement = '';
    state.memory = '';
    console.log('After resetAll Memory:', state.memory.length)
}

const callMemory = state => {
    if(state.memory.length === 0) {
        return '0';
    } else {
       return state.memory.toString();
    }
}










