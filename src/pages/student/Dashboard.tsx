
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import CourseCard from "@/components/CourseCard";
import CertificateCard from "@/components/CertificateCard";
import { Book, BookOpen, CheckCircle, Clock, Dot, GraduationCap, Trophy } from "lucide-react";
import { courses, certificates } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Dans un vrai scénario, ces données viendraient de votre backend Laravel
  const [enrolledCourses] = useState(courses.slice(0, 4));
  const [completedCourses] = useState(courses.slice(0, 2));
  const [userCertificates] = useState(certificates);
  
  // Statistiques de l'étudiant
  const stats = [
    { 
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: "Cours en cours", 
      value: enrolledCourses.length - completedCourses.length 
    },
    { 
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      title: "Cours terminés", 
      value: completedCourses.length 
    },
    { 
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      title: "Certifications", 
      value: userCertificates.length 
    },
    { 
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      title: "Heures d'apprentissage", 
      value: "45h" 
    },
  ];
  
  // Activité récente (simulée)
  const recentActivity = [
    { type: "course-progress", course: "React.js pour les débutants", date: new Date(2023, 3, 15) },
    { type: "quiz-completed", course: "Introduction au développement web moderne", date: new Date(2023, 3, 10) },
    { type: "certificate-earned", course: "Bases de données avec MySQL", date: new Date(2023, 2, 28) },
    { type: "course-enrolled", course: "Python pour la science des données", date: new Date(2023, 2, 15) },
  ];

  return (
    <DashboardLayout userType="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue, {user ? (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.name) : 'Étudiant'}
          </h1>
          <p className="text-gray-500">Continuez votre apprentissage là où vous vous êtes arrêté.</p>
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
            <TabsTrigger value="certificates">Mes certifications</TabsTrigger>
            <TabsTrigger value="activity">Activité récente</TabsTrigger>
          </TabsList>
          
          {/* Contenu des onglets */}
          <TabsContent value="courses" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Continuez à apprendre</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="certificates" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Vos certifications</h2>
              {userCertificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userCertificates.map((cert) => (
                    <CertificateCard 
                      key={cert.id}
                      id={cert.id}
                      courseTitle={cert.courseTitle}
                      studentName={cert.studentName}
                      issueDate={cert.issueDate}
                      instructor={cert.instructor}
                      onDownload={() => console.log(`Téléchargement du certificat ${cert.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <GraduationCap className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">Aucune certification pour le moment</h3>
                    <p className="text-gray-500 text-center mt-2">
                      Complétez vos cours et réussissez les quiz pour obtenir des certifications.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Votre activité récente</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="rounded-full p-2 bg-primary/10">
                            {activity.type === "course-progress" && <Book className="h-5 w-5 text-primary" />}
                            {activity.type === "quiz-completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {activity.type === "certificate-earned" && <GraduationCap className="h-5 w-5 text-amber-500" />}
                            {activity.type === "course-enrolled" && <BookOpen className="h-5 w-5 text-blue-500" />}
                          </div>
                          {index < recentActivity.length - 1 && (
                            <div className="h-full w-0.5 bg-gray-200 my-2"></div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">
                              {activity.type === "course-progress" && "Progression dans un cours"}
                              {activity.type === "quiz-completed" && "Quiz complété"}
                              {activity.type === "certificate-earned" && "Certification obtenue"}
                              {activity.type === "course-enrolled" && "Inscription à un cours"}
                            </span>
                            <Dot className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {activity.date.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">{activity.course}</p>
                        </div>
                      </div>
                    ))}
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

export default StudentDashboard;
