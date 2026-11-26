const validators = {
	bill: (value) => value !== '' && Number(value) > 0,
	tip: (value) => value === '' || Number(value) >= 0,
	people: (value) => value !== '' && Number(value) > 0,
}

const calculateTip = ({ bill, tip, people }) => {
	const billAmount = Number(bill);
	const tipPercentage = Number(tip);
	const numPeople = Number(people);

	if (!validators.bill(bill) || !validators.tip(tip) || !validators.people(people)) {
		return { tipPerPerson: 0, totalPerPerson: 0 };
	}

	const tipAmount = billAmount * (tipPercentage / 100);
	const tipPerPerson = Math.ceil((tipAmount * 100) / numPeople) / 100;
	const totalAmount = billAmount + (tipPerPerson * numPeople);
	const totalPerPerson = Math.ceil((totalAmount * 100) / numPeople) / 100;

	console.log(tipPerPerson, totalPerPerson);
	return { tipPerPerson, totalPerPerson };
}

const initialState = {
  bill: '',
  people: '',
  tipPercent: 0,
  isCustomTip: false,
  customTipValue: '',
  touched: { bill: false, people: false, customTip: false },
};

const stateReducer = (origState, action) => {
	switch (action.type) {
		case 'UPDATE_BILL':
			return { ...origState,
				bill: action.value,
				touched: { ...origState.touched, bill: true }
			};
		
		case 'UPDATE_PEOPLE':
			return { ...origState,
				people: action.value,
				touched: { ...origState.touched, people: true }
			};

		case 'SELECT_PRESET_TIP':
			return { ...origState, 
				isCustomTip: false,
				tipPercent: Number(action.value)
			};

		case 'ENABLE_CUSTOM_TIP':
			return { ...origState,
				isCustomTip: true,
				tipPercent: Number(origState.customTipValue) || 0	
			};

		case 'SET_CUSTOM_TIP':
			return { ...origState,
				isCustomTip: true,
				customTipValue: action.value,
				tipPercent: Number(action.value) || 0,
				touched: { ...origState.touched, customTip: true }
			}

		case 'RESET':
			return initialState;

		default: 
			return origState;
	}
}

const dom = {
  tipRadios: document.querySelectorAll('.tip-percentage'),
  customTipDiv: document.querySelector('.custom-tip-radio'),
  customTipRadio: document.getElementById('tip-percentage-custom'),
  customTipNumber: document.getElementById('custom-tip'),
  billInput: document.getElementById('bill-amount'),
  peopleInput: document.getElementById('number-of-people'),
  resetButton: document.querySelector('.reset-button'),
  tipPerPerson: document.querySelector('.tip-per-person'),
  totalPerPerson: document.querySelector('.total-per-person'),
};

const getViewModel = (state) => {
	const { tipPerPerson, totalPerPerson } = calculateTip({
    bill: state.bill,
    tip: state.tipPercent,
    people: state.people,
  });

  return {
    bill: {
      value: state.bill,
      isInvalid: state.touched.bill && !validators.bill(state.bill),
      isDefault: !state.touched.bill,
    },
    people: {
      value: state.people,
      isInvalid: state.touched.people && !validators.people(state.people),
      isDefault: !state.touched.people,
    },
    customTip: {
      value: state.customTipValue,
      isInvalid: state.touched.customTip && !validators.tip(state.customTipValue),
      isChecked: state.isCustomTip,
      displayLabel: state.customTipValue !== '' ? `${state.customTipValue}%` : 'Custom',
    },
    selectedPreset: state.isCustomTip ? null : String(state.tipPercent),
    results: {
      tipText: `$${tipPerPerson.toFixed(2)}`,
      totalText: `$${totalPerPerson.toFixed(2)}`,
    },
  };
}

const updateDOM = (viewModel) => {
	dom.billInput.value = viewModel.bill.value;
	dom.billInput.classList.toggle('invalid', viewModel.bill.isInvalid);
	dom.billInput.classList.toggle('default', viewModel.bill.isDefault);

	dom.peopleInput.value = viewModel.people.value;
	dom.peopleInput.classList.toggle('invalid', viewModel.people.isInvalid);
	dom.peopleInput.classList.toggle('default', viewModel.people.isDefault);

	dom.customTipNumber.value = viewModel.customTip.value;
	dom.customTipNumber.required = viewModel.customTip.isChecked;
	dom.customTipNumber.classList.toggle('invalid', viewModel.customTip.isInvalid);
	dom.customTipRadio.checked = viewModel.customTip.isChecked;
	dom.customTipDiv.dataset.display = viewModel.customTip.displayLabel;

	dom.tipRadios.forEach((radio) => {
		if (radio !== dom.customTipRadio) {
			radio.checked = radio.value === viewModel.selectedPreset;
		}
	});

	dom.tipPerPerson.textContent = viewModel.results.tipText;
	dom.totalPerPerson.textContent = viewModel.results.totalText;
}

let currentState = initialState;

const dispatch = (action) => {
  currentState = stateReducer(currentState, action);
  const viewModel = getViewModel(currentState);
  updateDOM(viewModel);
};

dom.billInput.addEventListener('input', (e) => dispatch({ type: 'UPDATE_BILL', value: e.target.value }));
dom.peopleInput.addEventListener('input', (e) => dispatch({ type: 'UPDATE_PEOPLE', value: e.target.value }));
dom.customTipNumber.addEventListener('input', (e) => dispatch({ type: 'SET_CUSTOM_TIP', value: e.target.value }));
dom.customTipNumber.addEventListener('focus', () => dispatch({ type: 'ENABLE_CUSTOM_TIP' }));

dom.tipRadios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (e.target === dom.customRadio) {
      dispatch({ type: 'ENABLE_CUSTOM_TIP' });
      dom.customTipNumber.focus();
    } else {
      dispatch({ type: 'SELECT_PRESET_TIP', value: e.target.value });
    }
  });
});

dom.resetButton.addEventListener('click', () => {
  dispatch({ type: 'RESET' });
  dom.billInput.focus();
});