
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Award, BookOpen, CheckCircle, Clock, FileText, Play, User, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "@/services/courseService";
import { Course } from "@/types/course";

const CourseView = () => {
  const { id } = useParams<{ id: string }>();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { toast } = useToast();
  
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => id ? getCourse(id) : null,
    enabled: !!id
  });

  useEffect(() => {
    // Simulation: vérifier si l'utilisateur est inscrit (à remplacer par un appel à votre API)
    setIsEnrolled(Math.random() > 0.5);
  }, [id]);

  // Vérifie si le quiz est disponible
  const hasQuiz = course?.exam !== null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Chargement du cours...</h2>
          <p className="text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
          <p className="text-gray-500">Impossible de charger les détails du cours</p>
          <Link to="/courses">
            <Button className="mt-4">Retour aux cours</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    // Logique d'inscription au cours (à remplacer par un appel à votre API Laravel)
    setIsEnrolled(true);
    toast({
      title: "Inscription réussie",
      description: `Vous êtes maintenant inscrit au cours: ${course.name}`,
    });
  };

  // We extract instructor information safely
  const instructorName = course.creator 
    ? `${course.creator.first_name || ''} ${course.creator.last_name || ''}`.trim() || course.creator.name
    : 'Instructeur';
  
  const instructorInitials = instructorName.split(' ')
    .map(name => name[0] || '')
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* En-tête du cours */}
      <div className="bg-gradient-to-br from-primary-light to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Badge className="mb-4 bg-primary hover:bg-primary-dark">
                {course.speciality?.name || 'Général'}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.name}</h1>
              <p className="text-gray-700 text-lg mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Par <span className="font-medium">{instructorName}</span></span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  <span>6 semaines</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500" />
                  <span>125 étudiants</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{course.lessons?.length || 0} leçons</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Niveau: Intermédiaire</span>
                </div>
              </div>
              
              {!isEnrolled ? (
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-dark"
                  onClick={handleEnroll}
                >
                  S'inscrire gratuitement
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary-dark">
                    <Play className="h-5 w-5 mr-2" />
                    Continuer le cours
                  </Button>
                  {hasQuiz && (
                    <Link to={`/quiz/${course.id}`}>
                      <Button size="lg" variant="outline" className="gap-2">
                        <FileText className="h-5 w-5" />
                        Passer le quiz
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            <div className="lg:w-1/3">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={course.image ? `http://localhost:8000/storage/${course.image}` : "https://placehold.co/600x400?text=Course"} 
                  alt={course.name}
                  className="w-full h-60 object-cover"
                  onError={(e) => {
                    // Fallback si l'image ne peut pas être chargée
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Course";
                  }}
                />
                <div className="bg-white p-6">
                  <h3 className="font-bold text-lg mb-4">Ce que vous apprendrez</h3>
                  <ul className="space-y-3">
                    {[
                      "Maîtriser les fondamentaux du sujet",
                      "Appliquer vos connaissances à des cas pratiques",
                      "Développer des compétences professionnelles",
                      "Obtenir une certification reconnue",
                    ].map((item, index) => (
                      <li key={index} className="flex">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenu du cours */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="content">Contenu du cours</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
            <TabsTrigger value="instructor">Instructeur</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  {/* Contenu formaté du cours (simulé ici) */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Plan du cours</h2>
                      <div className="space-y-4">
                        {Array.from({ length: 5 }, (_, i) => i + 1).map((module) => (
                          <div key={module} className="border rounded-md p-4">
                            <h3 className="font-semibold text-lg mb-2">Module {module}: {
                              ["Introduction au sujet", "Concepts fondamentaux", "Techniques avancées", "Applications pratiques", "Projets et certification"][module-1]
                            }</h3>
                            <p className="text-gray-600 mb-3">
                              {
                                ["Découvrez les bases et préparez votre environnement d'apprentissage.", 
                                 "Explorez les principes clés et la théorie sous-jacente.", 
                                 "Approfondissez vos connaissances avec des techniques professionnelles.", 
                                 "Mettez en pratique ce que vous avez appris avec des exemples concrets.", 
                                 "Consolidez vos compétences et préparez-vous pour la certification."][module-1]
                              }
                            </p>
                            <div className="space-y-2">
                              {Array.from({ length: 3 }, (_, i) => i + 1).map((lesson) => (
                                <div key={`${module}-${lesson}`} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                                  <div className="mr-3 p-1.5 rounded-full bg-primary-light text-primary">
                                    <Play className="h-4 w-4" />
                                  </div>
                                  <div className="flex-grow">
                                    <span className="text-sm">Leçon {lesson}: Titre de la leçon {lesson}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {Math.floor(Math.random() * 15) + 5} min
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {course.content && (
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Aperçu du cours</h2>
                        <div className="prose max-w-none">
                          {course.content.split('\n').map((line, index) => {
                            if (line.startsWith('# ')) {
                              return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
                            } else if (line.startsWith('## ')) {
                              return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{line.substring(3)}</h2>;
                            } else if (line.startsWith('```')) {
                              return (
                                <pre key={index} className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4">
                                  <code>{line.substring(3)}</code>
                                </pre>
                              );
                            } else {
                              return <p key={index} className="my-2">{line}</p>;
                            }
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Avis des étudiants</h2>
                    <div className="flex items-center">
                      <div className="text-amber-500 text-2xl font-bold mr-2">4.8</div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}
                      </div>
                      <div className="ml-2 text-gray-500">(124 avis)</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { 
                        name: "Marie L.", 
                        avatar: "https://randomuser.me/api/portraits/women/32.jpg", 
                        date: "Il y a 2 semaines", 
                        rating: 5,
                        comment: "Excellent cours! Le contenu est bien structuré et l'instructeur explique les concepts de manière claire et concise. Je recommande vivement ce cours à tous ceux qui souhaitent approfondir leurs connaissances dans ce domaine."
                      },
                      { 
                        name: "Thomas B.", 
                        avatar: "https://randomuser.me/api/portraits/men/45.jpg", 
                        date: "Il y a 1 mois", 
                        rating: 4,
                        comment: "Très bon cours avec des explications claires. J'aurais aimé avoir plus d'exercices pratiques, mais dans l'ensemble, c'est un excellent cours qui m'a beaucoup appris."
                      },
                      { 
                        name: "Sophie M.", 
                        avatar: "https://randomuser.me/api/portraits/women/67.jpg", 
                        date: "Il y a 2 mois", 
                        rating: 5,
                        comment: "Je suis très satisfaite de ce cours. L'instructeur est très compétent et les explications sont claires. Les quiz m'ont permis de vérifier ma compréhension et la certification est un vrai plus pour mon CV."
                      }
                    ].map((review, index) => (
                      <div key={index} className="border-b pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <img 
                              src={review.avatar} 
                              alt={review.name}
                              className="w-10 h-10 rounded-full mr-3" 
                            />
                            <div>
                              <div className="font-medium">{review.name}</div>
                              <div className="text-gray-500 text-sm">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }, (_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="instructor">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-primary-light flex items-center justify-center text-primary text-4xl font-bold mb-4">
                      {instructorInitials || 'IN'}
                    </div>
                    <h3 className="text-xl font-bold">{instructorName}</h3>
                    <p className="text-gray-500 mb-4">Expert en {course.speciality?.name || 'éducation'}</p>
                    <div className="flex space-x-2 text-gray-500">
                      <a href="#" className="hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 20 3.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 .8 7.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 16.407a11.615 11.615 0 0 0 6.29 1.84"></path>
                        </svg>
                      </a>
                      <a href="#" className="hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                        </svg>
                      </a>
                      <a href="#" className="hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.09.682-.217.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.34-3.369-1.34-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  <div className="md:w-3/4">
                    <h2 className="text-2xl font-bold mb-4">À propos de l'instructeur</h2>
                    <div className="prose">
                      <p className="mb-4">
                        {instructorName} est un expert reconnu dans le domaine de {course.speciality?.name || 'l\'éducation'} avec plus de 10 ans d'expérience professionnelle.
                      </p>
                      <p className="mb-4">
                        Passionné par l'enseignement et le partage de connaissances, {instructorName.split(' ')[0]} a formé des milliers d'étudiants à travers le monde et collaboré avec plusieurs entreprises de premier plan dans le secteur.
                      </p>
                      <p>
                        Sa méthode d'enseignement pratique et accessible a été saluée par de nombreux étudiants qui ont pu mettre en application les compétences acquises dans leur parcours professionnel.
                      </p>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-bold text-lg mb-3">Statistiques de l'instructeur</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">4.8</div>
                          <div className="text-sm text-gray-500">Note moyenne</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">5,243</div>
                          <div className="text-sm text-gray-500">Étudiants</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">12</div>
                          <div className="text-sm text-gray-500">Cours</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">853</div>
                          <div className="text-sm text-gray-500">Avis</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseView;
