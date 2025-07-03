import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "@/services/courseService";
import { getExam } from "@/services/examService";
import { getQuestion } from "@/services/questionService";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Users, Calendar, Clock, User, FileText, Video, File, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourse } from "@/services/courseService";

const TeacherCourseView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const courseId = parseInt(id || "0");

  // Fetch course data
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
  });

  // Fetch exam data if course has an exam
  const { data: exam, isLoading: isLoadingExam } = useQuery({
    queryKey: ["exam", course?.exam?.id],
    queryFn: () => course?.exam?.id ? getExam(course.exam.id) : null,
    enabled: !!course?.exam?.id,
  });

  // Fetch questions with answers if exam exists
  const { data: questionsWithAnswers = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["questions", exam?.id],
    queryFn: async () => {
      if (!exam?.questions) return [];
      
      // Fetch each question individually to get its answers
      const questionsPromises = exam.questions.map((question: any) => 
        getQuestion(question.id)
      );
      
      return Promise.all(questionsPromises);
    },
    enabled: !!exam?.questions && exam.questions.length > 0,
  });

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      });
      navigate("/teacher/courses");
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du cours.",
        variant: "destructive",
      });
      console.error("Error deleting course:", error);
    }
  });

  const handleDeleteCourse = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      deleteMutation.mutate(courseId);
    }
  };

  if (isLoadingCourse || (course?.exam?.id && isLoadingExam) || isLoadingQuestions) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-6">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 mr-4" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout userType="teacher">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cours non trouvé</h2>
          <p className="text-gray-600 mb-6">Le cours que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate("/teacher/courses")}>
            Retour à mes cours
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (isAccepted: 0 | 1 | null) => {
    if (isAccepted === null || isAccepted === undefined) {
      return <Badge variant="secondary">En attente</Badge>;
    }
    if (isAccepted === 1) {
      return <Badge variant="default" className="bg-green-500">Approuvé</Badge>;
    }
    return <Badge variant="destructive">Rejeté</Badge>;
  };

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-4" 
              onClick={() => navigate("/teacher/courses")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{course.name}</h1>
                {getStatusBadge(course.is_accepted)}
              </div>
              <p className="text-gray-500">Détails du cours</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link to={`/teacher/courses/edit/${course.id}`}>
              <Button variant="outline" className="flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="flex items-center text-red-500 border-red-200 hover:bg-red-50"
              onClick={handleDeleteCourse}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Informations du cours</TabsTrigger>
            <TabsTrigger value="lessons">Leçons</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Informations du cours
                </CardTitle>
                <CardDescription>
                  Détails et description du cours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{course.name}</h3>
                  <p className="text-gray-600">{course.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Créé le {new Date(course.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.lessons?.length || 0} leçons
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.speciality?.name || `Spécialité ID: ${course.speciality_id}`}
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {exam ? "Quiz disponible" : "Aucun quiz"}
                  </div>
                  {course.price && (
                    <div className="flex items-center">
                      <span className="font-medium">Prix: {course.price}DT</span>
                      {course.discount && (
                        <span className="text-green-600 ml-1">
                          (-{course.discount}%)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {course.cours_url && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Matériel du cours:</h4>
                    <a 
                      href={course.cours_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {course.cours_url}
                    </a>
                  </div>
                )}

                {course.image && (
                  <div className="mt-4">
                    <img 
                      src={course.image.startsWith('http') ? course.image : `http://localhost:8000/storage/${course.image}`}
                      alt={course.name}
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            {/* Lessons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Leçons du cours
                </CardTitle>
                <CardDescription>
                  Liste des leçons de ce cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {course.lessons && course.lessons.length > 0 ? (
                  <div className="space-y-4">
                    {course.lessons.map((lesson: any, index: number) => (
                      <div key={lesson.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Leçon {index + 1}: {lesson.title}</h4>
                          <Badge variant="outline">{lesson.duration || 'N/A'} min</Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{lesson.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune leçon ajoutée à ce cours</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            {/* Quiz */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Quiz du cours
                </CardTitle>
                <CardDescription>
                  Questions et réponses du quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                {exam ? (
                  <div className="space-y-6">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">{exam.description}</h4>
                      <p className="text-sm text-gray-500">
                        {exam.questions?.length || 0} questions
                      </p>
                    </div>

                    {questionsWithAnswers.length > 0 ? (
                      <div className="space-y-6">
                        {questionsWithAnswers.map((question: any, index: number) => (
                          <div key={question.id} className="border rounded-lg p-4">
                            <h5 className="font-medium mb-3">
                              Question {index + 1}: {question.question}
                            </h5>
                            <div className="space-y-2">
                              {question.answers?.map((answer: any) => (
                                <div 
                                  key={answer.id} 
                                  className={`flex items-center p-2 rounded ${
                                    answer.is_correct 
                                      ? 'bg-green-50 border border-green-200' 
                                      : 'bg-gray-50 border border-gray-200'
                                  }`}
                                >
                                  {answer.is_correct ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                                  )}
                                  <span className={answer.is_correct ? 'text-green-700' : 'text-gray-600'}>
                                    {answer.answer}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Aucune question disponible pour ce quiz</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun quiz créé pour ce cours</p>
                    <Button 
                      className="mt-4"
                      onClick={() => navigate(`/teacher/create-quiz?courseId=${course.id}`)}
                    >
                      Créer un quiz
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherCourseView; 