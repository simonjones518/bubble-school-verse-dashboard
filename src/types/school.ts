
export interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  status: 'active' | 'inactive';
  classes_count: number;
  admins_count: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface SchoolFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: File | null;
  status: boolean;
}

export type SortField = 'name' | 'created_at' | 'updated_at' | 'classes_count';
export type SortOrder = 'asc' | 'desc';

export interface SchoolsFilter {
  search: string;
  status: 'active' | 'inactive' | 'all';
  sortField: SortField;
  sortOrder: SortOrder;
}
