
import { BookUser, Layers, BookOpen, Users } from "lucide-react";
import StatsCard from "./StatsCard";
import { Discipline } from "@/types/discipline";
import { Specialty } from "@/types/specialty";
import { Course } from "@/types/course";
import { User } from "@/types/user";

interface DashboardStatsProps {
  disciplines: Discipline[];
  specialties: Specialty[];
  courses: Course[];
  users: User[];
}

const DashboardStats = ({ disciplines, specialties, courses, users }: DashboardStatsProps) => {
  // Statistics data
  const stats = [
    { 
      icon: <BookUser className="h-5 w-5 text-primary" />,
      title: "Disciplines", 
      value: disciplines.length
    },
    { 
      icon: <Layers className="h-5 w-5 text-amber-500" />,
      title: "Spécialités", 
      value: specialties.length
    },
    { 
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      title: "Cours", 
      value: courses.length 
    },
    { 
      icon: <Users className="h-5 w-5 text-green-500" />,
      title: "Utilisateurs", 
      value: users.length
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard 
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
