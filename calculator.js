// Add your implementation for booking calculator in this file...
// Currently it just outputs the same input
const fs = require("fs");
const moment = require("moment-timezone");

const calculator = (input) => {
    const result = input.map(booking => {
    const { id, from, to } = booking;
    
    const isValid = validateBooking(from, to);

    if (!isValid) {
      return {
        id,
        from,
        to,
        isValid,
        total: 0,
      };
    } 

    const fromTime = moment(from).tz("Australia/Sydney");
    const toTime = moment(to).tz("Australia/Sydney");
    const fromHour = fromTime.hour();
    const toHour = toTime.hour();

    const duration = moment.duration(toTime.diff(fromTime));
    const durationInHours = duration.asHours();

    console.log(duration)
    console.log(durationInHours)

    const rateType = getRateType(fromTime, fromHour, toTime, toHour, durationInHours);

    const total = calculateTotal(rateType, durationInHours);

    return {
      id,
      from,
      to,
      isValid,
      total: Number(total.toFixed(2))
    };
  });

  fs.writeFileSync("output.json", JSON.stringify(result, null, 2));

  return result;
}

export function validateBooking(from, to) {
  const fromTime = moment(from).tz("Australia/Sydney");
  const toTime = moment(to).tz("Australia/Sydney");
  const durationInMinutes = moment.duration(toTime.diff(fromTime)).asMinutes();

  if (durationInMinutes < 60) {
    console.log("Booking duration must be at least 1 hour.");
    return false;
  }

  if (durationInMinutes > 60*24) {
    console.log("Booking duration cannot exceed 24 hours.");
    return false;
  }

  if(durationInMinutes % 15 !== 0) {
    console.log("Booking duration should be in 15 min increments.");
    return false;
  }

  if (toTime.isBefore(fromTime)) {
    console.log("Booking end time cannot be before start time.");
    return false;
  }

  return true;
}

function getRateType(fromTime, fromHour, toTime, toHour, durationInHours) {
  const bookingHours = fromHour + durationInHours;

  if(fromTime.day() === 0 || toTime.day() === 0) {
    return "sunday";
  } else if(fromTime.day() === 6 || toTime.day() === 6) {
    return "saturday";
  } else if((fromHour >= 6 && toHour < 20) && (bookingHours < 20)) {
    return "daytime";
  } else {
    return "nighttime";
  }
}

function calculateTotal(rateType, durationInHours) {
  let total = 0;

  switch (rateType) {
    case "daytime":
      total = durationInHours * 38;
      break;
    case "nighttime":
      total = durationInHours * 42.93;
      break;
    case "saturday":
      total = durationInHours * 45.91;
      break;
    case "sunday":
        total = durationInHours * 60.85;
        break;
    default:
      console.log("Invalid rate type.");
      break;
  }

  return total;
}

export default calculator;
