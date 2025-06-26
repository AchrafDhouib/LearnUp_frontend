
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <BookOpen className="h-16 w-16 text-primary mb-6" />
      
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page non trouvée</h2>
      
      <p className="max-w-md text-gray-600 mb-8">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/courses">Explorer les cours</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
