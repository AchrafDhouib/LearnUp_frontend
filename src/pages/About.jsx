import { Card } from "@/components/ui/card";
import { GraduationCap, Users, Award, Globe, BookOpen, Target, Heart, HandHeart, Trophy, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/home/Footer";

const About = () => {
  const stats = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      value: "10,000+",
      label: "Étudiants actifs",
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      value: "500+",
      label: "Cours disponibles",
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      value: "15,000+",
      label: "Certifications délivrées",
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      value: "50+",
      label: "Pays représentés",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section - Effet de parallaxe */}
<section style={{ position: "relative", height: "500px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(var(--primary-rgb, 155 135 245), 0.7), rgba(var(--accent-dark-rgb, 0 0 0), 0.7))", mixBlendMode: "multiply" }} />
  <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }} />
  <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1rem" }}>
    <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "2rem", color: "white", backgroundColor: "rgba(0, 0, 0, 0.4)", padding: "0.5rem 1rem", borderRadius: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} className="animate-fade-in">
      Façonnons ensemble
      <span style={{ display: "block", marginTop: "0.5rem" }}>l'avenir de l'éducation</span>
    </h1>
    <p style={{ fontSize: "1.25rem", color: "white", backgroundColor: "rgba(0, 0, 0, 0.4)", padding: "0.5rem 1rem", borderRadius: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", lineHeight: "1.625", marginBottom: "2rem", maxWidth: "48rem", marginLeft: "auto", marginRight: "auto" }} className="animate-fade-in">
      Notre mission est de démocratiser l'accès à une éducation de qualité.
      Nous croyons que chaque personne mérite d'avoir les meilleures opportunités
      d'apprentissage pour développer son potentiel.
    </p>
  </div>
</section>

        {/* Stats Section - Avec animation au scroll */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Notre Impact en Chiffres</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card 
                  key={index} 
                  className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="inline-flex p-4 rounded-full bg-primary-light mb-6 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <h3 className="text-4xl font-bold mb-3 text-primary">{stat.value}</h3>
                  <p className="text-gray-600 text-lg">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Notre Histoire Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">Notre Histoire</h2>
                <div className="space-y-6 text-gray-700">
                  <p className="text-lg leading-relaxed">
                    En 2023, un groupe de passionnés d'éducation et de technologie s'est réuni avec une vision commune : 
                    transformer l'apprentissage en ligne en une expérience accessible, engageante et personnalisée.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Notre plateforme combine les dernières avancées technologiques et les meilleures pratiques pédagogiques 
                    pour offrir une expérience d'apprentissage unique, adaptée aux besoins de chacun.
                  </p>
                </div>
                <div className="flex gap-4 mt-8">
                  <div className="flex items-center gap-2 text-primary">
                    <HandHeart className="h-6 w-6" />
                    <span className="font-medium">Support personnalisé</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Trophy className="h-6 w-6" />
                    <span className="font-medium">Excellence académique</span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
                  alt="Notre équipe au travail"
                  className="relative rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs Section - Avec animations au hover */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Nos Valeurs Fondamentales</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: <Star className="h-8 w-8 text-primary mb-6" />,
                  title: "Excellence",
                  description: "Nous nous engageons à fournir un contenu éducatif de la plus haute qualité et à maintenir des standards d'excellence dans tous nos cours.",
                },
                {
                  icon: <BookOpen className="h-8 w-8 text-primary mb-6" />,
                  title: "Innovation",
                  description: "Nous explorons constamment de nouvelles approches pédagogiques et technologiques pour enrichir l'expérience d'apprentissage.",
                },
                {
                  icon: <Heart className="h-8 w-8 text-primary mb-6" />,
                  title: "Inclusion",
                  description: "Nous créons un environnement accueillant où chaque apprenant, quels que soient ses origines ou son niveau, peut s'épanouir.",
                },
              ].map((value, index) => (
                <Card 
                  key={index} 
                  className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group bg-gradient-to-b from-white to-gray-50/50"
                >
                  <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;