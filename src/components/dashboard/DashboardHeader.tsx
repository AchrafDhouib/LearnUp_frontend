
import { Menu } from "lucide-react";
import { User } from "@/types/user";

interface DashboardHeaderProps {
  userType: "student" | "teacher" | "admin";
  user: User | null;
  setMobileOpen: (open: boolean) => void;
}

const DashboardHeader = ({ userType, user, setMobileOpen }: DashboardHeaderProps) => {
  // Function to get user name
  const getUserName = () => {
    if (!user) return "Utilisateur";
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    
    return user.name || "Utilisateur";
  };
  
  // Function to get user initials
  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    }
    
    return user.name ? user.name.substring(0, 2) : "U";
  };
  
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4">
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden text-gray-700"
      >
        <Menu className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-semibold hidden sm:block">
        {userType === "student" ? "Espace Étudiant" : userType === "teacher" ? "Espace Enseignant" : "Espace Administrateur"}
      </h1>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="font-medium">{getUserName()}</p>
          <p className="text-sm text-gray-500">
            {userType === "student" ? "Étudiant" : userType === "teacher" ? "Enseignant" : "Administrateur"}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
          {getUserInitials()}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
