
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-white to-primary-light py-20 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-accent opacity-10"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-primary opacity-5"></div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center relative z-10">
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Apprenez, certifiez, <span className="text-primary">évoluez</span>
          </h1>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            Développez vos compétences avec notre plateforme e-learning complète. 
            Accédez à des cours de qualité, passez des quiz et obtenez des 
            certifications reconnues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/register">
              <Button size="lg" className="bg-primary hover:bg-primary-dark gap-2 px-8 shadow-lg">
                <UserPlus className="h-5 w-5" />
                Commencer maintenant
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2 px-8 border-2">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-lg -m-2 blur-xl"></div>
          <img 
            src="/src/components/home/image.jpg" 
            alt="E-learning Platform" 
            className="w-full h-auto rounded-lg shadow-xl relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
