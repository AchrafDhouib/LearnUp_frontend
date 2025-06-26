
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Save, PenSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

interface Question {
  id: string;
  question: string;
  type: 'unique_choice' | 'multiple_choice';
  answers: Answer[];
}

interface Answer {
  id: string;
  answer: string;
  isCorrect: boolean;
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentTab, setCurrentTab] = useState("overview");
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);

  // Function to load teacher's courses
  const loadCourses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour accéder à cette page.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Filter courses created by the current teacher
      const teacherCourses = response.data.filter((course: any) => 
        course.creator_id === user.id
      );
      
      setAvailableCourses(teacherCourses);
    } catch (error) {
      console.error("Failed to load courses:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos cours.",
        variant: "destructive",
      });
    }
  };

  // Load courses when component mounts
  useState(() => {
    loadCourses();
  });

  // Add a new question
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      question: "",
      type: "unique_choice",
      answers: [
        { id: `a-${Date.now()}-1`, answer: "", isCorrect: false },
        { id: `a-${Date.now()}-2`, answer: "", isCorrect: false }
      ]
    };
    
    setQuestions([...questions, newQuestion]);
    setCurrentTab(newQuestion.id);
  };

  // Remove a question
  const removeQuestion = (questionId: string) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    
    if (currentTab === questionId) {
      setCurrentTab(updatedQuestions.length > 0 ? updatedQuestions[0].id : "overview");
    }
  };

  // Update question text
  const updateQuestionText = (questionId: string, text: string) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, question: text } : q
    );
    setQuestions(updatedQuestions);
  };

  // Update question type
  const updateQuestionType = (questionId: string, type: 'unique_choice' | 'multiple_choice') => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        // Reset correct answers if changing type
        const updatedAnswers = q.answers.map(a => ({
          ...a,
          isCorrect: false
        }));
        
        return { ...q, type, answers: updatedAnswers };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  // Add answer to question
  const addAnswer = (questionId: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        const newAnswer = {
          id: `a-${Date.now()}`,
          answer: "",
          isCorrect: false
        };
        return { ...q, answers: [...q.answers, newAnswer] };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  // Remove answer from question
  const removeAnswer = (questionId: string, answerId: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        const updatedAnswers = q.answers.filter(a => a.id !== answerId);
        return { ...q, answers: updatedAnswers };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  // Update answer text
  const updateAnswerText = (questionId: string, answerId: string, text: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        const updatedAnswers = q.answers.map(a => 
          a.id === answerId ? { ...a, answer: text } : a
        );
        return { ...q, answers: updatedAnswers };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  // Toggle answer correctness
  const toggleAnswerCorrectness = (questionId: string, answerId: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        if (q.type === 'unique_choice') {
          // For unique_choice, only one answer can be correct
          const updatedAnswers = q.answers.map(a => ({
            ...a,
            isCorrect: a.id === answerId
          }));
          return { ...q, answers: updatedAnswers };
        } else {
          // For multiple_choice, toggle the selected answer
          const updatedAnswers = q.answers.map(a => 
            a.id === answerId ? { ...a, isCorrect: !a.isCorrect } : a
          );
          return { ...q, answers: updatedAnswers };
        }
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  // Save quiz
  const handleSubmit = async () => {
    if (!selectedCourse) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un cours.",
        variant: "destructive",
      });
      return;
    }

    if (!quizTitle || !quizDescription) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins une question.",
        variant: "destructive",
      });
      return;
    }

    // Check that all questions have a valid configuration
    for (const question of questions) {
      if (!question.question.trim()) {
        toast({
          title: "Erreur",
          description: "Toutes les questions doivent avoir un énoncé.",
          variant: "destructive",
        });
        return;
      }

      if (question.answers.length < 2) {
        toast({
          title: "Erreur",
          description: "Chaque question doit avoir au moins deux réponses.",
          variant: "destructive",
        });
        return;
      }

      const hasCorrectAnswer = question.answers.some(a => a.isCorrect);
      if (!hasCorrectAnswer) {
        toast({
          title: "Erreur",
          description: "Chaque question doit avoir au moins une réponse correcte.",
          variant: "destructive",
        });
        return;
      }

      for (const answer of question.answers) {
        if (!answer.answer.trim()) {
          toast({
            title: "Erreur",
            description: "Toutes les réponses doivent avoir un texte.",
            variant: "destructive",
          });
          return;
        }
      }
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      // First create the exam
      const examResponse = await axios.post('http://localhost:8000/api/exams', {
        description: quizDescription,
        cour_id: selectedCourse,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const examId = examResponse.data.id;
      
      // Create all questions for the exam
      for (const question of questions) {
        const questionResponse = await axios.post('http://localhost:8000/api/questions', {
          exams_id: examId,
          question: question.question,
          type: question.type,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const questionId = questionResponse.data.id;
        
        // Create all answers for the question
        for (const answer of question.answers) {
          await axios.post('http://localhost:8000/api/answers', {
            question_id: questionId,
            answer: answer.answer,
            is_correct: answer.isCorrect,
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      }
      
      toast({
        title: "Quiz créé avec succès",
        description: "Votre quiz a été enregistré.",
      });
      
      navigate('/teacher/quizzes');
    } catch (error) {
      console.error("Failed to create quiz:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le quiz. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Créer un nouveau quiz</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/teacher/quizzes')} variant="outline">
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary-dark">
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Enregistrement..." : "Enregistrer le quiz"}
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              {questions.map((q, index) => (
                <TabsTrigger key={q.id} value={q.id}>
                  Question {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button onClick={addQuestion} size="sm" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une question
            </Button>
          </div>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Détails du quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Cours</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCourses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du quiz</Label>
                  <Input
                    id="title"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Entrez le titre du quiz"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    placeholder="Décrivez l'objectif de ce quiz"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Le quiz comprend actuellement {questions.length} question(s).
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {questions.map((question, index) => (
            <TabsContent key={question.id} value={question.id} className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Question {index + 1}</CardTitle>
                  <Button 
                    onClick={() => removeQuestion(question.id)}
                    variant="destructive" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer cette question
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${question.id}`}>Énoncé de la question</Label>
                    <Textarea
                      id={`question-${question.id}`}
                      value={question.question}
                      onChange={(e) => updateQuestionText(question.id, e.target.value)}
                      placeholder="Entrez la question ici"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type de question</Label>
                    <RadioGroup 
                      value={question.type} 
                      onValueChange={(value: 'unique_choice' | 'multiple_choice') => 
                        updateQuestionType(question.id, value)
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unique_choice" id={`unique-${question.id}`} />
                        <Label htmlFor={`unique-${question.id}`}>Choix unique</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="multiple_choice" id={`multiple-${question.id}`} />
                        <Label htmlFor={`multiple-${question.id}`}>Choix multiples</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Réponses</Label>
                      <Button 
                        onClick={() => addAnswer(question.id)}
                        size="sm" 
                        variant="outline"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Ajouter une réponse
                      </Button>
                    </div>
                    
                    <div className="space-y-2 mt-2">
                      {question.answers.map((answer, aIndex) => (
                        <div key={answer.id} className="flex items-center gap-2">
                          {question.type === 'unique_choice' ? (
                            <RadioGroup 
                              value={answer.isCorrect ? answer.id : ''}
                              onValueChange={() => toggleAnswerCorrectness(question.id, answer.id)}
                              className="flex"
                            >
                              <RadioGroupItem value={answer.id} id={answer.id} />
                            </RadioGroup>
                          ) : (
                            <Checkbox 
                              checked={answer.isCorrect}
                              onCheckedChange={() => toggleAnswerCorrectness(question.id, answer.id)}
                              id={answer.id}
                            />
                          )}
                          
                          <div className="flex-1">
                            <Input
                              value={answer.answer}
                              onChange={(e) => updateAnswerText(question.id, answer.id, e.target.value)}
                              placeholder={`Réponse ${aIndex + 1}`}
                            />
                          </div>
                          
                          {question.answers.length > 2 && (
                            <Button 
                              onClick={() => removeAnswer(question.id, answer.id)}
                              size="sm" 
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CreateQuiz;