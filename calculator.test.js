import calculator from './calculator';
import {validateBooking} from './calculator';

// You are welcome to modify and add tests in this file...
// Currently the test asserts that the input is the same as the output

describe('calculator', () => {
  test('outputs booking details to be the same as the input', () => {
    const input = [{
      "id": 1,
      "from": "2017-10-23T08:00:00+11:00",
      "to": "2017-10-23T11:00:00+11:00"
    }];

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2017-10-23T08:00:00+11:00",
      "to": "2017-10-23T11:00:00+11:00",
      "isValid": true,
      "total": 114
    }]);
  });

  test('outputs booking total price should be charged highest rate during booking period', () => {
    const fromSaturday = "2017-10-21T23:00:00+11:00";
    const toSunday = "2017-10-22T02:00:00+11:00"
    
    const input = [{
      "id": 1,
      "from": fromSaturday,
      "to": toSunday
    }];

    const sundayRate = 60.85;
    const bookingDuration = 3;

    expect(calculator(input)).toEqual([{
      "id": 1,
      "from": "2017-10-21T23:00:00+11:00",
      "to": "2017-10-22T02:00:00+11:00",
      "isValid": true,
      "total": bookingDuration * sundayRate
    }]);
  });
});
