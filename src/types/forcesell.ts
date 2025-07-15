export interface Account {
  id: number;
  trading_code: string;
  status_note: string;
  call_time: string;
  note: string;
  customer_name: string;
  mr_actual_rate: number;
  dp_actual_rate: number;
  deposit_cash_all: number;
  deposit_cash_85: number;
  cash_to_dp: number;
  quota_loan: number;
  overdue_debt: number;
  broker_name: string;
  option?: {
    highlight: string[];
  };
}

export interface HistoryData {
  processed_data_at?: string;
}
