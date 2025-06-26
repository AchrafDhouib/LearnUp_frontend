
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4 flex items-center text-gray-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
            
            <h1 className="text-3xl font-bold mb-4">Conditions d'utilisation</h1>
            <div className="h-1 w-20 bg-primary mb-6"></div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-gray-700">
                Bienvenue sur LearnUp. En accédant à ce site web, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables, et vous acceptez que vous êtes responsable du respect des lois locales applicables. Si vous n'acceptez pas l'une de ces conditions, il vous est interdit d'utiliser ou d'accéder à ce site.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Licence d'utilisation</h2>
              <p className="text-gray-700">
                La permission est accordée de télécharger temporairement une copie des matériaux (informations ou logiciels) sur le site web de LearnUp pour un affichage personnel et non commercial transitoire uniquement. Il s'agit de l'octroi d'une licence, et non d'un transfert de titre, et sous cette licence, vous ne pouvez pas :
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li>modifier ou copier les matériaux;</li>
                <li>utiliser les matériaux à des fins commerciales ou pour toute exposition publique;</li>
                <li>tenter de décompiler ou de désosser tout logiciel contenu sur le site web de LearnUp;</li>
                <li>supprimer tout copyright ou autres notations de propriété des matériaux; ou</li>
                <li>transférer les matériaux à une autre personne ou "miroir" les matériaux sur tout autre serveur.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Compte utilisateur</h2>
              <p className="text-gray-700">
                Si vous créez un compte sur ce site, vous êtes responsable de maintenir la sécurité de votre compte et vous êtes entièrement responsable de toutes les activités qui se déroulent sous le compte et de toute autre action entreprise dans le cadre du compte. Vous devez immédiatement informer LearnUp de toute utilisation non autorisée de votre compte ou de toute autre violation de sécurité.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Contenu de l'utilisateur</h2>
              <p className="text-gray-700">
                Nos services permettent aux utilisateurs de publier, lier, stocker, partager et mettre à disposition certaines informations, textes, graphiques, vidéos ou autres matériaux. Vous êtes responsable du contenu que vous publiez sur ou via le service, y compris sa légalité, fiabilité et pertinence.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Exactitude des informations</h2>
              <p className="text-gray-700">
                Les matériaux apparaissant sur le site web de LearnUp pourraient inclure des erreurs techniques, typographiques ou photographiques. LearnUp ne garantit pas que l'un des matériaux de son site web est exact, complet ou actuel. LearnUp peut apporter des modifications aux matériaux contenus sur son site web à tout moment sans préavis.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Liens</h2>
              <p className="text-gray-700">
                LearnUp n'a pas examiné tous les sites liés à son site web et n'est pas responsable du contenu de ces sites liés. L'inclusion de tout lien n'implique pas l'approbation par LearnUp du site. L'utilisation de tout site web lié est aux risques de l'utilisateur.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Modifications des conditions</h2>
              <p className="text-gray-700">
                LearnUp peut réviser ces conditions d'utilisation de son site web à tout moment sans préavis. En utilisant ce site web, vous acceptez d'être lié par la version alors actuelle de ces conditions d'utilisation.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Loi applicable</h2>
              <p className="text-gray-700">
                Ces conditions sont régies et interprétées conformément aux lois françaises, et vous vous soumettez irrévocablement à la juridiction exclusive des tribunaux de ce pays.
              </p>
            </section>
            
            <div className="pt-4 border-t text-gray-500 text-sm">
              Dernière mise à jour: 27 avril 2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
