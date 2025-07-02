
import { Home, BookUser, FileText, GraduationCap, Settings, PlusCircle, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SidebarItem from "./SidebarItem";

interface TeacherNavigationProps {
  baseUrl: string;
  collapsed: boolean;
}

const TeacherNavigation = ({ baseUrl, collapsed }: TeacherNavigationProps) => {
  const location = useLocation();
  
  const navigation = [
    { icon: <Home className="h-4 w-4" />, label: "Tableau de bord", href: `${baseUrl}/dashboard` },
    { icon: <BookUser className="h-4 w-4" />, label: "Mes cours", href: `${baseUrl}/courses` },
    { icon: <FileText className="h-4 w-4" />, label: "Mes quiz", href: `${baseUrl}/quizzes` },
    { icon: <Users className="h-4 w-4" />, label: "Mes groupes", href: `${baseUrl}/groups` },
    { icon: <GraduationCap className="h-4 w-4" />, label: "Étudiants", href: `${baseUrl}/students` },
    { icon: <Settings className="h-4 w-4" />, label: "Paramètres", href: `${baseUrl}/settings` },
    { icon: <PlusCircle className="h-4 w-4" />, label: "Nouveau cours", href: `${baseUrl}/create-course` },
  ];

  return (
    <div className={cn("space-y-1", collapsed && "flex flex-col items-center")}>
      {navigation.map((item) => (
        <div key={item.href}>
          {collapsed ? (
            <Link to={item.href} title={item.label}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-10 h-10 mb-1",
                  location.pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                )}
              >
                {item.icon}
              </Button>
            </Link>
          ) : (
            <SidebarItem
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TeacherNavigation;
