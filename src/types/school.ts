
export interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  status: 'active' | 'inactive';
  classesCount: number;
  adminsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: File | null;
  status: boolean;
}

export type SortField = 'name' | 'createdAt' | 'updatedAt' | 'classesCount';
export type SortOrder = 'asc' | 'desc';

export interface SchoolsFilter {
  search: string;
  status: 'active' | 'inactive' | 'all';
  sortField: SortField;
  sortOrder: SortOrder;
}
