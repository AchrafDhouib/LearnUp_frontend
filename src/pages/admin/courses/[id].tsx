import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "@/services/courseService";
import { getExam } from "@/services/examService";
import { getQuestion } from "@/services/questionService";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Users, Calendar, Clock, User, FileText, Video, File, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CourseIndex = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  if (isLoadingCourse || (course?.exam?.id && isLoadingExam) || isLoadingQuestions) {
    return (
      <DashboardLayout userType="admin">
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
      <DashboardLayout userType="admin">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cours non trouvé</h2>
          <p className="text-gray-600 mb-6">Le cours que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate("/admin/courses")}>
            Retour aux cours
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (isAccepted: boolean | null) => {
    if (isAccepted === null || isAccepted === undefined) {
      return <Badge variant="secondary">En attente</Badge>;
    }
    if (isAccepted) {
      return <Badge variant="default" className="bg-green-500">Approuvé</Badge>;
    }
    return <Badge variant="destructive">Rejeté</Badge>;
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4" 
            onClick={() => navigate("/admin/courses")}
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

        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Informations du cours</TabsTrigger>
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
                    <User className="h-4 w-4 mr-1" />
                    {course.creator?.name || `Enseignant ID: ${course.creator_id}`}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.lessons?.length || 0} leçons
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.speciality?.name || `Spécialité ID: ${course.speciality_id}`}
                  </div>
                  {course.price && (
                    <div className="flex items-center">
                      <span className="font-medium">Prix: {course.price}€</span>
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

            {/* Lessons */}
            <Card>
              <CardHeader>
                <CardTitle>Leçons du cours</CardTitle>
                <CardDescription>
                  Liste des leçons disponibles pour ce cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {course.lessons && course.lessons.length > 0 ? (
                  <div className="space-y-4">
                    {course.lessons.map((lesson: any, index: number) => (
                      <div key={lesson.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <FileText className="h-5 w-5 text-blue-500 mr-2" />
                              <h3 className="font-medium">
                                Leçon {index + 1}: {lesson.title}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {lesson.duration} minutes
                              </span>
                              {lesson.url_video && (
                                <span className="flex items-center">
                                  <Video className="h-3 w-3 mr-1" /> Vidéo disponible
                                </span>
                              )}
                              {lesson.url_pdf && (
                                <span className="flex items-center">
                                  <File className="h-3 w-3 mr-1" /> PDF disponible
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune leçon trouvée pour ce cours.</p>
                    <p className="text-sm">Ajoutez des leçons pour commencer.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quiz" className="space-y-6">
            {/* Quiz */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz du cours</CardTitle>
                <CardDescription>
                  {exam ? `${exam.description} - ${questionsWithAnswers.length} questions` : 'Aucun quiz disponible'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {questionsWithAnswers.length > 0 ? (
                  <div className="space-y-6">
                    {questionsWithAnswers.map((question: any, questionIndex: number) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-2 mb-3">
                          <Badge variant="outline" className="mt-1">
                            {question.type === 'unique_choice' ? 'Choix unique' : 'Choix multiple'}
                          </Badge>
                          <h3 className="font-medium flex-1">
                            Question {questionIndex + 1}: {question.question}
                          </h3>
                        </div>
                        {question.answers && question.answers.length > 0 ? (
                          <div className="space-y-2">
                            {question.answers.map((answer: any) => (
                              <div 
                                key={answer.id} 
                                className={`p-3 rounded-lg border ${
                                  answer.is_correct === 1
                                    ? 'bg-green-50 border-green-200' 
                                    : 'bg-red-50 border-red-200'
                                }`}
                              >
                                <div className="flex items-center">
                                  {answer.is_correct === 1 ? (
                                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                                  )}
                                  <span className={answer.is_correct === 1 ? 'text-green-800' : 'text-red-800'}>
                                    {answer.answer}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Aucune réponse disponible pour cette question.</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun quiz trouvé pour ce cours.</p>
                    <p className="text-sm">Créez un quiz pour évaluer les étudiants.</p>
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

export default CourseIndex; 