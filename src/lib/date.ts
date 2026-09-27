export function toJalali(
  date?: string | null
) {

  if (!date) {
    return "";
  }

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "fa-IR-u-ca-persian",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(d)
    .replaceAll("/", "/");

}



export function toGregorian(
  jalaliDate: string
) {

  if (!jalaliDate) {
    return "";
  }

  // فعلاً فقط فرمت ذخیره را نگه می‌داریم
  // تبدیل دقیق شمسی به میلادی را بعداً اضافه می‌کنیم

  return jalaliDate;

}