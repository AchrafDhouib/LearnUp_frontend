import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, GraduationCap, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import CourseCategoryCard from "@/components/CourseCategoryCard";
import { courses, courseCategories } from "@/data/mockData";

const features = [
  {
    icon: <BookOpen className="h-12 w-12 text-primary" />,
    title: "Cours de qualité",
    description: "Accédez à des cours créés par des experts reconnus dans leur domaine.",
  },
  {
    icon: <CheckCircle className="h-12 w-12 text-primary" />,
    title: "Quiz interactifs",
    description: "Testez vos connaissances avec des quiz interactifs à la fin de chaque cours.",
  },
  {
    icon: <GraduationCap className="h-12 w-12 text-primary" />,
    title: "Certifications",
    description: "Obtenez des certifications reconnues pour valoriser vos compétences.",
  },
];

const Index = () => {
  const [featuredCourses] = useState(courses.slice(0, 3));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light via-white to-accent-light py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Apprenez, certifiez, <span className="text-primary">évoluez</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Développez vos compétences avec notre plateforme e-learning complète. Accédez à des cours de qualité, passez des quiz et obtenez des certifications reconnues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary-dark gap-2">
                  <UserPlus className="h-5 w-5" />
                  Commencer maintenant
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="gap-2">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh1LfufSj-2o4xYJhJV7tWSkZGT8qbYhgBbA&s" 
              alt="E-learning Platform" 
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Explorez nos catégories</h2>
          <p className="text-gray-600 text-center mb-12">Découvrez une large gamme de cours dans différents domaines</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseCategories.map((category) => (
              <CourseCategoryCard
                key={category.id}
                {...category}
                courseCount={courses.filter((course) => course.category === category.name).length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-light to-primary-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir notre plateforme ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-10 px-6 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-full bg-primary-light text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Cours populaires</h2>
            <Link to="/courses">
              <Button variant="ghost" className="text-primary hover:text-primary-dark">
                Voir tous les cours
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/register">
              <Button size="lg" className="bg-primary hover:bg-primary-dark"> 
                Rejoindre la communauté
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos utilisateurs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie L.",
                role: "Développeuse web",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                text: "J'ai pu développer considérablement mes compétences grâce aux cours disponibles sur cette plateforme. Les certifications m'ont aidée à décrocher un nouveau poste !"
              },
              {
                name: "Thomas D.",
                role: "Étudiant en informatique",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                text: "Les quiz interactifs m'ont permis de consolider mes connaissances. Le format des cours est parfait pour apprendre à mon rythme."
              },
              {
                name: "Julie M.",
                role: "Chef de projet digital",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
                text: "En tant qu'enseignante sur la plateforme, j'apprécie la facilité avec laquelle je peux créer et partager du contenu avec mes étudiants."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-none shadow hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4" 
                    />
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary via-accent to-primary-dark text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à commencer votre parcours d'apprentissage ?</h2>
          <p className="text-xl mb-8 text-white/90">
            Rejoignez notre communauté d'apprenants et commencez à développer vos compétences dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                S'inscrire gratuitement
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              <li><Link to="/terms" className="hover:text-primary">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy" className="hover:text-primary">Politique de confidentialité</Link></li>
              <li><Link to="/cookies" className="hover:text-primary">Politique de cookies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Nous contacter</h4>
            <ul className="space-y-2 text-sm">
              <li>contact@LearnUp.com</li>
              <li>+33 1 23 45 67 89</li>
              <li>123 Rue de l'Innovation, 75000 Paris</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} LearnUp. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};


export default Index;
