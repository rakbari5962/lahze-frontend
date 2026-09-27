import moment from "moment-jalaali";


export function toJalali(
  date?: string | null
) {

  if (!date) {
    return "";
  }

  const m = moment(date, "YYYY-MM-DD");

  if (!m.isValid()) {
    return "";
  }

  return m.format("jYYYY/jMM/jDD");

}



export function toGregorian(
  jalaliDate: string
) {

  if (!jalaliDate) {
    return "";
  }

  const m = moment(
    jalaliDate,
    "jYYYY/jMM/jDD"
  );

  if (!m.isValid()) {
    return "";
  }

  return m.format("YYYY-MM-DD");

}