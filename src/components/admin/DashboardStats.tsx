
import { BookUser, Layers, BookOpen, Users } from "lucide-react";
import StatsCard from "./StatsCard";
import { Discipline } from "@/types/discipline";
import { Specialty } from "@/types/specialty";
import { Course } from "@/types/course";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/services/courseService";
import { getUsers, getTeachers, getStudents } from "@/services/userService";
import { getDisciplines } from "@/services/disciplineService";
import { getSpecialties } from "@/services/specialtyService";

interface DashboardStatsProps {
  disciplines?: Discipline[];
  specialties?: Specialty[];
  courses?: Course[];
  users?: User[];
}

const DashboardStats = ({ disciplines: initialDisciplines, specialties: initialSpecialties, courses: initialCourses, users: initialUsers }: DashboardStatsProps) => {
  // Get real-time data from API
  const { data: apiCourses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    initialData: initialCourses || [],
  });

  const { data: apiUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    initialData: initialUsers || [],
  });

  const { data: apiTeachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
    initialData: initialUsers?.filter(user => user.role?.includes('teacher')) || [],
  });

  const { data: apiStudents = [] } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    initialData: initialUsers?.filter(user => user.role?.includes('student')) || [],
  });

  const { data: apiDisciplines = [] } = useQuery({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
    initialData: initialDisciplines || [],
  });

  const { data: apiSpecialties = [] } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
    initialData: initialSpecialties || [],
  });

  // Statistics data
  const stats = [
    { 
      icon: <BookUser className="h-5 w-5 text-primary" />,
      title: "Disciplines", 
      value: apiDisciplines.length,
      bgColor: "bg-blue-50"
    },
    { 
      icon: <Layers className="h-5 w-5 text-amber-500" />,
      title: "Spécialités", 
      value: apiSpecialties.length,
      bgColor: "bg-amber-50"
    },
    { 
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      title: "Cours", 
      value: apiCourses.length,
      bgColor: "bg-indigo-50"
    },
    { 
      icon: <Users className="h-5 w-5 text-green-500" />,
      title: "Utilisateurs", 
      value: apiUsers.length,
      bgColor: "bg-green-50"
    },
    { 
      icon: <Users className="h-5 w-5 text-purple-500" />,
      title: "Enseignants", 
      value: apiTeachers.length,
      bgColor: "bg-purple-50"
    },
    { 
      icon: <Users className="h-5 w-5 text-orange-500" />,
      title: "Étudiants", 
      value: apiStudents.length,
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <StatsCard 
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          bgColor={stat.bgColor}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
