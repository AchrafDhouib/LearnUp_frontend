
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Trophy, Clock } from "lucide-react";
import { quizzes, courses } from "@/data/mockData";
import { Link } from "react-router-dom";

const StudentQuizzes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [studentQuizzes] = useState([
    { ...quizzes[0], status: "completed", score: 85, completedAt: new Date(2023, 3, 15) },
    { ...quizzes[1], status: "pending", dueDate: new Date(2023, 4, 30) },
  ]);

  const filteredQuizzes = studentQuizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingQuizzes = filteredQuizzes.filter(quiz => quiz.status === "pending");
  const completedQuizzes = filteredQuizzes.filter(quiz => quiz.status === "completed");

  return (
    <DashboardLayout userType="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes quiz</h1>
          <p className="text-gray-500">Consultez vos quiz en attente et vos résultats.</p>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un quiz..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">À réaliser</TabsTrigger>
            <TabsTrigger value="completed">Complétés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {pendingQuizzes.length > 0 ? (
              <div className="space-y-4">
                {pendingQuizzes.map((quiz) => {
                  const relatedCourse = courses.find(c => c.id === quiz.courseId);
                  
                  return (
                    <Card key={quiz.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{quiz.title}</h3>
                              <Badge variant="secondary">À réaliser</Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Cours: {relatedCourse?.title}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center text-sm text-gray-500">
                                <FileText className="h-4 w-4 mr-1" />
                                {quiz.questions.length} questions
                              </span>
                              <span className="flex items-center text-sm text-amber-600">
                                <Clock className="h-4 w-4 mr-1" />
                                {quiz.dueDate.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Link to={`/quiz/${quiz.id}`}>
                            <Button>Commencer le quiz</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">
                    {searchQuery ? "Aucun quiz trouvé" : "Aucun quiz en attente"}
                  </h3>
                  <p className="text-gray-500 text-center mt-2">
                    {searchQuery 
                      ? `Aucun quiz ne correspond à "${searchQuery}"`
                      : "Vous n'avez pas de quiz à réaliser pour le moment"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedQuizzes.length > 0 ? (
              <div className="space-y-4">
                {completedQuizzes.map((quiz) => {
                  const relatedCourse = courses.find(c => c.id === quiz.courseId);
                  
                  return (
                    <Card key={quiz.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{quiz.title}</h3>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Complété
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Cours: {relatedCourse?.title}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center text-sm text-gray-500">
                                <FileText className="h-4 w-4 mr-1" />
                                {quiz.questions.length} questions
                              </span>
                              <span className="flex items-center text-sm text-green-600">
                                <Trophy className="h-4 w-4 mr-1" />
                                Score: {quiz.score}%
                              </span>
                            </div>
                          </div>
                          <Link to={`/quiz/${quiz.id}/results`}>
                            <Button variant="outline">Voir les résultats</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Trophy className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">
                    {searchQuery ? "Aucun quiz trouvé" : "Aucun quiz complété"}
                  </h3>
                  <p className="text-gray-500 text-center mt-2">
                    {searchQuery 
                      ? `Aucun quiz ne correspond à "${searchQuery}"`
                      : "Vous n'avez pas encore complété de quiz"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizzes;
