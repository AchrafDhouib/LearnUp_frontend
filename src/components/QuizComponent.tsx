
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizComponentProps {
  questions: Question[];
  onComplete: (score: number, total: number) => void;
}

const QuizComponent = ({ questions, onComplete }: QuizComponentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestion].id]: parseInt(value)
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setShowResults(true);
    onComplete(correctAnswers, questions.length);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Résultats du quiz</CardTitle>
          <CardDescription className="text-center">
            Vous avez obtenu {score} sur {questions.length} questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6">
            {score / questions.length >= 0.7 ? (
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
            {questions.map((question, index) => (
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
          <Button onClick={resetQuiz} variant="outline">Recommencer</Button>
          {score / questions.length >= 0.7 && (
            <Button className="bg-primary hover:bg-primary-dark">
              Obtenir le certificat
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestionData.id] !== undefined;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Question {currentQuestion + 1} sur {questions.length}</CardTitle>
        <CardDescription>
          Sélectionnez la bonne réponse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQuestionData.text}</h3>
          <RadioGroup 
            value={selectedAnswers[currentQuestionData.id]?.toString() || ""} 
            onValueChange={handleAnswer}
          >
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-md border hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={handlePrevious} 
          variant="outline" 
          disabled={currentQuestion === 0}
        >
          Précédent
        </Button>
        <div className="text-sm text-gray-500">
          {currentQuestion + 1} / {questions.length}
        </div>
        <Button 
          onClick={handleNext} 
          disabled={!isAnswered}
          className={isAnswered ? "bg-primary hover:bg-primary-dark" : ""}
        >
          {currentQuestion === questions.length - 1 ? "Terminer" : "Suivant"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizComponent;
