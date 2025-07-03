
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Trophy, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyCourses } from "@/services/studentCourseService";
import { getPassedExams } from "@/services/passedExamService";

const StudentQuizzes = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Get enrolled courses with exams
  const { data: enrolledCourses } = useQuery({
    queryKey: ['student-courses'],
    queryFn: getMyCourses
  });

  // Get passed exams
  const { data: passedExams } = useQuery({
    queryKey: ['passed-exams'],
    queryFn: getPassedExams
  });

  // Filter courses that have exams
  const coursesWithExams = enrolledCourses?.filter(course => course.exam) || [];
  
  // Separate quizzes by status
  const pendingQuizzes = coursesWithExams.filter(course => 
    !passedExams?.some(passed => passed.exam_id === course.exam?.id)
  );
  
  const completedQuizzes = coursesWithExams
    .map(course => {
      const passedExam = passedExams?.find(passed => passed.exam_id === course.exam?.id);
      if (passedExam && passedExam.score >= (course.required_score || 70)) {
        return { ...course, passedExam };
      }
      return null;
    })
    .filter(Boolean);
  
  const failedQuizzes = coursesWithExams
    .map(course => {
      const passedExam = passedExams?.find(passed => passed.exam_id === course.exam?.id);
      if (passedExam && passedExam.score < (course.required_score || 70)) {
        return { ...course, passedExam };
      }
      return null;
    })
    .filter(Boolean);

  const filteredPendingQuizzes = pendingQuizzes.filter(quiz => 
    quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCompletedQuizzes = completedQuizzes.filter(quiz => 
    quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFailedQuizzes = failedQuizzes.filter(quiz => 
    quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



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
            <TabsTrigger value="failed">À repasser</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {filteredPendingQuizzes.length > 0 ? (
              <div className="space-y-4">
                {filteredPendingQuizzes.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{course.exam?.title || 'Quiz Final'}</h3>
                            <Badge variant="secondary">À réaliser</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Cours: {course.name}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center text-sm text-gray-500">
                              <FileText className="h-4 w-4 mr-1" />
                              {course.exam?.questions?.length || 0} questions
                            </span>
                            <span className="flex items-center text-sm text-amber-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.exam?.duration || 30} min
                            </span>
                          </div>
                        </div>
                        <Link to={`/student/pass-quiz/${course.id}`}>
                          <Button>Commencer le quiz</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
            {filteredCompletedQuizzes.length > 0 ? (
              <div className="space-y-4">
                {filteredCompletedQuizzes.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{course.exam?.title || 'Quiz Final'}</h3>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Complété
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Cours: {course.name}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center text-sm text-gray-500">
                              <FileText className="h-4 w-4 mr-1" />
                              {course.exam?.questions?.length || 0} questions
                            </span>
                            <span className="flex items-center text-sm text-green-600">
                              <Trophy className="h-4 w-4 mr-1" />
                              Score: {course.passedExam?.score || 0}%
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {course.passedExam && (
                            <Link to={`/student/exam-result/${course.passedExam.id}`}>
                              <Button variant="outline">Voir résultats</Button>
                            </Link>
                          )}
                          <Link to={`/student/pass-quiz/${course.id}`}>
                            <Button variant="outline">Repasser</Button>
                          </Link>
                          {course.passedExam?.certification && (
                            <Link to={`/student/certificate/${course.passedExam.certification.id}`}>
                              <Button>Voir certificat</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
          
          <TabsContent value="failed">
            {filteredFailedQuizzes.length > 0 ? (
              <div className="space-y-4">
                {filteredFailedQuizzes.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{course.exam?.title || 'Quiz Final'}</h3>
                            <Badge variant="destructive">À repasser</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Cours: {course.name}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center text-sm text-gray-500">
                              <FileText className="h-4 w-4 mr-1" />
                              {course.exam?.questions?.length || 0} questions
                            </span>
                            <span className="flex items-center text-sm text-red-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Score: {course.passedExam?.score || 0}% (Requis: {course.required_score || 70}%)
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {course.passedExam && (
                            <Link to={`/student/exam-result/${course.passedExam.id}`}>
                              <Button variant="outline">Voir résultats</Button>
                            </Link>
                          )}
                          <Link to={`/student/pass-quiz/${course.id}`}>
                            <Button variant="destructive">Repasser le quiz</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <AlertTriangle className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">
                    {searchQuery ? "Aucun quiz trouvé" : "Aucun quiz à repasser"}
                  </h3>
                  <p className="text-gray-500 text-center mt-2">
                    {searchQuery 
                      ? `Aucun quiz ne correspond à "${searchQuery}"`
                      : "Vous n'avez pas de quiz à repasser pour le moment"
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
