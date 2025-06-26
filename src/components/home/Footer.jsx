
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold text-white">LearnUp</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Plateforme d'apprentissage en ligne pour développer vos compétences et obtenir des certifications reconnues.
          </p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Liens rapides</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary">Accueil</Link></li>
            <li><Link to="/courses" className="hover:text-primary">Cours</Link></li>
            <li><Link to="/about" className="hover:text-primary">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Légal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/terms-of-service" className="hover:text-primary">Conditions d'utilisation</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-primary">Politique de confidentialité</Link></li>
            <li><Link to="/cookie-policy" className="hover:text-primary">Politique de cookies</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Nous contacter</h4>
          <ul className="space-y-2 text-sm">
           <li>contact@learnup.com</li>
            <li>+216 74 465 020</li>
            <li>Rte de Tunis, Sakiet Ezzit, Sfax, Tunisia</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} LearnUp. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
