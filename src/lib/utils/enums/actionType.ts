// src/enums/ActionType.ts
import Enums, { I18N_ENUM } from "@/lib/utils/enums/Enums";

export default class ActionType extends Enums {
  static NONE = 0;

  // Extend Forced Sell key
  static EXTEND_FS_KEY = 1;
  static EXTEND_FS_DP_RIGHT_EVENT = 2;
  static EXTEND_FS_MR_RIGHT_EVENT = 3;

  static _i18n: I18N_ENUM = {
    vi: {
      NONE: "Không có",
      EXTEND_FS_KEY: "Gia hạn FS theo KEY",
      EXTEND_FS_DP_RIGHT_EVENT: "Gia hạn FS sự kiện (DP)",
      EXTEND_FS_MR_RIGHT_EVENT: "Gia hạn FS sự kiện (MR)",
    },
    en: {
      NONE: "None",
      EXTEND_FS_KEY: "Extend FS Key",
      EXTEND_FS_DP_RIGHT_EVENT: "Extend FS Event (DP)",
      EXTEND_FS_MR_RIGHT_EVENT: "Extend FS Event (MR)",
    },
    zh: {
      NONE: "None",
      EXTEND_FS_KEY: "Extend FS Key",
      EXTEND_FS_DP_RIGHT_EVENT: "Extend FS Event (DP)",
      EXTEND_FS_MR_RIGHT_EVENT: "Extend FS Event (MR)",
    },
  };
}
