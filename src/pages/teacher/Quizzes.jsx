
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { PlusCircle, PenSquare, Trash2, FileText, Users } from "lucide-react";
import { quizzes, courses } from "@/data/mockData";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const TeacherQuizzes = () => {
  const [teacherQuizzes, setTeacherQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/api/exams', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setTeacherQuizzes(response.data || []);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos quiz.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, [toast]);

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) {
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8000/api/exams/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast({
        title: "Quiz supprimé",
        description: "Le quiz a été supprimé avec succès.",
      });
      
      // Update the quiz list
      setTeacherQuizzes(teacherQuizzes.filter(quiz => quiz.id !== quizId));
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le quiz.",
        variant: "destructive",
      });
    }
  };

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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Chargement des quiz...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {teacherQuizzes.length > 0 ? (
              teacherQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{quiz.description}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Cours: {quiz.course?.name || "Cours non spécifié"}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center text-sm text-gray-500">
                            <FileText className="h-4 w-4 mr-1" />
                            {quiz.questions?.length || 0} questions
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/teacher/edit-quiz/${quiz.id}`}>
                          <Button variant="outline" size="sm">
                            <PenSquare className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherQuizzes;