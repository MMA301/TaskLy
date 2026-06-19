export type AuthSessionRole = 'admin' | 'staff' | 'client';

export type DemoAccount = {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  companyName?: string;
  contactName?: string;
  tier?: string;
  totalOrders?: number;
  assignedTasks?: number;
  rating?: number;
};

export type AuthSession = {
  role: AuthSessionRole;
  account: DemoAccount;
};

let currentSession: AuthSession | null = null;

export function setAuthSession(session: AuthSession) {
  currentSession = session;
}

export function getAuthSession() {
  return currentSession;
}

export function clearAuthSession() {
  currentSession = null;
}
