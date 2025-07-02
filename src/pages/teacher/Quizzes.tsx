import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { PlusCircle, PenSquare, Trash2, FileText, Users, Eye, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExams, deleteExam } from "@/services/examService";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Exam {
  id: number;
  description: string;
  course?: {
    id: number;
    name: string;
  };
  questions?: Array<{
    id: number;
    text: string;
  }>;
  created_at: string;
  updated_at: string;
}

const TeacherQuizzes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch teacher's exams
  const { data: exams = [], isLoading, error } = useQuery({
    queryKey: ['teacher-exams'],
    queryFn: getExams,
  });

  // Delete exam mutation
  const deleteMutation = useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-exams'] });
      toast({
        title: "Quiz supprimé",
        description: "Le quiz a été supprimé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de supprimer le quiz.",
        variant: "destructive",
      });
      console.error("Error deleting exam:", error);
    }
  });

  const handleDeleteQuiz = (examId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) {
      deleteMutation.mutate(examId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes quiz</h1>
              <p className="text-gray-500">Créez et gérez des quiz pour vos étudiants.</p>
            </div>
            <Link to="/teacher/create-quiz">
              <Button className="bg-primary hover:bg-primary-dark">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouveau quiz
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-64" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes quiz</h1>
              <p className="text-gray-500">Créez et gérez des quiz pour vos étudiants.</p>
            </div>
            <Link to="/teacher/create-quiz">
              <Button className="bg-primary hover:bg-primary-dark">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouveau quiz
              </Button>
            </Link>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Impossible de charger vos quiz. Veuillez réessayer.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes quiz</h1>
            <p className="text-gray-500">Créez et gérez des quiz pour vos étudiants.</p>
          </div>
          <Link to="/teacher/create-quiz">
            <Button className="bg-primary hover:bg-primary-dark">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouveau quiz
            </Button>
          </Link>
        </div>

        {exams.length > 0 ? (
          <div className="grid gap-4">
            {exams.map((exam: Exam) => (
              <Card key={exam.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{exam.description}</h3>
                        <Badge variant="outline" className="text-xs">
                          {exam.questions?.length || 0} questions
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          Cours: {exam.course?.name || "Cours non spécifié"}
                        </p>
                        <p>
                          Créé le: {formatDate(exam.created_at)}
                        </p>
                        {exam.updated_at !== exam.created_at && (
                          <p>
                            Modifié le: {formatDate(exam.updated_at)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Link to={`/teacher/quizzes/${exam.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                      </Link>
                      <Link to={`/teacher/quizzes/${exam.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <PenSquare className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteQuiz(exam.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vous n'avez pas encore créé de quiz</h3>
            <p className="text-gray-600 mb-6">
              Créez votre premier quiz pour tester les connaissances de vos étudiants
            </p>
            <Link to="/teacher/create-quiz">
              <Button className="bg-primary hover:bg-primary-dark">
                <PlusCircle className="h-4 w-4 mr-2" />
                Créer un quiz
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherQuizzes;