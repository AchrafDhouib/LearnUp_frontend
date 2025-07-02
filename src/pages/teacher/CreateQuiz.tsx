import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  const { id: quizId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const courseIdFromQuery = searchParams.get('courseId');
  
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courseIdFromQuery || "");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentTab, setCurrentTab] = useState("overview");
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(!!quizId);

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
      let teacherCourses = response.data.filter((course: any) => 
        course.creator_id === user.id
      );

      // If not in edit mode, filter out courses that already have quizzes
      if (!isEditMode) {
        teacherCourses = teacherCourses.filter((course: any) => !course.exam);
      } else {
        // In edit mode, include the current course but exclude other courses with exams
        teacherCourses = teacherCourses.filter((course: any) => {
          // Include courses without exams
          if (!course.exam) return true;
          // Include the current course (even if it has an exam)
          if (quizId && course.exam && course.exam.id === parseInt(quizId)) return true;
          // Exclude other courses with exams
          return false;
        });
      }
      
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

  // Function to load existing quiz data when in edit mode
  const loadQuizData = async () => {
    if (!quizId) return;
    
    try {
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

      const response = await axios.get(`http://localhost:8000/api/exams/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const quizData = response.data;
      console.log("Quiz data loaded:", quizData); // Debug log
      
      setQuizTitle(quizData.title || "");
      setQuizDescription(quizData.description || "");
      setSelectedCourse(quizData.cours_id?.toString() || "");
      
      // Load questions if they exist
      if (quizData.questions && quizData.questions.length > 0) {
        const formattedQuestions = quizData.questions.map((q: any) => ({
          id: q.id.toString(), // Use actual database ID
          question: q.question,
          type: q.type || 'unique_choice',
          answers: q.answers?.map((a: any) => ({
            id: a.id.toString(), // Use actual database ID
            answer: a.answer,
            isCorrect: a.is_correct || false
          })) || []
        }));
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error("Failed to load quiz data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du quiz.",
        variant: "destructive",
      });
    }
  };

  // Load courses and quiz data when component mounts
  useEffect(() => {
    loadCourses();
    if (isEditMode) {
      loadQuizData();
    }
  }, [isEditMode, quizId]);

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
      
      if (isEditMode && quizId) {
        // Update existing exam metadata
        await axios.put(`http://localhost:8000/api/exams/${quizId}`, {
          title: quizTitle,
          description: quizDescription,
          cours_id: selectedCourse,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Get existing questions to compare with current questions
        const existingQuestionsResponse = await axios.get(`http://localhost:8000/api/exams/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const existingQuestions = existingQuestionsResponse.data.questions || [];

        // Process each question
        for (const question of questions) {
          console.log(`Processing question: ${question.id}`, question); // Debug log
          
          if (question.id.startsWith('q-')) {
            // This is a new question (frontend-generated ID)
            console.log(`Creating new question: ${question.question}`); // Debug log
            const questionResponse = await axios.post('http://localhost:8000/api/questions', {
              exams_id: quizId,
              question: question.question,
              type: question.type,
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            const questionId = questionResponse.data.id;
            console.log(`Created question with ID: ${questionId}`); // Debug log
            
            // Create all answers for the new question
            for (const answer of question.answers) {
              console.log(`Creating answer: ${answer.answer}`); // Debug log
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
          } else {
            // This is an existing question (has numeric ID)
            const questionId = parseInt(question.id);
            const existingQuestion = existingQuestions.find((q: any) => q.id === questionId);
            
            if (existingQuestion) {
              console.log(`Updating existing question: ${questionId}`); // Debug log
              // Update the question
              await axios.put(`http://localhost:8000/api/questions/${questionId}`, {
                question: question.question,
                type: question.type,
              }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });

              // Get existing answers for this question
              const existingAnswers = existingQuestion.answers || [];
              
              // Process each answer
              for (const answer of question.answers) {
                if (answer.id.startsWith('a-')) {
                  // This is a new answer (frontend-generated ID)
                  console.log(`Creating new answer: ${answer.answer}`); // Debug log
                  await axios.post('http://localhost:8000/api/answers', {
                    question_id: questionId,
                    answer: answer.answer,
                    is_correct: answer.isCorrect,
                  }, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                } else {
                  // This is an existing answer (has numeric ID)
                  const answerId = parseInt(answer.id);
                  console.log(`Updating existing answer: ${answerId}`); // Debug log
                  await axios.put(`http://localhost:8000/api/answers/${answerId}`, {
                    answer: answer.answer,
                    is_correct: answer.isCorrect,
                  }, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                }
              }

              // Delete answers that were removed
              const currentAnswerIds = question.answers.map(a => a.id.startsWith('a-') ? null : parseInt(a.id)).filter(id => id !== null);
              for (const existingAnswer of existingAnswers) {
                if (!currentAnswerIds.includes(existingAnswer.id)) {
                  console.log(`Deleting answer: ${existingAnswer.id}`); // Debug log
                  await axios.delete(`http://localhost:8000/api/answers/${existingAnswer.id}`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                }
              }
            }
          }
        }

        // Delete questions that were removed
        const currentQuestionIds = questions.map(q => q.id.startsWith('q-') ? null : parseInt(q.id)).filter(id => id !== null);
        for (const existingQuestion of existingQuestions) {
          if (!currentQuestionIds.includes(existingQuestion.id)) {
            await axios.delete(`http://localhost:8000/api/questions/${existingQuestion.id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          }
        }
        
        toast({
          title: "Quiz mis à jour avec succès",
          description: "Votre quiz a été modifié.",
        });
      } else {
        // Create new exam
        const examResponse = await axios.post('http://localhost:8000/api/exams', {
          title: quizTitle,
          description: quizDescription,
          cours_id: selectedCourse,
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
      }
      
      navigate('/teacher/quizzes');
    } catch (error) {
      console.error("Failed to save quiz:", error);
      toast({
        title: "Erreur",
        description: `Impossible de ${isEditMode ? 'mettre à jour' : 'créer'} le quiz. Veuillez réessayer.`,
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
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Modifier le quiz" : "Créer un nouveau quiz"}
          </h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/teacher/quizzes')} variant="outline">
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary-dark">
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Enregistrement..." : (isEditMode ? "Mettre à jour le quiz" : "Enregistrer le quiz")}
            </Button>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-full sm:w-auto overflow-x-auto">
                <TabsList className="flex-nowrap min-w-max">
                  <TabsTrigger value="overview" className="whitespace-nowrap">Vue d'ensemble</TabsTrigger>
                  {questions.map((q, index) => (
                    <TabsTrigger key={q.id} value={q.id} className="whitespace-nowrap">
                      Q{index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {questions.length > 0 && (
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {questions.length} question{questions.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
            <Button onClick={addQuestion} size="sm" variant="outline" className="shrink-0">
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
                  <Select 
                    value={selectedCourse} 
                    onValueChange={setSelectedCourse}
                    disabled={!!courseIdFromQuery}
                  >
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
                  {courseIdFromQuery && (
                    <p className="text-sm text-gray-500">
                      Cours pré-sélectionné depuis la page d'édition du cours
                    </p>
                  )}
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