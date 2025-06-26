
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  User,
  ChevronDown,
  LogOut,
  Settings 
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U";
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    }
    return user.name ? user.name.charAt(0) : "U";
  };

  // Function to get full name
  const getFullName = () => {
    if (!user) return "";
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.name || "";
  };

  return (
    <nav className="bg-white shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LearnCertify</span>
          </Link>
          
          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-dark">Accueil</Link>
            <Link to="/courses" className="text-gray-700 hover:text-primary-dark">Cours</Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-dark">À propos</Link>
          </div>
        </div>

        {/* Desktop Authentication Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role?.includes('teacher') && (
                <Link to="/teacher/dashboard">
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                    Enseigner sur learnup
                  </Button>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {user?.avatar && <AvatarImage src={user.avatar} alt={getFullName()} />}
                      <AvatarFallback className="bg-primary text-white">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span>{getFullName()}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to={user?.role?.includes('teacher') ? "/teacher/profile" : "/student/profile"}>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to={user?.role?.includes('teacher') ? "/teacher/settings" : "/student/settings"}>
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
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  <LogIn className="h-4 w-4 mr-1" />
                  Se connecter
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  <UserPlus className="h-4 w-4 mr-1" />
                  S'inscrire
                </Button>
              </Link>
              <Link to="/teacher/register">
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  Enseigner sur learnup
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white p-4 rounded-md shadow-md">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-dark py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/courses" 
              className="text-gray-700 hover:text-primary-dark py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Cours
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary-dark py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role?.includes('teacher') && (
                  <Link 
                    to="/teacher/dashboard" 
                    className="text-gray-700 hover:text-primary-dark py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Enseigner sur learnup
                  </Link>
                )}
                <Link 
                  to={user?.role?.includes('teacher') ? "/teacher/profile" : "/student/profile"} 
                  className="text-gray-700 hover:text-primary-dark py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon profil
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-primary-dark py-2"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-dark py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se connecter
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-1">
                    <UserPlus className="h-4 w-4 mr-1" />
                    S'inscrire
                  </Button>
                </Link>
                <Link to="/teacher/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    Enseigner sur learnup
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
