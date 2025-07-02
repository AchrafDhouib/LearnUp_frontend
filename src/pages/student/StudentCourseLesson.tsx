import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Play,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourse } from "@/services/courseService";
import { getLesson } from "@/services/lessonService";
import { completeLesson } from "@/services/studentCourseService";
import { Course } from "@/types/course";
import StudentNavigation from "@/components/dashboard/StudentNavigation";

const StudentCourseLesson = () => {
  const { id: courseId, lessonId } = useParams<{ id: string; lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseId ? getCourse(courseId) : null,
    enabled: !!courseId
  });

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonId ? getLesson(lessonId) : null,
    enabled: !!lessonId
  });

  const updateProgressMutation = useMutation({
    mutationFn: async () => {
      if (!courseId) throw new Error('Course ID is required');
      return completeLesson(parseInt(courseId));
    },
    onSuccess: (data) => {
      toast({
        title: "Leçon terminée",
        description: `Progression mise à jour: ${Math.round(data.progress)}%`,
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['student-courses'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de mettre à jour la progression",
        variant: "destructive",
      });
    },
  });

  const handleLessonComplete = () => {
    updateProgressMutation.mutate();
  };

  const handleNextLesson = () => {
    if (!course?.lessons || !lessonId) return;
    
    const currentIndex = course.lessons.findIndex(l => l.id === parseInt(lessonId));
    if (currentIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentIndex + 1];
      navigate(`/student/courses/${courseId}/lesson/${nextLesson.id}`);
    } else {
      // Last lesson, go back to course view
      navigate(`/student/courses/${courseId}`);
    }
  };

  const handlePreviousLesson = () => {
    if (!course?.lessons || !lessonId) return;
    
    const currentIndex = course.lessons.findIndex(l => l.id === parseInt(lessonId));
    if (currentIndex > 0) {
      const prevLesson = course.lessons[currentIndex - 1];
      navigate(`/student/courses/${courseId}/lesson/${prevLesson.id}`);
    } else {
      // First lesson, go back to course view
      navigate(`/student/courses/${courseId}`);
    }
  };

  if (courseLoading || lessonLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Chargement de la leçon...</h2>
          <p className="text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Leçon non trouvée</h2>
          <p className="text-gray-500">Impossible de charger la leçon</p>
          <Link to={`/student/courses/${courseId}`}>
            <Button className="mt-4">Retour au cours</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentLessonIndex = course.lessons?.findIndex(l => l.id === parseInt(lessonId)) ?? -1;
  const isFirstLesson = currentLessonIndex === 0;
  const isLastLesson = currentLessonIndex === (course.lessons?.length ?? 0) - 1;

  return (
    <div className="min-h-screen flex">
      <StudentNavigation />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={`/student/courses/${courseId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au cours
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-lg font-semibold">{course.name}</h1>
                <p className="text-sm text-gray-500">
                  Leçon {currentLessonIndex + 1} sur {course.lessons?.length || 0}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {Math.floor(Math.random() * 15) + 5} min
              </Badge>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Lesson Header */}
                  <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
                    <p className="text-gray-600 text-lg">{lesson.description}</p>
                  </div>

                  <Separator />

                  {/* Lesson Content */}
                  <div className="prose max-w-none">
                    {lesson.content ? (
                      <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Contenu de la leçon
                        </h3>
                        <p className="text-gray-500">
                          Le contenu de cette leçon sera bientôt disponible.
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Lesson Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={handlePreviousLesson}
                        disabled={isFirstLesson}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Leçon précédente
                      </Button>
                      
                      <Button
                        onClick={handleLessonComplete}
                        disabled={updateProgressMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme terminée
                      </Button>
                    </div>

                    <Button
                      onClick={handleNextLesson}
                      disabled={isLastLesson}
                    >
                      {isLastLesson ? (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Retour au cours
                        </>
                      ) : (
                        <>
                          Leçon suivante
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseLesson; 