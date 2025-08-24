export interface Order {
  price: number;
  amount: number;
  total: number;
}

export interface Trade {
  id: string;
  price: number;
  amount: number;
  direction: 'Buy' | 'Sell';
  time: string;
}

export interface ChartData {
  name: string;
  price: number;
}

export interface HeaderStats {
  lastPrice: number;
  changePercent: number;
  high: number;
  low: number;
  isPositive: boolean;
}

export interface ActiveTrade {
  id: string;
  pair: string;
  direction: 'Buy' | 'Sell';
  stake: number;
  entryPrice: number;
  settlementDuration: number;
  profitPercentage: number;
  commissionPercentage: number;
  startTime: number;
}

export interface TradeResult {
  success: boolean;
  profit: number;
  message: string;
}

export interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Trade';
  amount: number;
  asset: string;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  details: string;
}

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

export type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'name';
export type SortOrder = 'asc' | 'desc';

export type KYCStatus = 'unverified' | 'pending' | 'verified' | 'approved' | 'rejected';

export interface VIPBenefits {
  tradingFeeDiscount: number;
  withdrawalFeeDiscount: number;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  exclusiveSignals: boolean;
  higherLimits: boolean;
  personalManager: boolean;
  earlyAccess: boolean;
}

export interface UserProfile {
  kycStatus: KYCStatus;
  vipLevel: number;
  vipExpiry?: number;
  vipBenefits?: VIPBenefits;
  fullName?: string;
  dateOfBirth?: string;
  country?: string;
  address?: string;
  role: 'admin' | 'user';
}

export interface ConvexUser {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  isAnonymous?: boolean;
  profile: UserProfile;
  portfolio: {
    balances: {
      USDT: number;
    };
  };
  notifications: Notification[];
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'transaction' | 'security' | 'system';
  read: boolean;
  timestamp: number;
  _creationTime?: number;
}

export interface KYCSubmission {
  _id?: string;
  fullName: string;
  dateOfBirth: string;
  country: string;
  address: string;
  idFrontBase64: string;
  idBackBase64: string;
  status?: 'pending' | 'approved' | 'rejected';
  submittedAt?: number;
  reviewedAt?: number;
  reviewNotes?: string;
}

export interface DepositSubmission {
  _id: string;
  amount: number;
  asset: string;
  network: string;
  transactionHash: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: number;
  processedAt?: number;
}

export interface WithdrawalSubmission {
  _id: string;
  amount: number;
  asset: string;
  address: string;
  network: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: number;
  processedAt?: number;
}

export interface WithdrawalAddress {
  _id: string;
  label: string;
  address: string;
  network: 'TRC20' | 'ERC20' | 'BTC';
  asset: string;
  isDefault: boolean;
  createdAt: number;
}

export interface VIPLevel {
  level: number;
  name: string;
  minDeposit?: number;
  depositRequired?: number;
  benefits: VIPBenefits;
  color: string;
  description: string;
  icon?: string;
    features: string[];
  }

