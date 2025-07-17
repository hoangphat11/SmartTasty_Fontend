import dayjs from "dayjs";

/**
 * Định dạng timestamp thành chuỗi giờ phút (mặc định là "HH:mm").
 * Trả về "--" nếu giá trị không hợp lệ.
 * @param timestamp - số hoặc chuỗi thời gian (Unix timestamp, ISO, etc.)
 * @param format - chuỗi định dạng DayJS (ví dụ: "HH:mm" hoặc "hh:mm A")
 * @param opt - (dành cho các tuỳ chọn mở rộng sau này)
 * @returns Chuỗi thời gian đã định dạng hoặc "--" nếu không hợp lệ
 */
export default function toHourString(
  timestamp?: number | string,
  format = "HH:mm",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  opt: object = {}
): string {
  if (!timestamp || !dayjs(timestamp).isValid()) return "--";
  return dayjs(timestamp).format(format);
}
