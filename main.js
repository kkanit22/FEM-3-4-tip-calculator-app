const form = document.querySelector('form');
const tipPercentageRadios = document.querySelectorAll('.tip-percentage');
const customTip = document.querySelector('.custom-tip-radio');
const customRadio = document.getElementById('tip-percentage-custom');
const customNumber = document.getElementById('custom-tip');

let tipPercentage = 0;


customNumber.addEventListener('focus', () => {
	customRadio.checked = true;
	customNumber.required = true;
})

customNumber.addEventListener('input', () => {
	customTip.dataset.display = `${customNumber.value}%`;
	tipPercentage = customNumber.value;
	console.log(customTip.dataset);
	console.log(`Tip Percentage: ${tipPercentage}%`);
})

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
		console.log(`Tip Percentage: ${tipPercentage}%`);
	})
});