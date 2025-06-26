
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const CookiePolicy = () => {
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
            
            <h1 className="text-3xl font-bold mb-4">Politique de cookies</h1>
            <div className="h-1 w-20 bg-primary mb-6"></div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-gray-700">
                Cette politique de cookies explique ce que sont les cookies et comment LearnUp les utilise. Vous devez lire cette politique pour comprendre ce que sont les cookies, comment nous les utilisons, les types de cookies que nous utilisons, les informations que nous collectons à l'aide des cookies et comment ces informations sont utilisées, ainsi que comment contrôler les préférences en matière de cookies.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Qu'est-ce qu'un cookie ?</h2>
              <p className="text-gray-700">
                Les cookies sont de petits fichiers texte qui sont utilisés pour stocker de petites informations. Ils sont stockés sur votre appareil lorsque le site web est chargé dans votre navigateur. Ces cookies nous aident à faire fonctionner le site web correctement, à le rendre plus sécurisé, à fournir une meilleure expérience utilisateur, et à comprendre comment le site web fonctionne et à analyser ce qui fonctionne et où il doit être amélioré.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Comment utilisons-nous les cookies ?</h2>
              <p className="text-gray-700">
                Comme la plupart des services en ligne, notre site web utilise des cookies de première partie et de tierce partie à plusieurs fins. Les cookies de première partie sont principalement nécessaires au bon fonctionnement du site web et ils ne collectent aucune de vos données personnelles identifiables.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Types de cookies que nous utilisons</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Cookies essentiels</h3>
                  <p className="text-gray-700">Ces cookies sont nécessaires au fonctionnement du site web et ne peuvent pas être désactivés dans nos systèmes. Ils sont généralement établis uniquement en réponse à des actions que vous effectuez et qui correspondent à une demande de services, comme la définition de vos préférences de confidentialité, la connexion ou le remplissage de formulaires.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Cookies de fonctionnalité</h3>
                  <p className="text-gray-700">Ces cookies permettent au site web de fournir des fonctionnalités et une personnalisation améliorées. Ils peuvent être définis par nous ou par des fournisseurs tiers dont nous avons ajouté les services à nos pages.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Cookies analytiques</h3>
                  <p className="text-gray-700">Ces cookies nous permettent de compter les visites et les sources de trafic afin que nous puissions mesurer et améliorer les performances de notre site. Ils nous aident à savoir quelles pages sont les plus et les moins populaires et à voir comment les visiteurs se déplacent sur le site.</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Cookies de ciblage</h3>
                  <p className="text-gray-700">Ces cookies peuvent être définis sur notre site par nos partenaires publicitaires. Ils peuvent être utilisés par ces entreprises pour établir un profil de vos intérêts et vous montrer des publicités pertinentes sur d'autres sites.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Gérer vos préférences de cookies</h2>
              <p className="text-gray-700">
                Vous pouvez définir ou modifier vos préférences web pour accepter ou refuser les cookies en visitant la page des préférences en matière de cookies sur notre site web. Si vous choisissez de refuser certains cookies, vous pouvez toujours utiliser notre site web, mais votre accès à certaines fonctionnalités et zones de notre site web peut être limité.
              </p>
              <p className="text-gray-700 mt-2">
                De plus, différents navigateurs offrent différentes méthodes pour bloquer et supprimer les cookies utilisés par les sites web. Vous pouvez modifier les paramètres de votre navigateur pour bloquer/supprimer les cookies.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Cookies que nous utilisons</h2>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objectif</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">sessionID</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">LearnUp.com</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Utilisé pour maintenir votre session</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Session</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">preferences</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">LearnUp.com</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Stocke vos préférences utilisateur</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1 an</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">_ga</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Google Analytics</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Distingue les utilisateurs</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2 ans</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">_gid</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Google Analytics</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Distingue les utilisateurs</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">24 heures</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Plus d'informations</h2>
              <p className="text-gray-700">
                Si vous avez des questions sur cette politique de cookies, vous pouvez nous contacter:
              </p>
              <ul className="list-none pl-0 mt-2 space-y-1 text-gray-700">
                <li>Par email: cookies@LearnUp.com</li>
                <li>Par courrier: LearnUp, 123 Avenue de la Formation, 75001 Paris, France</li>
              </ul>
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

export default CookiePolicy;
