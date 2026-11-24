const form = document.querySelector('form');
const tipPercentageRadios = document.querySelectorAll('.tip-percentage');
const customTip = document.querySelector('.custom-tip-radio');
const customRadio = document.getElementById('tip-percentage-custom');
const customNumber = document.getElementById('custom-tip');
const billInput = document.getElementById('bill-amount');
const peopleInput = document.getElementById('number-of-people');
const resetButton = document.querySelector('.reset-button');

let tipPercentage = 0;
let numberInputs = [customNumber, billInput, peopleInput];
const validInputs = {
	bill_amount: (value) => Math.sign(value) > 0,
	custom_tip: (value) => Math.sign(value) >= 0,
	number_of_people: (value) => Math.sign(value) > 0,
}

const setInvalid = (input) => {
	!input.classList.contains('invalid') ? input.classList.add('invalid') : null;
}

const setValid = (input) => {
	input.classList.contains('invalid') ? input.classList.remove('invalid') : null;
}

const setDefault = (input, setting) => {
	if (!input.name.includes('custom_tip')) {
		setting && !input.classList.contains('default') ?
			input.classList.add('default') :
			!setting && input.classList.contains('default') ?
				input.classList.remove('default') :
				null;
	}
}

const updateCustomTip = () => {
	customNumber.value === "" ? tipPercentage = 0 : tipPercentage = customNumber.value;
	tipPercentage ? customTip.dataset.display = `${customNumber.value}%` : customTip.dataset.display = 'Custom';
}

const validateNumberInput = (input) => {
	input.name.includes('custom_tip') ? updateCustomTip() : null;
	input.value > 0 && setDefault(input, false);
	validInputs[input.name](input.value) ? setValid(input) : setInvalid(input);
}

const resetForm = () => {
	numberInputs.forEach((input) => {
		input.value = "";
		setValid(input);
		setDefault(input, true);
	});
	updateCustomTip();
}

customNumber.addEventListener('focus', () => {
	customRadio.checked = true;
	customNumber.required = true;
});

customNumber.addEventListener('input', () => {

});

tipPercentageRadios.forEach((radio) => {
	radio.addEventListener('change', (e) => {
		if (customRadio.checked) {
			customNumber.focus();
			tipPercentage = customNumber.value;
		} else {
			customNumber.required = false;
			customNumber.value = '';
			tipPercentage = e.target.value;
		}
	});
});

numberInputs.forEach((input) => {
	input.addEventListener('input', (e) => {
		validateNumberInput(e.target);
	});
});

resetButton.addEventListener('click', () => { resetForm() });

