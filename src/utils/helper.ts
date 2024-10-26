export const convertDateToUTC = (date: Date) => {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours() + 7,
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
};
