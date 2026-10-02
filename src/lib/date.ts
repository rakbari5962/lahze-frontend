import moment from "moment-jalaali";

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );
}

export function toJalali(
  date?: string | null
) {
  if (!date) {
    return "";
  }

  const normalized = normalizeDigits(
    date.trim()
  );

  const m = moment(
    normalized,
    "YYYY-MM-DD"
  );

  if (!m.isValid()) {
    return "";
  }

  return m.format(
    "jYYYY/jMM/jDD"
  );
}

export function toGregorian(
  jalaliDate: string
) {
  if (!jalaliDate) {
    return "";
  }

  const normalized = normalizeDigits(
    jalaliDate.trim()
  );

  // اگر از قبل میلادی است، دوباره تبدیلش نکن
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      normalized
    )
  ) {
    return normalized;
  }

  const value = normalized.replace(
    /-/g,
    "/"
  );

  const m = moment(
    value,
    "jYYYY/jMM/jDD",
    true
  );

  if (!m.isValid()) {
    return "";
  }

  return m.format(
    "YYYY-MM-DD"
  );
}