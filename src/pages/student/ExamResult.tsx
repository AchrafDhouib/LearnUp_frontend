import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Trophy,
  Clock,
  FileText
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getPassedExam } from "@/services/passedExamService";
import { getUserAnswers } from "@/services/userAnswerService";
import DashboardLayout from "@/components/DashboardLayout";

interface UserAnswer {
  id: number;
  question_id: number;
  answer_id: number;
  question: {
    id: number;
    question: string;
    type: 'multiple_choice' | 'unique_choice';
    answers: {
      id: number;
      answer: string;
      is_correct: boolean;
    }[];
  };
  answer: {
    id: number;
    answer: string;
    is_correct: boolean;
  };
}

interface PassedExam {
  id: number;
  score: number;
  passed_at: string;
  exam: {
    id: number;
    title: string;
    description: string;
    duration: number;
    course: {
      id: number;
      name: string;
      required_score: number;
    };
  };
}

const ExamResult = () => {
  const { passedExamId } = useParams<{ passedExamId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get passed exam data
  const { data: passedExam } = useQuery({
    queryKey: ['passed-exam', passedExamId],
    queryFn: () => passedExamId ? getPassedExam(parseInt(passedExamId)) : null,
    enabled: !!passedExamId
  });

  // Get user answers for this exam
  const { data: userAnswers } = useQuery({
    queryKey: ['user-answers', passedExamId],
    queryFn: () => passedExamId ? getUserAnswers(parseInt(passedExamId)) : null,
    enabled: !!passedExamId
  });

  if (!passedExam || !userAnswers) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Chargement des résultats...</h2>
            <p className="text-gray-500">Veuillez patienter</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Add debugging
  console.log('PassedExam data:', passedExam);
  console.log('UserAnswers data:', userAnswers);

  // Check if required data exists
  if (!passedExam.exam || !passedExam.exam.course) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Erreur de données</h2>
            <p className="text-gray-500">Les données du quiz ne sont pas disponibles</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isPassed = passedExam.score >= (passedExam.exam.course.required_score || 70);
  const totalQuestions = userAnswers.length;
  const correctAnswers = userAnswers.filter(ua => ua.answer && ua.answer.is_correct).length;

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/student/quizzes')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux quiz
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Résultats du Quiz</h1>
              <p className="text-gray-500">{passedExam.exam.course.name}</p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              {isPassed ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <XCircle className="h-8 w-8 text-red-500" />
              )}
              <span>{isPassed ? "Quiz Réussi!" : "Quiz Échoué"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {Math.round(passedExam.score)}%
              </div>
              <p className="text-gray-500">
                Score requis: {passedExam.exam.course.required_score || 70}%
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
                <div className="text-sm text-gray-500">Questions totales</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-500">Réponses correctes</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500">
                Complété le {new Date(passedExam.passed_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions and Answers */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Détail des réponses</h2>
          
          {userAnswers.map((userAnswer, index) => {
            // Skip if question or answer data is missing
            if (!userAnswer.question || !userAnswer.answer) {
              return null;
            }
            
            return (
              <Card key={userAnswer.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Question */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium">
                          Question {index + 1}
                        </h3>
                        <Badge variant={userAnswer.answer.is_correct ? "default" : "destructive"}>
                          {userAnswer.answer.is_correct ? "Correct" : "Incorrect"}
                        </Badge>
                      </div>
                      <p className="text-gray-700">{userAnswer.question.question}</p>
                    </div>

                  {/* Answers */}
                  <div className="space-y-2">
                    {userAnswer.question.answers && userAnswer.question.answers.map((answer) => {
                      const isSelected = answer.id === userAnswer.answer_id;
                      const isCorrect = answer.is_correct;
                      
                      let bgColor = "bg-white";
                      let borderColor = "border-gray-200";
                      let textColor = "text-gray-700";
                      
                      if (isSelected && isCorrect) {
                        bgColor = "bg-green-50";
                        borderColor = "border-green-200";
                        textColor = "text-green-800";
                      } else if (isSelected && !isCorrect) {
                        bgColor = "bg-red-50";
                        borderColor = "border-red-200";
                        textColor = "text-red-800";
                      } else if (!isSelected && isCorrect) {
                        bgColor = "bg-green-50";
                        borderColor = "border-green-200";
                        textColor = "text-green-800";
                      }
                      
                      return (
                        <div
                          key={answer.id}
                          className={`p-3 border rounded-lg ${bgColor} ${borderColor} ${textColor}`}
                        >
                          <div className="flex items-center space-x-3">
                            {isSelected ? (
                              isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )
                            ) : isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                            )}
                            <span className="flex-1">{answer.answer}</span>
                            {isSelected && (
                              <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs">
                                {isCorrect ? "Votre réponse" : "Votre réponse"}
                              </Badge>
                            )}
                            {!isSelected && isCorrect && (
                              <Badge variant="default" className="text-xs bg-green-500">
                                Réponse correcte
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamResult; 