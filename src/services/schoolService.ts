
import { supabase } from "@/integrations/supabase/client";
import { School, SchoolFormData, SchoolsFilter, SortField, SortOrder } from "@/types/school";

// Get all schools with optional filtering
export const getSchools = async (filters?: SchoolsFilter): Promise<School[]> => {
  let query = supabase
    .from('schools')
    .select('*');
  
  // Apply filters if provided
  if (filters) {
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      query = query.or(`name.ilike.%${searchLower}%,email.ilike.%${searchLower}%,phone.ilike.%${searchLower}%`);
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    // Sort results
    if (filters.sortField) {
      const order = filters.sortOrder || 'asc';
      query = query.order(filters.sortField, { ascending: order === 'asc' });
    }
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching schools:', error);
    throw new Error(`Failed to fetch schools: ${error.message}`);
  }
  
  return data || [];
};

// Get a single school by ID
export const getSchoolById = async (id: string): Promise<School | null> => {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching school by ID:', error);
    throw new Error(`Failed to fetch school: ${error.message}`);
  }
  
  return data || null;
};

// Create a new school
export const createSchool = async (schoolData: SchoolFormData): Promise<School> => {
  // Upload logo if provided
  let logoUrl;
  if (schoolData.logo) {
    const fileExt = schoolData.logo.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // For now, skip actual file upload since we don't have storage bucket configured
    // In a real app, you'd upload to Supabase storage here
    logoUrl = URL.createObjectURL(schoolData.logo); // Temporary URL for demo
  }
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  const newSchool = {
    name: schoolData.name,
    email: schoolData.email,
    phone: schoolData.phone,
    address: schoolData.address,
    logo: logoUrl,
    status: schoolData.status ? 'active' : 'inactive',
    created_by: user?.id,
  };
  
  const { data, error } = await supabase
    .from('schools')
    .insert([newSchool])
    .select();
  
  if (error) {
    console.error('Error creating school:', error);
    throw new Error(`Failed to create school: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    throw new Error('Failed to create school: No data returned');
  }
  
  return data[0];
};

// Update an existing school
export const updateSchool = async (id: string, schoolData: SchoolFormData): Promise<School> => {
  // Upload logo if provided
  let logoUrl;
  if (schoolData.logo) {
    const fileExt = schoolData.logo.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // For now, skip actual file upload since we don't have storage bucket configured
    // In a real app, you'd upload to Supabase storage here
    logoUrl = URL.createObjectURL(schoolData.logo); // Temporary URL for demo
  }
  
  const updatedSchool = {
    name: schoolData.name,
    email: schoolData.email,
    phone: schoolData.phone,
    address: schoolData.address,
    status: schoolData.status ? 'active' : 'inactive',
  };
  
  // Only add logo if a new one was provided
  if (logoUrl) {
    updatedSchool['logo'] = logoUrl;
  }
  
  const { data, error } = await supabase
    .from('schools')
    .update(updatedSchool)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating school:', error);
    throw new Error(`Failed to update school: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    throw new Error('Failed to update school: No data returned');
  }
  
  return data[0];
};

// Delete a school
export const deleteSchool = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('schools')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting school:', error);
    throw new Error(`Failed to delete school: ${error.message}`);
  }
  
  return true;
};

// Export school data to different formats
export const exportSchools = async (format: 'csv' | 'excel' | 'pdf'): Promise<string> => {
  // In a real application, this would generate and return a download URL
  // For now, we'll simulate this process
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `https://example.com/exports/schools.${format}`;
};
