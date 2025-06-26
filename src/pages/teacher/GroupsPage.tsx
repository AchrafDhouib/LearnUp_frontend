import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import CourseCard from "@/components/CourseCard";
import { Users, BookOpen, FileText, BarChart, PlusCircle, PenSquare, Trash2 } from "lucide-react";
import { courses, quizzes } from "@/data/mockData";

const TeacherDashboard = () => {
  const [teacherCourses] = useState(courses.slice(0, 3));
  const [teacherQuizzes] = useState(quizzes.slice(0, 2));

  const stats = [
    { icon: <BookOpen className="h-5 w-5 text-primary" />, title: "Cours publiés", value: teacherCourses.length },
    { icon: <FileText className="h-5 w-5 text-amber-500" />, title: "Quiz créés", value: teacherQuizzes.length },
    { icon: <Users className="h-5 w-5 text-blue-500" />, title: "Étudiants", value: "246" },
    { icon: <BarChart className="h-5 w-5 text-green-500" />, title: "Taux de réussite", value: "87%" },
  ];

  const disciplines = ["Informatique", "Mathématiques", "Physique"];
  const specialitesParDiscipline: { [key: string]: string[] } = {
    "Informatique": ["Développement Web", "Data Science", "Cybersécurité"],
    "Mathématiques": ["Statistiques", "Analyse numérique"],
    "Physique": ["Physique Quantique", "Astrophysique"]
  };

  const etudiantsParSpecialite: { [key: string]: { name: string; email: string; progress: number; }[] } = {
    "Développement Web": [
      { name: "Jean Dupont", email: "jean.dupont@example.com", progress: 80 },
      { name: "Marie Martin", email: "marie.martin@example.com", progress: 65 }
    ],
    "Data Science": [
      { name: "Paul Bernard", email: "paul.bernard@example.com", progress: 50 }
    ],
    "Cybersécurité": [
      { name: "Sophie Laurent", email: "sophie.laurent@example.com", progress: 90 }
    ],
    "Statistiques": [
      { name: "Thomas Petit", email: "thomas.petit@example.com", progress: 70 }
    ],
    "Analyse numérique": [],
    "Physique Quantique": [],
    "Astrophysique": [],
  };

  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedSpecialite, setSelectedSpecialite] = useState('');

  const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDiscipline(e.target.value);
    setSelectedSpecialite('');
  };

  const handleSpecialiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpecialite(e.target.value);
  };

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de bord enseignant</h1>
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

        {/* Tabs */}
        <Tabs defaultValue="courses">
          <TabsList className="mb-4">
            <TabsTrigger value="courses">Mes cours</TabsTrigger>
            <TabsTrigger value="quizzes">Mes quiz</TabsTrigger>
            <TabsTrigger value="groups">Mes groupes</TabsTrigger>
          </TabsList>

          {/* Onglet Mes cours */}
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

          {/* Onglet Mes quiz */}
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
                              Cours : {relatedCourse?.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {quiz.questions.length} questions
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <PenSquare className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
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

          {/* Onglet Mes groupes */}
          <TabsContent value="groups" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Gestion des groupes</h2>

              {/* Choix discipline */}
              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">Choisir une discipline :</label>
                <select
                  value={selectedDiscipline}
                  onChange={handleDisciplineChange}
                  className="border rounded-md px-4 py-2 w-full"
                >
                  <option value="">-- Sélectionner une discipline --</option>
                  {disciplines.map((discipline, idx) => (
                    <option key={idx} value={discipline}>{discipline}</option>
                  ))}
                </select>
              </div>

              {/* Choix spécialité */}
              {selectedDiscipline && (
                <div className="mb-6">
                  <label className="block mb-2 font-medium text-gray-700">Choisir une spécialité :</label>
                  <select
                    value={selectedSpecialite}
                    onChange={handleSpecialiteChange}
                    className="border rounded-md px-4 py-2 w-full"
                  >
                    <option value="">-- Sélectionner une spécialité --</option>
                    {specialitesParDiscipline[selectedDiscipline].map((specialite, idx) => (
                      <option key={idx} value={specialite}>{specialite}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Liste étudiants */}
              {selectedSpecialite && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Étudiants en {selectedSpecialite}</h3>
                  {etudiantsParSpecialite[selectedSpecialite].length > 0 ? (
                    <div className="overflow-x-auto border rounded-md">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {etudiantsParSpecialite[selectedSpecialite].map((student, idx) => (
                            <tr key={idx}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.progress}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun étudiant dans cette spécialité.</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
