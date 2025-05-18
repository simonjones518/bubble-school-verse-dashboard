
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { ActivityLog } from "@/components/ActivityLog";
import { TimelineComponent } from "@/components/TimelineComponent";
import { Icons } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for statistics
  const stats = [
    {
      title: "Total Students",
      value: "1,245",
      icon: Icons.students,
      trend: {
        value: 12,
        isPositive: true
      }
    },
    {
      title: "Total Staff",
      value: "86",
      icon: Icons.staffList,
      trend: {
        value: 5,
        isPositive: true
      }
    },
    {
      title: "Total Classes",
      value: "32",
      icon: Icons.classes,
      trend: {
        value: 0,
        isPositive: true
      }
    },
    {
      title: "Total Revenue",
      value: "$128,540",
      icon: Icons.income,
      trend: {
        value: 8,
        isPositive: true
      }
    }
  ];

  // Sample data for activities
  const activities = [
    {
      id: 1,
      user: {
        name: "John Smith",
      },
      action: "added a new student",
      target: "Emily Johnson",
      time: "Just now"
    },
    {
      id: 2,
      user: {
        name: "Maria Garcia",
      },
      action: "updated class schedule for",
      target: "Grade 10A",
      time: "10 minutes ago"
    },
    {
      id: 3,
      user: {
        name: "David Brown",
      },
      action: "marked attendance for",
      target: "Grade 8B",
      time: "25 minutes ago"
    },
    {
      id: 4,
      user: {
        name: "Sarah Lee",
      },
      action: "created a new exam for",
      target: "Mathematics",
      time: "1 hour ago"
    }
  ];

  // Sample data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Staff Meeting",
      time: "Today, 3:00 PM",
      status: "upcoming" as const
    },
    {
      id: 2,
      title: "Parent-Teacher Conference",
      time: "Tomorrow, 9:00 AM",
      status: "upcoming" as const
    },
    {
      id: 3,
      title: "Science Exhibition",
      time: "May 25, 10:00 AM",
      status: "upcoming" as const
    },
    {
      id: 4,
      title: "Annual Sports Day",
      time: "May 30, All Day",
      status: "upcoming" as const
    }
  ];

  // Sample data for attendance chart
  const attendanceData = [
    { name: 'Grade 6', present: 85, absent: 15 },
    { name: 'Grade 7', present: 88, absent: 12 },
    { name: 'Grade 8', present: 92, absent: 8 },
    { name: 'Grade 9', present: 90, absent: 10 },
    { name: 'Grade 10', present: 95, absent: 5 },
    { name: 'Grade 11', present: 89, absent: 11 },
    { name: 'Grade 12', present: 93, absent: 7 },
  ];

  // Sample data for revenue sources
  const revenueData = [
    { name: 'Tuition Fees', value: 75 },
    { name: 'Transport', value: 10 },
    { name: 'Library', value: 5 },
    { name: 'Events', value: 3 },
    { name: 'Misc', value: 7 },
  ];

  const COLORS = ['#9b87f5', '#7E69AB', '#D6BCFA', '#33C3F0', '#FFDEE2'];

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-bubble-light/30 p-1 rounded-full">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white rounded-full">Overview</TabsTrigger>
          <TabsTrigger value="academic" className="data-[state=active]:bg-white rounded-full">Academic</TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-white rounded-full">Financial</TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-white rounded-full">Administrative</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Chart */}
            <Card className="lg:col-span-2 p-6 bubble-card">
              <h2 className="text-lg font-medium mb-4">Student Attendance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" name="Present" fill="#9b87f5" />
                    <Bar dataKey="absent" name="Absent" fill="#FFDEE2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Revenue Sources */}
            <Card className="p-6 bubble-card">
              <h2 className="text-lg font-medium mb-4">Revenue Sources</h2>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Activity and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityLog activities={activities} />
            <TimelineComponent events={upcomingEvents} />
          </div>

          {/* Quick Actions */}
          <Card className="p-6 bubble-card">
            <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {icon: Icons.students, label: "Add Student"},
                {icon: Icons.staffList, label: "Add Staff"},
                {icon: Icons.event, label: "Schedule Event"},
                {icon: Icons.tickets, label: "Create Ticket"}
              ].map((action, i) => (
                <button key={i} className="flex flex-col items-center justify-center p-4 rounded-xl bg-bubble-light/30 hover:bg-bubble-light transition-colors">
                  <div className="p-3 rounded-full bg-white mb-2">
                    <action.icon size={24} className="text-bubble-primary" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <div className="grid place-items-center h-64">
            <div className="text-center">
              <h3 className="text-2xl font-medium text-bubble-primary mb-2">Academic Dashboard</h3>
              <p className="text-bubble-neutral">Academic module details will appear here.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="grid place-items-center h-64">
            <div className="text-center">
              <h3 className="text-2xl font-medium text-bubble-primary mb-2">Financial Dashboard</h3>
              <p className="text-bubble-neutral">Financial module details will appear here.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="admin">
          <div className="grid place-items-center h-64">
            <div className="text-center">
              <h3 className="text-2xl font-medium text-bubble-primary mb-2">Administrative Dashboard</h3>
              <p className="text-bubble-neutral">Administrative module details will appear here.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Index;
