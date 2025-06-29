import { Menu, ChevronDown, User, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { User as UserType } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userType: "student" | "teacher" | "admin";
  user: UserType | null;
  setMobileOpen: (open: boolean) => void;
}

const DashboardHeader = ({ userType, user, setMobileOpen }: DashboardHeaderProps) => {
  const { logout } = useAuth();

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

  // Function to get dashboard link based on user type
  const getDashboardLink = () => {
    switch (userType) {
      case "student":
        return "/student/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  // Function to get profile link based on user type
  const getProfileLink = () => {
    switch (userType) {
      case "student":
        return "/student/profile";
      case "teacher":
        return "/teacher/profile";
      case "admin":
        return "/admin/settings";
      default:
        return "/";
    }
  };

  // Function to get settings link based on user type
  const getSettingsLink = () => {
    switch (userType) {
      case "student":
        return "/student/settings";
      case "teacher":
        return "/teacher/settings";
      case "admin":
        return "/admin/settings";
      default:
        return "/";
    }
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

        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                {user?.avatar && <AvatarImage src={user.avatar} alt={getUserName()} />}
                <AvatarFallback className="bg-primary text-white text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block">{getUserName()}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to={getDashboardLink()}>
              <DropdownMenuItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Tableau de bord</span>
              </DropdownMenuItem>
            </Link>
            <Link to={getProfileLink()}>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
            </Link>
            <Link to={getSettingsLink()}>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
