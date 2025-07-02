import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, PenSquare, ArrowLeft, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface Answer {
  id: number;
  answer: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question: string;
  type: 'unique_choice' | 'multiple_choice';
  answers: Answer[];
}

interface Quiz {
  id: number;
  description: string;
  cours_id: number;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

interface Course {
  id: number;
  name: string;
  description: string;
}

const TeacherQuizIndex = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError("Vous devez être connecté pour accéder à cette page.");
          setLoading(false);
          return;
        }

        // Fetch quiz data
        const quizResponse = await axios.get(`http://localhost:8000/api/exams/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const quizData = quizResponse.data;
        setQuiz(quizData);

        // Fetch course data
        if (quizData.cours_id) {
          const courseResponse = await axios.get(`http://localhost:8000/api/courses/${quizData.cours_id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setCourse(courseResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch quiz data:", error);
        setError("Impossible de charger le quiz. Veuillez réessayer.");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/teacher/quizzes')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Chargement du quiz...</h2>
            <p className="text-gray-500">Veuillez patienter</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !quiz) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/teacher/quizzes')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Erreur</h2>
            <p className="text-gray-500">{error || "Quiz non trouvé"}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/teacher/quizzes')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{quiz.description}</h1>
              <p className="text-gray-500">
                Cours: {course?.name || "Cours non spécifié"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link to={`/quiz/${quiz.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Voir en mode étudiant
              </Button>
            </Link>
            <Link to={`/teacher/quizzes/${quiz.id}/edit`}>
              <Button size="sm">
                <PenSquare className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </Link>
          </div>
        </div>

        {/* Quiz Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre de questions</p>
                <p className="text-lg font-semibold">{quiz.questions.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Créé le</p>
                <p className="text-sm">{formatDate(quiz.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Modifié le</p>
                <p className="text-sm">{formatDate(quiz.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Questions ({quiz.questions.length})</h2>
          
          {quiz.questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span>Question {index + 1}</span>
                    <Badge variant="outline">
                      {question.type === 'unique_choice' ? 'Choix unique' : 'Choix multiple'}
                    </Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-lg font-medium mb-4">{question.question}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Réponses :</h4>
                  <div className="space-y-2">
                    {question.answers.map((answer, answerIndex) => (
                      <div 
                        key={answer.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          answer.is_correct 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {answer.is_correct ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="font-medium">
                            {String.fromCharCode(65 + answerIndex)}.
                          </span>
                        </div>
                        <span className={answer.is_correct ? 'font-medium' : ''}>
                          {answer.answer}
                        </span>
                        {answer.is_correct && (
                          <Badge variant="secondary" className="ml-auto">
                            Correcte
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherQuizIndex; 