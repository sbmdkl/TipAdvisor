import { countries } from "./countryList";
import AsyncStorage from "@react-native-community/async-storage";

//get all details related to the selected country
function findCountry(payload) {
  for (let i = 0; i < countries.length; i++) {
    if (payload === countries[i].name) {
      return countries[i];
    }
  }
}

//default state
function getPlaceholderCountry() {
  return {
    country: {
      name: null,
      flag: null,
      tips: [null],
      selectedTipIndex: null,
      currency: null
    },
    enteredValue: 0,
    amount: 0,
    err: null
  };
}

const reducer = (state = getPlaceholderCountry(), action) => {
  switch (action.type) {
    //updating the selected country
    case "CHANGE_COUNTRY":
      let newCountry = findCountry(action.payload);
      // Persisting new country in AsyncStorage
      AsyncStorage.setItem("COUNTRY", newCountry.name);
      state = {
        ...state,
        country: newCountry
      };
      break;
    //calculating the tip
    case "CALCULATE_TIP":
      let newAmount =
        action.payload *
        state.country.tips[state.country.selectedTipIndex].percentage;
      newAmount = newAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
      state = {
        ...state,
        enteredValue: action.payload,
        amount: newAmount
      };
      break;
    //setting the selected tip type
    case "SET_INDEX":
      state = {
        ...state,
        country: {
          name: state.country.name,
          flag: state.country.flag,
          tips: state.country.tips,
          selectedTipIndex: action.payload,
          currency: state.country.currency,
          optional: state.country.optional
        }
      };
      break;
    //setting the error type
    case "SET_ERROR":
      state = {
        ...state,
        err: action.payload
      };
      break;
    default:
      return state;
  }
  return state;
};

export default reducer;