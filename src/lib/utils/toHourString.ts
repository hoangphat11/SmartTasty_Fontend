import dayjs from "dayjs";

/**
 * Định dạng timestamp thành chuỗi giờ phút (mặc định là "hh:mm").
 * @param timestamp - số hoặc chuỗi thời gian (Unix timestamp, ISO, etc.)
 * @param format - chuỗi định dạng DayJS (ví dụ: "HH:mm" hoặc "hh:mm A")
 * @param opt - (tạm thời chưa dùng, để mở rộng sau)
 * @returns Chuỗi thời gian đã định dạng
 */
export default function toHourString(
  timestamp: number | string = Date.now(),
  format: string = "hh:mm",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  opt: object = {}
): string {
  return dayjs(timestamp).format(format);
}
