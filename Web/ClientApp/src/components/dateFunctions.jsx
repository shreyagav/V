const leapYear = (year) => {
  if (year % 4 === 0) {
    if (year % 100 === 0) {
      if (year % 400 === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
};

const amountOfDays = (month, year) => {
  const monthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let leap = leapYear(year);
  if (month === 1 && leap) {
    return (monthArray[month] += 1);
  } else return monthArray[month];
};

const getLastDayOfMonth = (day) => {
  let year = day.getFullYear();
  let month = day.getMonth();
  let lastDayOfMonth = amountOfDays(month, year);
  return new Date(year, month, lastDayOfMonth);
};

const getFirstDayOfMonth = (day) => {
  let year = day.getFullYear();
  let month = day.getMonth();
  return new Date(year, month, 1);
};

export { leapYear, amountOfDays, getFirstDayOfMonth, getLastDayOfMonth };
