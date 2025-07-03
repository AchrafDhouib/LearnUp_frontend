import { BookOpen, ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StudentNavigation from "./StudentNavigation";
import TeacherNavigation from "./TeacherNavigation";
import AdminNavigation from "./AdminNavigation";

interface SidebarProps {
  userType: "student" | "teacher" | "admin";
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  logout: () => void;
}

const Sidebar = ({ 
  userType, 
  collapsed, 
  setCollapsed, 
  mobileOpen, 
  setMobileOpen, 
  logout 
}: SidebarProps) => {
  const baseUrl = `/${userType}`;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-full bg-white border-r transition-all duration-300 lg:static",
        collapsed ? "w-16" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <Link to="/" className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <BookOpen className="h-6 w-6 text-primary" />
          {!collapsed && <span className="ml-2 font-bold text-lg">LearnUp</span>}
        </Link>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-700 lg:block hidden"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
        <button 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100vh-8rem)]">
        {userType === "student" && (
          <StudentNavigation baseUrl={baseUrl} collapsed={collapsed} />
        )}
        {userType === "teacher" && (
          <TeacherNavigation baseUrl={baseUrl} collapsed={collapsed} />
        )}
        {userType === "admin" && (
          <AdminNavigation baseUrl={baseUrl} collapsed={collapsed} />
        )}
      </div>

      <div className="absolute bottom-0 w-full border-t p-4">
        <Button 
          variant="ghost" 
          className={cn(
            "text-red-500 hover:text-red-700 hover:bg-red-50 w-full",
            collapsed ? "justify-center" : "justify-start gap-2"
          )}
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Déconnexion</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
