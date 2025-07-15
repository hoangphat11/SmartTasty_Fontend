import Enums, { I18N_ENUM } from "@/lib/utils/enums/Enums";

export default class StatusType extends Enums {
  static PROCESSING = 1;
  static OVERDUE = 5;
  static PENDING = 10;
  static DONE = 15;

  static _i18n: I18N_ENUM = {
    vi: {
      PROCESSING: "Đang xử lý",
      OVERDUE: "Quá hạn",
      PENDING: "Chờ xử lý",
      DONE: "Hoàn tất",
    },
    en: {
      PROCESSING: "Processing",
      OVERDUE: "Overdue",
      PENDING: "Pending",
      DONE: "Done",
    },
    zh: {
      PROCESSING: "处理中",
      OVERDUE: "逾期",
      PENDING: "待处理",
      DONE: "完成",
    },
  };
}
