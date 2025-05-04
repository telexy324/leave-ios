export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  department?: string;
  remainingLeaveDays: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'annual' | 'sick' | 'personal';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  comments?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LeaveStats {
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  byType: {
    annual: number;
    sick: number;
    personal: number;
  };
} 