
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardStats from "@/components/admin/DashboardStats";
import DashboardTabs from "@/components/admin/DashboardTabs";
import { useAuth } from "@/hooks/useAuth";
import { getUsers } from "@/services/userService";
import { getCourses } from "@/services/courseService";
import { getDisciplines } from "@/services/disciplineService";
import { getSpecialties } from "@/services/specialtyService";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("users");
  
  // Fetch data using React Query
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const { data: disciplines = [] } = useQuery({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
  });
  
  const { data: specialties = [] } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
  });

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
          <p className="text-gray-500">
            Bienvenue, {user?.first_name} {user?.last_name}. Gérez votre plateforme d'apprentissage.
          </p>
        </div>
        
        {/* Statistics */}
        <DashboardStats 
          disciplines={disciplines}
          specialties={specialties}
          courses={courses}
          users={users}
        />
        
        {/* Content in tabs */}
        <DashboardTabs
          users={users}
          disciplines={disciplines}
          specialties={specialties}
          courses={courses}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
