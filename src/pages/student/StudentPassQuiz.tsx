import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Timer
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourse } from "@/services/courseService";
import { getExam } from "@/services/examService";
import { createUserAnswer } from "@/services/userAnswerService";
import { createPassedExam } from "@/services/passedExamService";
import DashboardLayout from "@/components/DashboardLayout";

interface Question {
  id: number;
  question: string;
  type: 'multiple_choice' | 'unique_choice';
  answers: Answer[];
}

interface Answer {
  id: number;
  answer: string;
  is_correct: boolean;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

interface UserAnswer {
  question_id: number;
  answer_id: number;
}

const StudentPassQuiz = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number | number[] }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  // Get course and exam data
  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseId ? getCourse(courseId) : null,
    enabled: !!courseId
  });

  const { data: exam } = useQuery({
    queryKey: ['exam', course?.exam?.id],
    queryFn: () => course?.exam?.id ? getExam(course.exam.id) : null,
    enabled: !!course?.exam?.id
  });



  // Error handling for missing exam data
  useEffect(() => {
    if (course && !course.exam) {
      toast({
        title: "Erreur",
        description: "Ce cours n'a pas d'examen associé",
        variant: "destructive",
      });
      navigate(`/student/courses/${courseId}`);
    }
  }, [course, courseId, navigate, toast]);

  // Submit answers mutation
  const submitAnswersMutation = useMutation({
    mutationFn: async (answers: UserAnswer[]) => {
      // Calculate score first
      let totalScore = 0;
      const questionScores: { [key: number]: number } = {};
      
      exam?.questions?.forEach(question => {
        const questionAnswers = answers.filter(a => a.question_id === question.id);
        const correctAnswers = question.answers.filter(a => a.is_correct);
        const selectedCorrectAnswers = questionAnswers.filter(answer => {
          const selectedAnswer = question.answers.find(a => a.id === answer.answer_id);
          return selectedAnswer?.is_correct;
        });
        
        if (question.type === 'multiple_choice') {
          // For multiple choice, score is 1 if all correct answers are selected and no incorrect ones
          const allCorrectSelected = correctAnswers.length === selectedCorrectAnswers.length;
          const noIncorrectSelected = questionAnswers.length === selectedCorrectAnswers.length;
          questionScores[question.id] = (allCorrectSelected && noIncorrectSelected) ? 1 : 0;
        } else {
          // For single choice, score is 1 if the correct answer is selected
          questionScores[question.id] = selectedCorrectAnswers.length > 0 ? 1 : 0;
        }
        
        totalScore += questionScores[question.id];
      });

      const calculatedScore = exam?.questions ? (totalScore / exam.questions.length) * 100 : 0;
      
      // Create passed exam record first
      const passedExamData = {
        exam_id: exam?.id || 0,
        score: Math.round(calculatedScore)
      };

      const passedExam = await createPassedExam(passedExamData);
      
      // Save user answers with the passed_exam_id
      for (const answer of answers) {
        await createUserAnswer({
          question_id: answer.question_id,
          answer_id: answer.answer_id,
          passed_exam_id: passedExam.id
        });
      }
      
      return {
        score: calculatedScore,
        passed: calculatedScore >= (course?.required_score || 70),
        passedExam
      };
    },
    onSuccess: (data) => {
      setScore(data.score);
      setPassed(data.passed);
      setShowResults(true);
      setIsSubmitting(false);
      
      toast({
        title: data.passed ? "Félicitations!" : "Quiz terminé",
        description: data.passed 
          ? `Vous avez réussi avec un score de ${Math.round(data.score)}%!`
          : `Score: ${Math.round(data.score)}%. Score requis: ${course?.required_score || 70}%`,
        variant: data.passed ? "default" : "destructive"
      });
    },
    onError: (error: any) => {
      setIsSubmitting(false);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de soumettre le quiz",
        variant: "destructive",
      });
    },
  });

  // Initialize timer when exam loads
  useEffect(() => {
    if (exam?.duration && timeLeft === 0) {
      setTimeLeft(exam.duration * 60); // Convert minutes to seconds
    } else if (exam && !exam.duration && timeLeft === 0) {
      // Default to 30 minutes if no duration is set
      setTimeLeft(30 * 60);
    }
  }, [exam?.duration, timeLeft]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    const currentQuestion = exam?.questions?.find(q => q.id === questionId);
    
    if (currentQuestion?.type === 'multiple_choice') {
      // For multiple choice, toggle the answer in an array
      setUserAnswers(prev => {
        const currentAnswers = Array.isArray(prev[questionId]) ? prev[questionId] as number[] : [];
        const newAnswers = currentAnswers.includes(answerId)
          ? currentAnswers.filter(id => id !== answerId)
          : [...currentAnswers, answerId];
        
        return {
          ...prev,
          [questionId]: newAnswers
        };
      });
    } else {
      // For unique choice, replace the answer
      setUserAnswers(prev => ({
        ...prev,
        [questionId]: answerId
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < (exam?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!exam?.questions) return;

    const answers: UserAnswer[] = [];
    
    Object.entries(userAnswers).forEach(([questionId, answerValue]) => {
      if (Array.isArray(answerValue)) {
        // Multiple choice - create an answer for each selected option
        answerValue.forEach(answerId => {
          answers.push({
            question_id: parseInt(questionId),
            answer_id: answerId
          });
        });
      } else {
        // Single choice
        answers.push({
          question_id: parseInt(questionId),
          answer_id: answerValue
        });
      }
    });

    setIsSubmitting(true);
    submitAnswersMutation.mutate(answers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = exam?.questions?.[currentQuestionIndex];
  const totalQuestions = exam?.questions?.length || 0;
  const answeredQuestions = Object.keys(userAnswers).length;
  const progress = (currentQuestionIndex + 1) / totalQuestions * 100;

  if (!course || !exam) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Chargement du quiz...</h2>
            <p className="text-gray-500">Veuillez patienter</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!exam.questions || exam.questions.length === 0) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Aucune question disponible</h2>
            <p className="text-gray-500">Cet examen n'a pas encore de questions</p>
            <Button 
              className="mt-4"
              onClick={() => navigate(`/student/courses/${courseId}`)}
            >
              Retour au cours
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (showResults) {
    return (
      <DashboardLayout userType="student">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/student/courses/${courseId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au cours
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Résultats du Quiz</h1>
                <p className="text-gray-500">{course.name}</p>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                {passed ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
                <span>{passed ? "Quiz Réussi!" : "Quiz Échoué"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {Math.round(score)}%
                </div>
                <p className="text-gray-500">
                  Score requis: {course.required_score || 70}%
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Questions répondues:</span>
                  <span>{answeredQuestions} / {totalQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Score obtenu:</span>
                  <span>{Math.round(score)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Score requis:</span>
                  <span>{course.required_score || 70}%</span>
                </div>
              </div>

              {passed && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-800">
                      Félicitations! Vous avez obtenu votre certification.
                    </span>
                  </div>
                  <p className="text-green-600 text-sm mt-2">
                    Votre certificat est maintenant disponible dans la section "Mes Certifications".
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <Button 
                  onClick={() => navigate(`/student/courses/${courseId}`)}
                  className="flex-1"
                >
                  Retour au cours
                </Button>
                {passed && (
                  <Button 
                    onClick={() => navigate('/student/certificates')}
                    variant="outline"
                    className="flex-1"
                  >
                    Voir mes certifications
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/student/courses/${courseId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au cours
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{exam.title}</h1>
              <p className="text-gray-500">{course.name}</p>
            </div>
          </div>
          
          {/* Timer */}
          <div className="flex items-center space-x-2">
            <Timer className="h-5 w-5 text-red-500" />
            <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-500' : 'text-gray-700'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Question {currentQuestionIndex + 1} sur {totalQuestions}</span>
            <span>{answeredQuestions} répondues</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Question */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Question {currentQuestionIndex + 1}
                  </h3>
                  <Badge variant={currentQuestion?.type === 'multiple_choice' ? 'secondary' : 'default'}>
                    {currentQuestion?.type === 'multiple_choice' ? 'Choix multiples' : 'Choix unique'}
                  </Badge>
                </div>
                <p className="text-gray-700">{currentQuestion?.question}</p>
              </div>

              {/* Answers */}
              {currentQuestion?.type === 'multiple_choice' ? (
                <div className="space-y-3">
                  {currentQuestion?.answers?.map((answer) => {
                    const questionId = currentQuestion?.id || 0;
                    const currentAnswers = userAnswers[questionId];
                    const isSelected = Array.isArray(currentAnswers) && currentAnswers.includes(answer.id);

                    return (
                      <div key={answer.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={`answer-${answer.id}`}
                          checked={isSelected}
                          onCheckedChange={() => handleAnswerSelect(questionId, answer.id)}
                        />
                        <Label 
                          htmlFor={`answer-${answer.id}`}
                          className="flex-1 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {answer.answer}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <RadioGroup
                  value={userAnswers[currentQuestion?.id || 0]?.toString() || ""}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion?.id || 0, parseInt(value))}
                >
                  <div className="space-y-3">
                    {currentQuestion?.answers?.map((answer) => (
                      <div key={answer.id} className="flex items-center space-x-3">
                        <RadioGroupItem value={answer.id.toString()} id={`answer-${answer.id}`} />
                        <Label 
                          htmlFor={`answer-${answer.id}`}
                          className="flex-1 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {answer.answer}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Précédent
                </Button>

                <div className="flex space-x-2">
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <Button onClick={handleNext}>
                      Suivant
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting || answeredQuestions < totalQuestions}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? "Soumission..." : "Terminer le Quiz"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Warning if not all questions answered */}
              {answeredQuestions < totalQuestions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-800">
                      {totalQuestions - answeredQuestions} question(s) non répondue(s)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentPassQuiz; 