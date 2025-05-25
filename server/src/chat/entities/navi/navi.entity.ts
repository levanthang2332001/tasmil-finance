export enum NAVI_ACTION_TYPE {
  SUPPLY = 'supply',
  BORROW = 'borrow',
  WITHDRAW = 'withdraw',
  REPAY = 'repay',
}

export type NAVI_ACTION_TEST =
  | 'supply'
  | 'borrow'
  | 'withdraw'
  | 'repay'
  | 'unknown';

export interface SupplyParams {
  asset?: string;
  amount?: string;
}
export interface BorrowParams {
  asset?: string;
  amount?: string;
}
export interface RepayParams {
  asset?: string;
  amount?: string;
}

export interface WithdrawParams {
  asset?: string;
  amount?: string;
}
