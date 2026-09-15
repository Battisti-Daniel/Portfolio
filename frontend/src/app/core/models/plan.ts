export type PlanStatus = 'PLANNED' | 'IN_PROGRESS' | 'DONE';

export interface Plan {
  id: number;
  title: string;
  description: string;
  status: PlanStatus;
  targetDate: string | null;
  displayOrder: number;
  createdAt: string;
}

export type PlanRequest = Omit<Plan, 'id' | 'createdAt'>;
