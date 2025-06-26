
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Quiz, Course, getQuizById, getCourseById } from "@/data/mockData";

const QuizResults = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Simuler un appel API à votre backend Laravel
      const fetchedQuiz = getQuizById(id);
      
      if (fetchedQuiz) {
        setQuiz(fetchedQuiz);
        
        // Simuler des résultats enregistrés (à remplacer par vos données réelles)
        const storedScore = { correct: 8, total: 10 }; // Exemple: 8/10
        setScore(storedScore);
        
        // Simuler des réponses enregistrées
        const sampleAnswers: Record<string, number> = {};
        fetchedQuiz.questions.forEach((question, index) => {
          // Simuler un mélange de réponses correctes et incorrectes
          sampleAnswers[question.id] = index % 3 === 0 ? 
            question.correctAnswer : 
            (question.correctAnswer + 1) % question.options.length;
        });
        setSelectedAnswers(sampleAnswers);
        
        // Récupérer les informations du cours associé
        const fetchedCourse = getCourseById(fetchedQuiz.courseId);
        if (fetchedCourse) {
          setCourse(fetchedCourse);
        }
      }
    }
  }, [id]);

  const handleGetCertificate = () => {
    // Naviguer vers la page du certificat
    if (course) {
      navigate(`/certificate/${course.id}`);
    }
  };

  if (!quiz || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Chargement des résultats...</h2>
          <p className="text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  const isPassed = score.correct / score.total >= 0.7;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center text-gray-600"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au cours
          </Button>
          
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Résultats du quiz</CardTitle>
              <CardDescription className="text-center">
                Vous avez obtenu {score.correct} sur {score.total} questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-6">
                {isPassed ? (
                  <div className="text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Félicitations!</h3>
                    <p className="text-gray-600">Vous avez réussi le quiz avec succès.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <AlertCircle className="w-20 h-20 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Essayez encore!</h3>
                    <p className="text-gray-600">Continuez à étudier et retentez votre chance.</p>
                  </div>
                )}
              </div>
              <div className="mt-6 space-y-4">
                {quiz.questions.map((question, index) => (
                  <div key={question.id} className="p-4 border rounded-md">
                    <p className="font-medium mb-2">Question {index + 1}: {question.text}</p>
                    <div className="grid gap-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className={`p-2 rounded-md ${
                          selectedAnswers[question.id] === optionIndex 
                            ? selectedAnswers[question.id] === question.correctAnswer 
                              ? 'bg-green-100 border-green-300 border' 
                              : 'bg-red-100 border-red-300 border'
                            : optionIndex === question.correctAnswer
                              ? 'bg-green-50 border-green-200 border'
                              : ''
                        }`}>
                          {option}
                          {selectedAnswers[question.id] === optionIndex && 
                           selectedAnswers[question.id] === question.correctAnswer && 
                           <CheckCircle className="inline ml-2 h-4 w-4 text-green-500" />}
                          {selectedAnswers[question.id] === optionIndex && 
                           selectedAnswers[question.id] !== question.correctAnswer && 
                           <AlertCircle className="inline ml-2 h-4 w-4 text-red-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => navigate(`/quiz/${id}`)} variant="outline">Recommencer</Button>
              {isPassed && (
                <Button 
                  className="bg-primary hover:bg-primary-dark flex items-center gap-2"
                  onClick={handleGetCertificate}
                >
                  <Award className="h-5 w-5" />
                  Obtenir le certificat
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
