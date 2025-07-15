import numeral from "numeral";

export type NumberOpt = {
  precision?: number;
  leadingZeros?: number;
};

const defaultOpt: Required<NumberOpt> = {
  precision: 2,
  leadingZeros: 2,
};

export default function formatNumber(
  val: string | number = 0,
  roundIt: boolean = false,
  opt: NumberOpt = defaultOpt
): string {
  // Chuyển string thành number nếu cần
  const num = typeof val === "string" ? parseFloat(val) : val;

  // Nếu không phải số hợp lệ, trả về giá trị mặc định
  if (isNaN(num)) return "--";

  const options: Required<NumberOpt> = {
    ...defaultOpt,
    ...opt,
  };

  let formatTemplate =
    num > 0 ? String(0).padStart(options.leadingZeros, "0") + ",000" : "0,000";

  if (roundIt) {
    val = Math.round(num);
  }

  if (!Number.isInteger(num)) {
    formatTemplate += "." + "0".repeat(options.precision);
  }

  return numeral(num).format(formatTemplate);
}
