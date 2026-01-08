
export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type OrderType = 'BUY' | 'SELL';

export interface Transaction {
  id: string;
  mobile: string;
  type: OrderType;
  txid: string; 
  amount: number;
  payoutDetails: string;
  status: OrderStatus;
  timestamp: number;
}

export interface AdminSettings {
  sellPrice: number;
  buyPrice: number;
  whatsappNumber: string;
  usdtWalletAddress: string;
  usdtQrUrl: string;
  bankDetails: string;
  bankQrUrl: string;
  upiAddress: string;
}

export interface User {
  mobile: string;
  isAdmin: boolean;
}

export interface GeneratedSite {
  siteName: string;
  heroHeadline: string;
  heroSubheadline: string;
  sections: {
    id: string;
    title: string;
    body: string;
  }[];
  footerNote: string;
}

export enum View {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  USER_DASHBOARD = 'USER_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}
