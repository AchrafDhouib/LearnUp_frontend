
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { User } from "@/types/user";

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  userType: "student" | "teacher" | "admin";
}

const MobileMenu = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isAuthenticated, 
  user, 
  logout,
  userType 
}: MobileMenuProps) => {
  if (!isMenuOpen) return null;

  return (
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
  );
};

export default MobileMenu;
