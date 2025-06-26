
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary-light to-accent-light relative overflow-hidden">
      {/* Éléments de design en arrière-plan */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-accent/10 blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          Prêt à transformer votre avenir professionnel ?
        </h2>
        <div className="bg-white rounded-xl max-w-3xl mx-auto mb-10 shadow-xl border border-gray-100">
          <p className="text-xl p-8 text-gray-700 leading-relaxed">
            Rejoignez une communauté d'apprenants dynamiques. Développez des compétences recherchées et propulsez votre carrière avec nos formations de haute qualité.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/register" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold px-10 py-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out border-2 border-primary-dark"
            >
              S'inscrire gratuitement
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto bg-white text-primary-dark border-2 border-primary-dark hover:bg-gray-50 font-bold px-10 py-6 rounded-lg shadow-md transition-all duration-300 ease-in-out"
            >
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
