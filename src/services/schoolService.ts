
import { School, SchoolFormData, SchoolsFilter } from "@/types/school";

// Mock data for development
const mockSchools: School[] = [
  {
    id: "1",
    name: "Westview High School",
    email: "info@westview.edu",
    phone: "+1 (555) 123-4567",
    address: "123 Education Ave, New York, NY 10001",
    logo: "https://via.placeholder.com/150",
    status: "active",
    classesCount: 24,
    adminsCount: 5,
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-05-20T14:15:00Z",
  },
  {
    id: "2",
    name: "Eastside Academy",
    email: "admin@eastsideacademy.org",
    phone: "+1 (555) 987-6543",
    address: "456 Learning Blvd, Boston, MA 02108",
    logo: "https://via.placeholder.com/150",
    status: "active",
    classesCount: 18,
    adminsCount: 3,
    createdAt: "2023-02-10T10:45:00Z",
    updatedAt: "2023-06-05T11:30:00Z",
  },
  {
    id: "3",
    name: "Northlake Elementary",
    email: "office@northlake.edu",
    phone: "+1 (555) 456-7890",
    address: "789 Knowledge Rd, Chicago, IL 60007",
    logo: "https://via.placeholder.com/150",
    status: "inactive",
    classesCount: 12,
    adminsCount: 2,
    createdAt: "2023-03-05T09:15:00Z",
    updatedAt: "2023-04-18T16:20:00Z",
  },
  {
    id: "4",
    name: "Southbay Middle School",
    email: "contact@southbay.edu",
    phone: "+1 (555) 234-5678",
    address: "321 Wisdom St, San Francisco, CA 94016",
    logo: "https://via.placeholder.com/150",
    status: "active",
    classesCount: 16,
    adminsCount: 4,
    createdAt: "2023-01-20T11:00:00Z",
    updatedAt: "2023-05-12T13:45:00Z",
  },
  {
    id: "5",
    name: "Central High",
    email: "info@centralhigh.edu",
    phone: "+1 (555) 876-5432",
    address: "567 Education Circle, Austin, TX 78701",
    logo: "https://via.placeholder.com/150",
    status: "active",
    classesCount: 22,
    adminsCount: 6,
    createdAt: "2022-12-10T08:00:00Z",
    updatedAt: "2023-06-25T15:10:00Z",
  },
  {
    id: "6",
    name: "Valley Prep School",
    email: "admissions@valleyprep.org",
    phone: "+1 (555) 345-6789",
    address: "890 Scholar Ave, Seattle, WA 98101",
    logo: "https://via.placeholder.com/150",
    status: "inactive",
    classesCount: 14,
    adminsCount: 3,
    createdAt: "2023-02-28T10:30:00Z",
    updatedAt: "2023-05-05T09:20:00Z",
  },
];

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all schools with optional filtering
export const getSchools = async (filters?: SchoolsFilter): Promise<School[]> => {
  // Simulate API call
  await delay(800);
  
  let filteredSchools = [...mockSchools];
  
  // Apply filters if provided
  if (filters) {
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredSchools = filteredSchools.filter(school => 
        school.name.toLowerCase().includes(searchLower) ||
        school.email.toLowerCase().includes(searchLower) ||
        school.phone.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      filteredSchools = filteredSchools.filter(school => school.status === filters.status);
    }
    
    // Sort results
    filteredSchools.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'classesCount':
          comparison = a.classesCount - b.classesCount;
          break;
        default:
          comparison = 0;
      }
      
      // Reverse for descending order
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }
  
  return filteredSchools;
};

// Get a single school by ID
export const getSchoolById = async (id: string): Promise<School | null> => {
  await delay(500);
  const school = mockSchools.find(s => s.id === id);
  return school || null;
};

// Create a new school
export const createSchool = async (schoolData: SchoolFormData): Promise<School> => {
  await delay(1000);
  
  // Simulate server-side processing
  const newSchool: School = {
    id: String(mockSchools.length + 1),
    name: schoolData.name,
    email: schoolData.email,
    phone: schoolData.phone,
    address: schoolData.address,
    logo: schoolData.logo ? URL.createObjectURL(schoolData.logo) : undefined,
    status: schoolData.status ? 'active' : 'inactive',
    classesCount: 0,
    adminsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockSchools.push(newSchool);
  return newSchool;
};

// Update an existing school
export const updateSchool = async (id: string, schoolData: SchoolFormData): Promise<School> => {
  await delay(800);
  
  const index = mockSchools.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error("School not found");
  }
  
  const updatedSchool: School = {
    ...mockSchools[index],
    name: schoolData.name,
    email: schoolData.email,
    phone: schoolData.phone,
    address: schoolData.address,
    logo: schoolData.logo ? URL.createObjectURL(schoolData.logo) : mockSchools[index].logo,
    status: schoolData.status ? 'active' : 'inactive',
    updatedAt: new Date().toISOString(),
  };
  
  mockSchools[index] = updatedSchool;
  return updatedSchool;
};

// Delete a school
export const deleteSchool = async (id: string): Promise<boolean> => {
  await delay(700);
  
  const index = mockSchools.findIndex(s => s.id === id);
  if (index === -1) {
    return false;
  }
  
  mockSchools.splice(index, 1);
  return true;
};

// Export school data to different formats
export const exportSchools = async (format: 'csv' | 'excel' | 'pdf'): Promise<string> => {
  await delay(1000);
  // In a real application, this would generate and return a download URL
  return `https://example.com/exports/schools.${format}`;
};
