import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import QuizComponent from "@/components/QuizComponent";
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
  cour_id: number;
  questions: Question[];
}

interface Course {
  id: number;
  name: string;
  description: string;
}

// Interface for QuizComponent
interface QuizComponentQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Transform API data to QuizComponent format
  const transformQuestions = (questions: Question[]): QuizComponentQuestion[] => {
    return questions.map((q, index) => {
      const options = q.answers.map(a => a.answer);
      const correctAnswerIndex = q.answers.findIndex(a => a.is_correct);
      
      return {
        id: q.id.toString(),
        text: q.question,
        options,
        correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0
      };
    });
  };

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
        if (quizData.cour_id) {
          const courseResponse = await axios.get(`http://localhost:8000/api/courses/${quizData.cour_id}`, {
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

  const handleQuizComplete = (score: number, total: number) => {
    // Simuler un appel API pour enregistrer les résultats du quiz
    console.log(`Quiz completed with score ${score}/${total}`);
    
    // Si l'utilisateur a réussi le quiz (score >= 70%), rediriger vers la page du certificat
    if (score / total >= 0.7) {
      // Dans un vrai scénario, vous récupéreriez l'ID du certificat depuis votre backend
      const certificateId = `cert-${Math.random().toString(36).substring(2, 10)}`;
      navigate(`/certificate/${course?.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Chargement du quiz...</h2>
          <p className="text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Erreur</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!quiz || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quiz non trouvé</h2>
          <p className="text-gray-500">Le quiz que vous recherchez n'existe pas.</p>
        </div>
      </div>
    );
  }

  const transformedQuestions = transformQuestions(quiz.questions);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{quiz.description}</h1>
            <p className="text-gray-600">
              Cours: {course.name} | {quiz.questions.length} questions
            </p>
          </div>
          
          <QuizComponent 
            questions={transformedQuestions} 
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
