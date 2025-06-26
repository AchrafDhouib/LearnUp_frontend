
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import QuizComponent from "@/components/QuizComponent";
import { getQuizById, getCourseById } from "@/data/mockData";
import { Quiz, Course } from "@/data/mockData";

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Simuler un appel API pour récupérer les données du quiz
      const fetchedQuiz = getQuizById(id);
      
      if (fetchedQuiz) {
        setQuiz(fetchedQuiz);
        
        // Récupérer les informations du cours associé
        const fetchedCourse = getCourseById(fetchedQuiz.courseId);
        if (fetchedCourse) {
          setCourse(fetchedCourse);
        }
      }
      
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-gray-600">
              Cours: {course.title} | {quiz.questions.length} questions
            </p>
          </div>
          
          <QuizComponent 
            questions={quiz.questions} 
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
