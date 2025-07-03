import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  FileText, 
  Play, 
  User, 
  Users,
  Star,
  ArrowLeft,
  Send
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourse } from "@/services/courseService";
import { reviewService } from "@/services/reviewService";
import { Course } from "@/types/course";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

const StudentCourseView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => id ? getCourse(id) : null,
    enabled: !!id
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['course-reviews', id],
    queryFn: () => id ? reviewService.getCourseReviews(id) : null,
    enabled: !!id
  });

  // Get progress from the student's enrolled courses
  const { data: enrolledCourses } = useQuery({
    queryKey: ['student-courses'],
    queryFn: () => import('@/services/studentCourseService').then(m => m.getMyCourses()),
    enabled: !!id
  });

  // Review submission mutation
  const createReviewMutation = useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: { rating: number; comment?: string } }) =>
      reviewService.createReview(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-reviews', id] });
      toast({
        title: "Avis soumis",
        description: "Votre avis a été soumis avec succès.",
      });
      setShowReviewForm(false);
      setRating(5);
      setComment('');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de soumettre l'avis",
        variant: "destructive",
      });
    },
  });

  const handleLessonClick = (lessonId: number) => {
    navigate(`/student/courses/${id}/lesson/${lessonId}`);
  };

  const handleExamClick = () => {
    if (course?.exam) {
      navigate(`/student/pass-quiz/${course.id}`);
    }
  };

  const handleReviewSubmit = () => {
    if (!id) return;
    
    createReviewMutation.mutate({
      courseId: id,
      data: { rating, comment }
    });
  };

  const handleEditReview = (existingReview: any) => {
    setRating(existingReview.rating);
    setComment(existingReview.comment);
    setIsEditing(true);
    setShowReviewForm(true);
  };

  // Calculate progress first
  const enrolledCourse = enrolledCourses?.find(c => c.id === parseInt(id || '0'));
  const progress = enrolledCourse?.progress || 0;
  
  const canSubmitReview = progress >= 100;
  const userReview = reviewsData?.reviews?.find((review: any) => 
    review.user.id === user?.id
  );

  if (isLoading) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Chargement du cours...</h2>
            <p className="text-gray-500">Veuillez patienter</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
            <p className="text-gray-500">Impossible de charger les détails du cours</p>
            <Link to="/student/courses">
              <Button className="mt-4">Retour aux cours</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasQuiz = course.exam !== null;
  const canTakeExam = progress >= 100;

  // We extract instructor information safely
  const instructorName = course.creator 
    ? `${course.creator.first_name || ''} ${course.creator.last_name || ''}`.trim() || course.creator.name
    : 'Instructeur';

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/student/courses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux cours
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{course.name}</h1>
              <p className="text-gray-500">Détails du cours</p>
            </div>
          </div>
        </div>

        {/* Course Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-2/3">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">
                    {course.speciality?.name || 'Général'}
                  </Badge>
                  <Badge variant="outline">
                    Progression: {Math.round(progress)}%
                  </Badge>
                </div>
                
                <h2 className="text-xl font-semibold mb-3">{course.name}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    <span>Par {instructorName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>6 semaines</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>{course.lessons?.length || 0} leçons</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>125 étudiants</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Votre progression</span>
                    <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="rounded-lg overflow-hidden border">
                  <img 
                    src={course.image ? course.image.startsWith('http') ? course.image : `http://localhost:8000/storage/${course.image}` : "https://placehold.co/600x400?text=Course"} 
                    alt={course.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Course";
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content Tabs */}
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
                          className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors border"
                          onClick={() => handleLessonClick(lesson.id)}
                        >
                          <div className="mr-3 p-1.5 rounded-full bg-primary-light text-primary">
                            <Play className="h-3 w-3" />
                          </div>
                          <div className="flex-grow">
                            <span className="font-medium text-sm">Leçon {index + 1}: {lesson.title}</span>
                            <p className="text-xs text-gray-500 mt-1">{lesson.description}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.floor(Math.random() * 15) + 5} min
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
                      <div 
                        className={`flex items-center p-3 rounded-md transition-colors border ${
                          canTakeExam 
                            ? 'hover:bg-gray-50 cursor-pointer bg-green-50' 
                            : 'bg-gray-100 cursor-not-allowed opacity-50'
                        }`}
                        onClick={canTakeExam ? handleExamClick : undefined}
                      >
                        <div className={`mr-3 p-1.5 rounded-full ${
                          canTakeExam ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                        }`}>
                          <FileText className="h-3 w-3" />
                        </div>
                        <div className="flex-grow">
                          <span className="font-medium text-sm">Quiz final</span>
                          <p className="text-xs text-gray-500 mt-1">
                            {canTakeExam 
                              ? "Testez vos connaissances" 
                              : "Complétez toutes les leçons pour accéder au quiz"
                            }
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {canTakeExam ? "Disponible" : "Verrouillé"}
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

              {/* Review Submission Section */}
              {canSubmitReview && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium">Votre avis</h4>
                    {!showReviewForm && !userReview && (
                      <Button 
                        size="sm" 
                        onClick={() => setShowReviewForm(true)}
                        className="bg-primary hover:bg-primary-dark"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Donner un avis
                      </Button>
                    )}
                    {!showReviewForm && userReview && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditReview(userReview)}
                      >
                        Modifier mon avis
                      </Button>
                    )}
                  </div>

                  {showReviewForm && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Note</label>
                        <div className="flex space-x-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setRating(i + 1)}
                              className="text-amber-500 hover:text-amber-600 transition-colors"
                            >
                              <Star 
                                className={`w-6 h-6 ${i < rating ? 'fill-current' : 'fill-none'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Commentaire</label>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Partagez votre expérience avec ce cours..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleReviewSubmit}
                          disabled={createReviewMutation.isPending}
                          className="bg-primary hover:bg-primary-dark"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {createReviewMutation.isPending ? 'Envoi...' : (isEditing ? 'Modifier' : 'Soumettre')}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setShowReviewForm(false);
                            setRating(5);
                            setComment('');
                            setIsEditing(false);
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* User's existing review */}
                  {userReview && !showReviewForm && (
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold mr-3 text-sm">
                            {userReview.user.first_name?.[0]}{userReview.user.last_name?.[0] || userReview.user.name?.[0]}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {userReview.user.first_name && userReview.user.last_name 
                                ? `${userReview.user.first_name} ${userReview.user.last_name}`
                                : userReview.user.name
                              }
                            </div>
                            <div className="text-gray-500 text-xs">
                              {new Date(userReview.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < userReview.rating ? 'fill-current' : 'fill-none'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{userReview.comment}</p>
                    </div>
                  )}
                </div>
              )}

              {!canSubmitReview && (
                <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <CheckCircle className="h-4 w-4 inline mr-2" />
                    Complétez le cours (100%) pour pouvoir donner votre avis
                  </p>
                </div>
              )}
              
              <Separator />
              
              {/* Other reviews */}
              <div>
                <h4 className="text-md font-medium mb-3">Avis des autres étudiants</h4>
                <div className="space-y-4">
                  {reviewsData?.reviews?.filter((review: any) => 
                    review.user.id !== user?.id
                  ).map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold mr-3 text-sm">
                            {review.user.first_name?.[0]}{review.user.last_name?.[0] || review.user.name?.[0]}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {review.user.first_name && review.user.last_name 
                                ? `${review.user.first_name} ${review.user.last_name}`
                                : review.user.name
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
                  )) || (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">
                        Aucun avis disponible pour ce cours
                      </p>
                    </div>
                  )}
                </div>
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
                      {instructorName.split(' ').map(n => n[0]).join('').toUpperCase() || 'IN'}
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
                      Sa méthode d'enseignement pratique et accessible a été saluée par de nombreux étudiants qui ont pu mettre en application les compétences acquises dans leur parcours professionnel.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
  );
};

export default StudentCourseView; 