
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const PrivacyPolicy = () => {
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
            
            <h1 className="text-3xl font-bold mb-4">Politique de confidentialité</h1>
            <div className="h-1 w-20 bg-primary mb-6"></div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-gray-700">
                Chez LearnUp, nous prenons la protection de vos données personnelles très au sérieux. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre plateforme.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Collecte d'informations</h2>
              <p className="text-gray-700">
                Nous collectons différents types d'informations à différentes fins pour vous fournir et améliorer notre service. Voici les types d'informations que nous collectons:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li><strong>Données personnelles</strong>: Nom, adresse e-mail, numéro de téléphone, adresse postale</li>
                <li><strong>Données d'utilisation</strong>: Informations sur la manière dont vous utilisez notre service</li>
                <li><strong>Données de suivi et cookies</strong>: Cookies et technologies similaires pour suivre l'activité sur notre service</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Utilisation des données</h2>
              <p className="text-gray-700">
                LearnUp utilise les données collectées pour diverses finalités:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li>Fournir et maintenir notre service</li>
                <li>Vous informer des changements apportés à notre service</li>
                <li>Vous permettre de participer aux fonctionnalités interactives de notre service</li>
                <li>Fournir une assistance client</li>
                <li>Recueillir des analyses ou des informations précieuses afin d'améliorer notre service</li>
                <li>Surveiller l'utilisation de notre service</li>
                <li>Détecter, prévenir et résoudre les problèmes techniques</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Conservation des données</h2>
              <p className="text-gray-700">
                LearnUp conservera vos données personnelles uniquement aussi longtemps que nécessaire aux fins énoncées dans cette politique de confidentialité. Nous conserverons et utiliserons vos données personnelles dans la mesure nécessaire pour nous conformer à nos obligations légales, résoudre les litiges et appliquer nos politiques.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Transfert des données</h2>
              <p className="text-gray-700">
                Vos informations, y compris les données personnelles, peuvent être transférées vers — et maintenues sur — des ordinateurs situés en dehors de votre état, province, pays ou autre juridiction gouvernementale où les lois sur la protection des données peuvent différer de celles de votre juridiction.
              </p>
              <p className="text-gray-700 mt-2">
                Si vous êtes situé en dehors de la France et que vous choisissez de nous fournir des informations, veuillez noter que nous transférons les données, y compris les données personnelles, en France et les traitons là-bas.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Divulgation des données</h2>
              <p className="text-gray-700">
                LearnUp peut divulguer vos données personnelles de bonne foi lorsque nous pensons que cette action est nécessaire pour:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li>Se conformer à une obligation légale</li>
                <li>Protéger et défendre les droits ou la propriété de LearnUp</li>
                <li>Prévenir ou enquêter sur d'éventuels actes répréhensibles en lien avec le service</li>
                <li>Protéger la sécurité personnelle des utilisateurs du service ou du public</li>
                <li>Se protéger contre la responsabilité juridique</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Sécurité des données</h2>
              <p className="text-gray-700">
                La sécurité de vos données est importante pour nous, mais rappelez-vous qu'aucune méthode de transmission sur Internet ou méthode de stockage électronique n'est sûre à 100%. Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos données personnelles, nous ne pouvons garantir leur sécurité absolue.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Vos droits</h2>
              <p className="text-gray-700">
                Si vous êtes un résident de l'Union européenne, vous disposez de certains droits en matière de protection des données, notamment:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                <li>Le droit d'accéder, de mettre à jour ou de supprimer les informations que nous avons sur vous</li>
                <li>Le droit de rectification</li>
                <li>Le droit d'opposition</li>
                <li>Le droit de restriction</li>
                <li>Le droit à la portabilité des données</li>
                <li>Le droit de retirer son consentement</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Modifications de cette politique de confidentialité</h2>
              <p className="text-gray-700">
                Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique de confidentialité sur cette page.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Nous contacter</h2>
              <p className="text-gray-700">
                Si vous avez des questions sur cette politique de confidentialité, veuillez nous contacter à:
              </p>
              <ul className="list-none pl-0 mt-2 space-y-1 text-gray-700">
                <li>Par email: privacy@LearnUp.com</li>
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

export default PrivacyPolicy;
