export enum NaviActionType {
  BORROW = 'borrow',
  SUPPLY = 'supply',
  WITHDRAW = 'withdraw',
  REPAY = 'repay',
}

export interface CommonParams {
  asset?: string;
  address?: string;
  amount?: string;
}
export interface BorrowParams extends CommonParams {}
export interface SupplyParams extends CommonParams {}
export interface WithdrawParams extends CommonParams {}
export interface RepayParams extends CommonParams {}
