import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import _ from 'lodash';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

export function isEmpty(str) {
  return (!str || str.length === 0 );
}

export function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

export function addOrRemove(array, value) {
  var index = array.indexOf(value);

  if (index === -1) {
      array.push(value);
  } else {
      array.splice(index, 1);
  }
}

export function numbers_string_to_number(numbersString) {
  let numbersInString = numbersString.split(" ");
  numbersInString = _.uniq(numbersInString);

  let numericValue = numbersInString.reduce(
    (accumulator, currentValue) => {

      if (isNumeric(currentValue)) {
        let currentValueAsNumber = parseInt(currentValue)
        if (currentValueAsNumber < 32 && currentValueAsNumber >= 0) {
          let shiftedValue = (1 << currentValueAsNumber) >>> 0;
          return accumulator + shiftedValue
        }
        return accumulator
      }
      return accumulator
    },
    0
  )
  return numericValue
}

export function numbers_string_to_hex_number(numberString) {
  let converted = numbers_string_to_number(numberString)
  return converted.toString(16)
}
