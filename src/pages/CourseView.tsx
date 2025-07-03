
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Award, BookOpen, CheckCircle, Clock, FileText, Play, User, Users, Star, Calendar, Target, GraduationCap, Euro } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCourse } from "@/services/courseService";
import { Course } from "@/types/course";
import { useAuth } from "@/hooks/useAuth";
import { enrollInCourse, getMyCourses } from "@/services/studentCourseService";
import { reviewService } from "@/services/reviewService";

const CourseView = () => {
  const { id } = useParams<{ id: string }>();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, hasRole } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => id ? getCourse(id) : null,
    enabled: !!id
  });

  // Check enrollment status by getting user's enrolled courses
  const { data: enrolledCourses } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: getMyCourses,
    enabled: isAuthenticated && hasRole('student'),
  });

  // Get course reviews
  const { data: reviewsData } = useQuery({
    queryKey: ['course-reviews', id],
    queryFn: () => id ? reviewService.getCourseReviews(id) : null,
    enabled: !!id
  });

  useEffect(() => {
    if (enrolledCourses && id) {
      const isUserEnrolled = enrolledCourses.some(course => course.id === parseInt(id));
      setIsEnrolled(isUserEnrolled);
    }
  }, [enrolledCourses, id]);

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

  // Check if course is accepted (only show accepted courses to regular users)
  if (course.is_accepted !== 1 && !hasRole('admin') && !(hasRole('teacher') && user?.id === course?.creator_id)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cours non disponible</h2>
          <p className="text-gray-500">Ce cours n'est pas encore approuvé ou n'est pas disponible pour le moment.</p>
          <Link to="/courses">
            <Button className="mt-4">Retour aux cours</Button>
          </Link>
        </div>
      </div>
    );
  }



  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await enrollInCourse(parseInt(id!));
      setIsEnrolled(true);
      // Invalidate and refetch enrolled courses
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      toast({
        title: "Inscription réussie",
        description: `Vous êtes maintenant inscrit au cours: ${course.name}`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur s'est produite lors de l'inscription au cours.",
        variant: "destructive",
      });
    }
  };

  const handleViewCourse = () => {
    if (hasRole('admin')) {
      navigate(`/admin/courses/${id}`);
    } else if (hasRole('teacher') && user?.id === course?.creator_id) {
      navigate(`/teacher/courses/${id}`);
    } else if (isEnrolled) {
      navigate(`/student/courses/${id}`);
    }
  };

  // We extract instructor information safely
  const instructorName = course.creator 
    ? `${course.creator.first_name || ''} ${course.creator.last_name || ''}`.trim() || course.creator.name
    : 'Instructeur';
  
  const instructorInitials = instructorName.split(' ')
    .map(name => name[0] || '')
    .join('')
    .toUpperCase();

  // Calculate course duration based on lessons
  const totalLessons = course.lessons?.length || 0;
  const estimatedHours = Math.ceil(totalLessons * 0.5); // Assuming 30 minutes per lesson

  // Get enrollment count from API
  const enrollmentCount = course.students_count || 0;

  // Convert price to number and handle discount
  const numericPrice = typeof course.price === 'string' ? parseFloat(course.price) : course.price;
  const discountedPrice = numericPrice && course.discount && course.discount > 0 
    ? numericPrice - (numericPrice * course.discount / 100) 
    : numericPrice;
  const hasDiscount = course.discount && course.discount > 0;

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
                  <span>{estimatedHours} heures estimées</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{enrollmentCount} étudiants inscrits</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{totalLessons} leçons</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Créé le {new Date(course.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                {numericPrice !== undefined && numericPrice !== null && !isNaN(numericPrice) && (
                  <div className="flex items-center">
                    <Euro className="h-5 w-5 mr-2 text-gray-500" />
                    {hasDiscount ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg text-green-600">
                          {discountedPrice?.toFixed(2)}DT
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {numericPrice.toFixed(2)}DT
                        </span>
                        <Badge className="bg-red-500 text-white">
                          -{course.discount}%
                        </Badge>
                      </div>
                    ) : (
                      <span className="font-medium text-lg">
                        {numericPrice.toFixed(2)}DT
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Button logic based on user role and enrollment status */}
              {(() => {
                // Admin: Always show "View Course" button
                if (hasRole('admin')) {
                  return (
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary-dark"
                      onClick={handleViewCourse}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Voir le cours
                    </Button>
                  );
                }
                
                // Teacher who created the course: Show "View Course" button
                if (hasRole('teacher') && user?.id === course?.creator_id) {
                  return (
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary-dark"
                      onClick={handleViewCourse}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Voir le cours
                    </Button>
                  );
                }
                
                // Teacher who is NOT the creator: Show no button
                if (hasRole('teacher') && user?.id !== course?.creator_id) {
                  return null;
                }
                
                // Student or unauthenticated user
                if (!isEnrolled) {
                  return (
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary-dark"
                      onClick={handleEnroll}
                    >
                      {numericPrice !== undefined && numericPrice !== null && !isNaN(numericPrice) && numericPrice > 0 
                        ? (hasDiscount 
                            ? `S'inscrire - ${discountedPrice?.toFixed(2)}DT` 
                            : `S'inscrire - ${numericPrice.toFixed(2)}DT`)
                        : 'S\'inscrire gratuitement'
                      }
                    </Button>
                  );
                } else {
                  return (
                    <div className="flex gap-4">
                      <Button 
                        size="lg" 
                        className="bg-primary hover:bg-primary-dark"
                        onClick={handleViewCourse}
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Voir le cours
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
                  );
                }
              })()}
            </div>
            
            <div className="lg:w-1/3">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={course.image ? (course.image.startsWith('http') ? course.image : `http://localhost:8000/storage/${course.image}`) : "https://placehold.co/600x400?text=Course"} 
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
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="content">Contenu du cours</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
                <TabsTrigger value="instructor">Instructeur</TabsTrigger>
              </TabsList>
            
            <TabsContent value="content" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Plan du cours</h3>
                <div className="space-y-4">
                  {/* Leçons Section */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-md font-medium mb-3 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                      Leçons
                    </h4>
                    <div className="space-y-2">
                      {course.lessons?.map((lesson, index) => (
                        <div 
                          key={lesson.id} 
                          className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors border"
                        >
                          <div className="mr-3 p-1.5 rounded-full bg-primary-light text-primary">
                            <Play className="h-3 w-3" />
                          </div>
                          <div className="flex-grow">
                            <span className="font-medium text-sm">Leçon {index + 1}: {lesson.title || `Leçon ${index + 1}`}</span>
                            <p className="text-xs text-gray-500 mt-1">{lesson.description || `Description de la leçon ${index + 1}`}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {lesson.duration || '30 min'}
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-sm">Aucune leçon disponible</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Examen Section */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-md font-medium mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      Examen Quiz
                    </h4>
                    {hasQuiz ? (
                      <div className="flex items-center p-3 rounded-md transition-colors border bg-green-50">
                        <div className="mr-3 p-1.5 rounded-full bg-green-100 text-green-600">
                          <FileText className="h-3 w-3" />
                        </div>
                        <div className="flex-grow">
                          <span className="font-medium text-sm">Quiz final</span>
                          <p className="text-xs text-gray-500 mt-1">Testez vos connaissances</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          Disponible
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Aucun examen disponible pour ce cours</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Avis des étudiants</h3>
              {reviewsData?.stats && reviewsData.stats.average_rating !== undefined && (
                <div className="flex items-center">
                  <div className="text-amber-500 text-lg font-bold mr-2">
                    {typeof reviewsData.stats.average_rating === 'number' 
                      ? reviewsData.stats.average_rating.toFixed(1) 
                      : '0.0'
                    }
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.round(Number(reviewsData.stats.average_rating) || 0) ? 'fill-current' : 'fill-none'}`}
                      />
                    ))}
                  </div>
                  <div className="ml-2 text-gray-500 text-sm">
                    ({reviewsData.stats.total_reviews || 0} avis)
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                reviewsData.reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold mr-3 text-sm">
                          {review.user?.first_name?.[0]}{review.user?.last_name?.[0] || review.user?.name?.[0] || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {review.user?.first_name && review.user?.last_name 
                              ? `${review.user.first_name} ${review.user.last_name}`
                              : review.user?.name || 'Utilisateur anonyme'
                            }
                          </div>
                          <div className="text-gray-500 text-xs">
                            {new Date(review.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'fill-none'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun avis disponible pour ce cours</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="instructor" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center text-primary text-2xl font-bold mb-3 overflow-hidden">
                  {course.creator?.avatar ? (
                    <img 
                      src={course.creator.avatar.startsWith('http') ? course.creator.avatar : `http://localhost:8000/storage/${course.creator.avatar}`}
                      alt={instructorName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${course.creator?.avatar ? 'hidden' : ''}`}>
                    {instructorInitials || 'IN'}
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{instructorName}</h3>
                <p className="text-gray-500 text-sm mb-3">Expert en {course.speciality?.name || 'éducation'}</p>
              </div>
              
              <div className="md:w-2/3">
                <h3 className="text-lg font-semibold mb-3">À propos de l'instructeur</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    {instructorName} est un expert reconnu dans le domaine de {course.speciality?.name || 'l\'éducation'} avec plus de 10 ans d'expérience professionnelle.
                  </p>
                  <p>
                    Passionné par l'enseignement et le partage de connaissances, {instructorName.split(' ')[0]} a formé des milliers d'étudiants à travers le monde et collaboré avec plusieurs entreprises de premier plan dans le secteur.
                  </p>
                  <p>
                    Sa méthode d'enseignement pratique et accessible a été saluée de nombreux étudiants qui ont pu mettre en application les compétences acquises dans leur parcours professionnel.
                  </p>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-3">Informations du cours</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-primary">{course.lessons?.length || 0}</div>
                      <div className="text-xs text-gray-500">Leçons</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-primary">{course.students_count || 0}</div>
                      <div className="text-xs text-gray-500">Étudiants</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-primary">{Math.ceil((course.lessons?.length || 0) * 0.5)}h</div>
                      <div className="text-xs text-gray-500">Durée estimée</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-primary">{reviewsData?.stats?.total_reviews || 0}</div>
                      <div className="text-xs text-gray-500">Avis</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
      </div>
    </div>
  );
};

export default CourseView;
