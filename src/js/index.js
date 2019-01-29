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

    result: function() {
        return this.formula.length > 0 ? eval(this.formula.join(' ')) : '0';
    }
}


/* Build the Expression to evaluate from UI clicks */
const buildFormula = (event) => {
   const getValue = event.target.textContent;
   console.log(getValue);

   // If buttons 0-9 or . was pressed, character added to newItem
   if(/\.|[0-9]/.test(getValue)) {
    
        CALCULATOR_STATE.currElement += getValue;
        if(isValidNumber(CALCULATOR_STATE.currElement)) {
            updateMainDisplay(CALCULATOR_STATE.currElement);
        }

        else if(CALCULATOR_STATE.currElement.endsWith('.') && CALCULATOR_STATE.currElement.length > 2) {
            CALCULATOR_STATE.currElement.slice(0, CALCULATOR_STATE.currElement.length - 1);
        }
   }
   // If Arithmetic operators are pressed, newItem is pushed to formula in the state, operator as well
   else if(/[+-/*]/.test(getValue) && isValidNumber(CALCULATOR_STATE.currElement)) {
       CALCULATOR_STATE.formula.push(CALCULATOR_STATE.currElement, getValue);
       CALCULATOR_STATE.currElement = '';
       updateProcess(CALCULATOR_STATE.formula);
       updateMainDisplay(CALCULATOR_STATE.currElement);
   }

   else if(/[=]/.test(getValue)) {
        CALCULATOR_STATE.formula.push(CALCULATOR_STATE.currElement);
        CALCULATOR_STATE.currElement = CALCULATOR_STATE.result();
        CALCULATOR_STATE.formula = [];
        updateMainDisplay(CALCULATOR_STATE.currElement);
        updateProcess(CALCULATOR_STATE.formula);
        
   }


}

calcBtn.addEventListener('click', buildFormula);


/* Validate whether input is a Valid number or not */
const isValidNumber = n => {
    return (n !== '.' && n !== '') ? 
            n.split('').filter(char => char === '.').length < 2 && /[0-9]$/.test(n) :
            false;
}


/* Process Expression */
/* Display Result on the UI */


const updateProcess = formula => {
    secondaryDisp.textContent = formula.join(' ');
}

updateProcess(CALCULATOR_STATE.formula);

const updateMainDisplay = result => mainDisp.textContent = result;

updateMainDisplay(CALCULATOR_STATE.result());



