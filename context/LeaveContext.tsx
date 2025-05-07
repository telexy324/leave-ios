import React, { createContext, useContext, useState } from 'react';
import { LeaveRequest } from '@/types';
import { LeaveStats } from '@/types/nestapi';
import { leaveBalanceApi } from "@/lib/leaveBalance";

interface LeaveContextType {
  leaveRequests: LeaveRequest[];
  leaveStats: LeaveStats;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  fetchLeaveRequests: () => Promise<void>;
  fetchLeaveStats: () => Promise<void>;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const LeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveStats, setLeaveStats] = useState<LeaveStats>({
    totalCompensatoryLeaves: 0,
    usedCompensatoryLeaves: 0,
    totalAnnualLeaves: 0,
    usedAnnualLeaves: 0,
    totalSickLeaves: 0,
    usedSickLeaves: 0,
    totalPersonalLeaves: 0,
    usedPersonalLeaves: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const submitLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: 调用实际的API
      const newRequest: LeaveRequest = {
        ...request,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setLeaveRequests(prev => [...prev, newRequest]);
    } catch (err) {
      setError('提交请假申请失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: 调用实际的API
      const mockRequests: LeaveRequest[] = [
        {
          id: '1',
          userId: '1',
          type: 'annual',
          startDate: '2024-05-01',
          endDate: '2024-05-05',
          reason: '个人原因',
          status: 'pending',
          createdAt: '2024-04-20T10:00:00Z',
          updatedAt: '2024-04-20T10:00:00Z',
        },
      ];
      
      setLeaveRequests(mockRequests);
    } catch (err) {
      setError('获取请假申请列表失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaveStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await leaveBalanceApi.getLeaveStats();
      setLeaveStats(stats);
    } catch (err) {
      setError('获取假期统计失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LeaveContext.Provider
      value={{
        leaveRequests,
        leaveStats,
        isLoading,
        error,
        clearError,
        submitLeaveRequest,
        fetchLeaveRequests,
        fetchLeaveStats,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
}; 