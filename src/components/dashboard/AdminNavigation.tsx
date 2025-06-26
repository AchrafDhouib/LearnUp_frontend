
import { Home, BookUser, FileText, BookOpen, User, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SidebarItem from "./SidebarItem";

interface AdminNavigationProps {
  baseUrl: string;
  collapsed: boolean;
}

const AdminNavigation = ({ baseUrl, collapsed }: AdminNavigationProps) => {
  const location = useLocation();
  
  const navigation = [
    { icon: <Home className="h-4 w-4" />, label: "Tableau de bord", href: `${baseUrl}/dashboard` },
    { icon: <BookUser className="h-4 w-4" />, label: "Disciplines", href: `${baseUrl}/disciplines` },
    { icon: <FileText className="h-4 w-4" />, label: "Spécialités", href: `${baseUrl}/specialties` },
    { icon: <BookOpen className="h-4 w-4" />, label: "Cours", href: `${baseUrl}/courses` },
    { icon: <User className="h-4 w-4" />, label: "Utilisateurs", href: `${baseUrl}/users` },
    { icon: <Settings className="h-4 w-4" />, label: "Paramètres", href: `${baseUrl}/settings` },
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

export default AdminNavigation;
