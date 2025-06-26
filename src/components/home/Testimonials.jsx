
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
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
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 relative">
          <span className="relative z-10">Ce que disent nos utilisateurs</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-8 px-6">
                <p className="text-gray-600 italic mb-6">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 ring-2 ring-primary/20" 
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-primary">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
