
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Icons } from './icons';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

type SidebarItemProps = {
  icon: keyof typeof Icons;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}

type SubMenu = {
  label: string;
  icon: keyof typeof Icons;
  href: string;
}

type SidebarMenuProps = {
  label: string;
  icon: keyof typeof Icons;
  subMenus: SubMenu[];
  isOpen?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  isActive = false,
  onClick,
  href = "#" 
}) => {
  const Icon = Icons[icon];
  
  return (
    <a 
      href={href}
      className={cn(
        "nav-link",
        isActive && "active"
      )}
      onClick={onClick}
    >
      <Icon size={18} />
      <span>{label}</span>
    </a>
  );
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ 
  label, 
  icon, 
  subMenus,
  isOpen: defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = Icons[icon];
  const ChevronIcon = Icons.chevronDown;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-between nav-link",
            isOpen && "bg-bubble-light/30"
          )}
        >
          <div className="flex items-center">
            <Icon size={18} />
            <span className="ml-2">{label}</span>
          </div>
          <ChevronIcon 
            size={16} 
            className={cn(
              "transition-transform duration-200",
              isOpen && "transform rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-7 space-y-1 pt-1 animate-fade-in">
        {subMenus.map((subMenu, index) => (
          <SidebarItem 
            key={index}
            icon={subMenu.icon}
            label={subMenu.label}
            href={subMenu.href}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export function SidebarNav() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // School Management menu
  const schoolManagementMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/school-management/dashboard' },
    { label: 'Schools', icon: 'school', href: '/school-management/schools' },
    { label: 'Classes', icon: 'classes', href: '/school-management/classes' },
    { label: 'Sessions', icon: 'sessions', href: '/school-management/sessions' },
    { label: 'Settings', icon: 'settings', href: '/school-management/settings' }
  ];

  // School menu
  const schoolMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/school/dashboard' },
    { label: 'Inquiries', icon: 'inquiries', href: '/school/inquiries' },
    { label: 'Settings', icon: 'settings', href: '/school/settings' },
    { label: 'Logs', icon: 'logs', href: '/school/logs' }
  ];

  // Academic menu
  const academicMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/academic/dashboard' },
    { label: 'Manage Class Sections', icon: 'manageClassSections', href: '/academic/manage-class-sections' },
    { label: 'Manage Medium', icon: 'manageMedium', href: '/academic/manage-medium' },
    { label: 'Manage Student Type', icon: 'manageStudentType', href: '/academic/manage-student-type' },
    { label: 'Subjects', icon: 'subjects', href: '/academic/subjects' },
    { label: 'Class Time Table', icon: 'classTimeTable', href: '/academic/class-time-table' },
    { label: 'Attendance', icon: 'attendance', href: '/academic/attendance' },
    { label: 'Student Leaves', icon: 'studentLeaves', href: '/academic/student-leaves' },
    { label: 'Study Materials', icon: 'studyMaterials', href: '/academic/study-materials' },
    { label: 'Homework', icon: 'homework', href: '/academic/homework' },
    { label: 'Noticeboard', icon: 'noticeboard', href: '/academic/noticeboard' },
    { label: 'Event', icon: 'event', href: '/academic/event' },
    { label: 'Live Classes', icon: 'liveClasses', href: '/academic/live-classes' },
    { label: 'Staff Ratting', icon: 'staffRatting', href: '/academic/staff-ratting' },
    { label: 'Student Birthdays', icon: 'studentBirthdays', href: '/academic/student-birthdays' }
  ];

  // Student menu
  const studentMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/student/dashboard' },
    { label: 'Admission', icon: 'admission', href: '/student/admission' },
    { label: 'Students', icon: 'students', href: '/student/students' },
    { label: 'ID Cards', icon: 'idCards', href: '/student/id-cards' },
    { label: 'Promote', icon: 'promote', href: '/student/promote' },
    { label: 'Transfer Student', icon: 'transferStudent', href: '/student/transfer-student' },
    { label: 'Certificates', icon: 'certificates', href: '/student/certificates' },
    { label: 'Notifications', icon: 'notifications', href: '/student/notifications' }
  ];

  // Administrator menu
  const administratorMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/administrator/dashboard' },
    { label: 'Admins', icon: 'admins', href: '/administrator/admins' },
    { label: 'Roles', icon: 'roles', href: '/administrator/roles' },
    { label: 'Staff List', icon: 'staffList', href: '/administrator/staff-list' },
    { label: 'Staff Attendance', icon: 'staffAttendance', href: '/administrator/staff-attendance' },
    { label: 'Staff Leaves', icon: 'staffLeaves', href: '/administrator/staff-leaves' }
  ];

  // Accounting menu
  const accountingMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/accounting/dashboard' },
    { label: 'Income', icon: 'income', href: '/accounting/income' },
    { label: 'Expenses', icon: 'expenses', href: '/accounting/expenses' },
    { label: 'Fee Invoices', icon: 'feeInvoices', href: '/accounting/fee-invoices' },
    { label: 'Collect Payments', icon: 'collectPayments', href: '/accounting/collect-payments' },
    { label: 'Fee Types', icon: 'feeTypes', href: '/accounting/fee-types' },
    { label: 'Bulk Invoice Prints', icon: 'bulkInvoicePrints', href: '/accounting/bulk-invoice-prints' },
    { label: 'Invoices Report', icon: 'invoicesReport', href: '/accounting/invoices-report' }
  ];

  // Examination menu
  const examinationMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/examination/dashboard' },
    { label: 'Manage Exams', icon: 'manageExams', href: '/examination/manage-exams' },
    { label: 'Manage Groups', icon: 'manageGroups', href: '/examination/manage-groups' },
    { label: 'Admit Cards', icon: 'admitCards', href: '/examination/admit-cards' },
    { label: 'Admit Cards Bulk Print', icon: 'admitCardsBulkPrint', href: '/examination/admit-cards-bulk-print' },
    { label: 'Exam Results', icon: 'examResults', href: '/examination/exam-results' },
    { label: 'Bulk Print Results', icon: 'bulkPrintResults', href: '/examination/bulk-print-results' },
    { label: 'Academic Report', icon: 'academicReport', href: '/examination/academic-report' }
  ];

  // Transportation menu
  const transportationMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/transportation/dashboard' },
    { label: 'Vehicles', icon: 'vehicles', href: '/transportation/vehicles' },
    { label: 'Routes', icon: 'routes', href: '/transportation/routes' },
    { label: 'Report', icon: 'report', href: '/transportation/report' }
  ];

  // Activities menu - no submenu, direct link
  
  // Hostel menu
  const hostelMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/hostel/dashboard' },
    { label: 'Hostels', icon: 'hostels', href: '/hostel/hostels' },
    { label: 'Rooms', icon: 'rooms', href: '/hostel/rooms' }
  ];

  // Lessons menu
  const lessonsMenu: SubMenu[] = [
    { label: 'Lessons', icon: 'lessons', href: '/lessons/lessons' },
    { label: 'Chapters', icon: 'chapters', href: '/lessons/chapters' }
  ];

  // Tickets menu
  const ticketsMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/tickets/dashboard' },
    { label: 'Tickets', icon: 'tickets', href: '/tickets/tickets' }
  ];

  // Library menu
  const libraryMenu: SubMenu[] = [
    { label: 'Dashboard', icon: 'dashboard', href: '/library/dashboard' },
    { label: 'All Books', icon: 'allBooks', href: '/library/all-books' },
    { label: 'Books Issued', icon: 'booksIssued', href: '/library/books-issued' },
    { label: 'Library Cards', icon: 'libraryCards', href: '/library/library-cards' }
  ];

  return (
    <aside className={cn(
      "h-screen bg-sidebar fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 border-r border-gray-200",
      isExpanded ? "w-64" : "w-20"
    )}>
      <div className="flex items-center justify-between p-4">
        {isExpanded ? (
          <h1 className="text-xl font-bold text-bubble-primary flex items-center">
            <Icons.school className="mr-2" />
            MySchool
          </h1>
        ) : (
          <Icons.school className="mx-auto text-bubble-primary" size={24} />
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-bubble-neutral"
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <Icons.chevronDown className="rotate-90" size={20} />
          ) : (
            <Icons.chevronDown className="-rotate-90" size={20} />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2 p-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
        {isExpanded && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@myschool.com</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex-1 overflow-auto py-2 px-3">
        <div className="space-y-1">
          <SidebarItem 
            icon="dashboard" 
            label="Dashboard" 
            isActive={activeItem === 'dashboard'}
            onClick={() => setActiveItem('dashboard')}
            href="/"
          />

          <SidebarMenu 
            label="School Management" 
            icon="school" 
            subMenus={schoolManagementMenu} 
            isOpen={activeItem === 'schoolManagement'}
          />

          <SidebarMenu 
            label="School" 
            icon="school" 
            subMenus={schoolMenu}
          />

          <SidebarMenu 
            label="Academic" 
            icon="classes" 
            subMenus={academicMenu}
          />

          <SidebarMenu 
            label="Student" 
            icon="students" 
            subMenus={studentMenu}
          />

          <SidebarMenu 
            label="Administrator" 
            icon="admins" 
            subMenus={administratorMenu}
          />

          <SidebarMenu 
            label="Accounting" 
            icon="income" 
            subMenus={accountingMenu}
          />

          <SidebarMenu 
            label="Examination" 
            icon="manageExams" 
            subMenus={examinationMenu}
          />

          <SidebarMenu 
            label="Transportation" 
            icon="vehicles" 
            subMenus={transportationMenu}
          />

          <SidebarItem 
            icon="activities" 
            label="Activities" 
            href="/activities"
          />

          <SidebarMenu 
            label="Hostel" 
            icon="hostels" 
            subMenus={hostelMenu}
          />

          <SidebarMenu 
            label="Lessons" 
            icon="lessons" 
            subMenus={lessonsMenu}
          />

          <SidebarMenu 
            label="Tickets" 
            icon="tickets" 
            subMenus={ticketsMenu}
          />

          <SidebarMenu 
            label="Library" 
            icon="libraryCards" 
            subMenus={libraryMenu}
          />
        </div>
      </div>

      <div className="p-4 mt-auto">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-bubble-neutral hover:text-destructive hover:bg-destructive/10",
            !isExpanded && "justify-center"
          )}
        >
          <Icons.logout size={18} />
          {isExpanded && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
