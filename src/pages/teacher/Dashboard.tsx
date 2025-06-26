
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import CourseCard from "@/components/CourseCard";
import { Users, BookOpen, FileText, BarChart, PlusCircle, PenSquare, Trash2 } from "lucide-react";
import { courses, quizzes } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";

const TeacherDashboard = () => {
  const { user } = useAuth();
  
  // Dans un vrai scénario, ces données viendraient de votre backend Laravel
  const [teacherCourses] = useState(courses.slice(0, 3));
  const [teacherQuizzes] = useState(quizzes.slice(0, 2));
  const [students, setStudents] = useState([
    { id: 1, name: "Jean Dupont", email: "jean.dupont@example.com", course: "Introduction au développement web moderne", progress: 80 },
    { id: 2, name: "Marie Martin", email: "marie.martin@example.com", course: "Introduction au développement web moderne", progress: 65 },
    { id: 3, name: "Paul Bernard", email: "paul.bernard@example.com", course: "React.js pour les débutants", progress: 42 },
    { id: 4, name: "Sophie Laurent", email: "sophie.laurent@example.com", course: "React.js pour les débutants", progress: 90 },
    { id: 5, name: "Thomas Petit", email: "thomas.petit@example.com", course: "Introduction au développement web moderne", progress: 25 },
  ]);
  
  // Statistiques de l'enseignant
  const stats = [
    { 
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: "Cours publiés", 
      value: teacherCourses.length 
    },
    { 
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      title: "Quiz créés", 
      value: teacherQuizzes.length 
    },
    { 
      icon: <Users className="h-5 w-5 text-blue-500" />,
      title: "Étudiants", 
      value: students.length 
    },
    { 
      icon: <BarChart className="h-5 w-5 text-green-500" />,
      title: "Taux de réussite", 
      value: "87%" 
    },
  ];

  // Fonction pour voir les détails d'un étudiant
  const handleViewStudentDetails = (studentId: number) => {
    console.log(`Affichage des détails pour l'étudiant ID: ${studentId}`);
    // Dans une application réelle, on récupérerait les détails de l'étudiant via une API
    // et on pourrait ouvrir un modal ou naviguer vers une page de détails
    alert(`Détails de l'étudiant ID: ${studentId}`);
  };

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bienvenue, {user ? (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.name) : 'Enseignant'}
            </h1>
            <p className="text-gray-500">Gérez vos cours, quiz et suivez vos étudiants.</p>
          </div>
          <Link to="/teacher/create-course">
            <Button className="bg-primary hover:bg-primary-dark">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouveau cours
            </Button>
          </Link>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center pt-6">
                <div className="mr-4 p-2 rounded-full bg-gray-100">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Tabs de contenu */}
        <Tabs defaultValue="courses">
          <TabsList className="mb-4">
            <TabsTrigger value="courses">Mes cours</TabsTrigger>
            <TabsTrigger value="quizzes">Mes quiz</TabsTrigger>
            <TabsTrigger value="students">Mes étudiants</TabsTrigger>
          </TabsList>
          
          {/* Contenu des onglets */}
          <TabsContent value="courses" className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Vos cours publiés</h2>
                <Link to="/teacher/courses">
                  <Button variant="outline">Voir tout</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacherCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quizzes" className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Vos quiz</h2>
                <Link to="/teacher/create-quiz">
                  <Button className="bg-primary hover:bg-primary-dark">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nouveau quiz
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {teacherQuizzes.map((quiz) => {
                  const relatedCourse = courses.find(c => c.id === quiz.courseId);
                  return (
                    <Card key={quiz.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{quiz.title}</h3>
                            <p className="text-sm text-gray-500">
                              Cours: {relatedCourse?.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {quiz.questions.length} questions
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Link to={`/teacher/quizzes/${quiz.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <PenSquare className="h-4 w-4 mr-2" />
                                Modifier
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => {
                                if (window.confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) {
                                  console.log(`Suppression du quiz ${quiz.id}`);
                                  // Ici, vous appelleriez votre API pour supprimer le quiz
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Vos étudiants</h2>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Étudiants inscrits</CardTitle>
                    <input
                      type="text"
                      placeholder="Rechercher un étudiant..."
                      className="border rounded-md px-3 py-2 w-64"
                      onChange={(e) => {
                        // Simuler une recherche d'étudiant
                        const searchTerm = e.target.value.toLowerCase();
                        setStudents(students.filter(student => 
                          student.name.toLowerCase().includes(searchTerm) ||
                          student.email.toLowerCase().includes(searchTerm) ||
                          student.course.toLowerCase().includes(searchTerm)
                        ));
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.course}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{student.progress}%</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-600"
                                onClick={() => handleViewStudentDetails(student.id)}
                              >
                                Détails
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
