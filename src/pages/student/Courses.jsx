
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Search, Users, Calendar, TrendingUp } from "lucide-react";
import { getMyCourses, getEnrollmentStats } from "@/services/studentCourseService";

const StudentCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['student-courses'],
    queryFn: getMyCourses,
  });

  const { data: stats } = useQuery({
    queryKey: ['student-enrollment-stats'],
    queryFn: getEnrollmentStats,
  });
  
  // Filter courses by status
  const activeCourses = courses.filter(course => course.status === 'active');
  const completedCourses = courses.filter(course => course.status === 'completed');

  const filteredActive = activeCourses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (course.speciality?.name && course.speciality.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCompleted = completedCourses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (course.speciality?.name && course.speciality.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <DashboardLayout userType="student">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes cours</h1>
            <p className="text-gray-500">Chargement de vos cours...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="student">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes cours</h1>
            <p className="text-red-500">Erreur lors du chargement des cours: {error.message}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes cours</h1>
          <p className="text-gray-500">Consultez et continuez vos cours en cours et terminés.</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center pt-6">
                <div className="mr-4 p-2 rounded-full bg-blue-100">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total inscrit</p>
                  <p className="text-2xl font-semibold">{stats.total_enrolled}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center pt-6">
                <div className="mr-4 p-2 rounded-full bg-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">En cours</p>
                  <p className="text-2xl font-semibold">{stats.active_courses}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center pt-6">
                <div className="mr-4 p-2 rounded-full bg-purple-100">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Terminés</p>
                  <p className="text-2xl font-semibold">{stats.completed_courses}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center pt-6">
                <div className="mr-4 p-2 rounded-full bg-orange-100">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Progression</p>
                  <p className="text-2xl font-semibold">{Math.round(stats.average_progress)}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher dans mes cours..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="enrolled">
          <TabsList className="mb-6">
            <TabsTrigger value="enrolled">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enrolled">
            {filteredActive.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActive.map((course) => (
                  <div key={course.id} className="relative">
                    <CourseCard 
                      id={course.id}
                      title={course.name}
                      description={course.description}
                      image={course.image || "https://placehold.co/600x400?text=Course"}
                      instructor={course.creator ? `${course.creator.first_name} ${course.creator.last_name}` : "Instructeur"}
                      category={course.speciality?.name || "Général"}
                      duration="6h 30min"
                      lessons={5}
                      students={125}
                      linkPath={`/student/courses/${course.id}`}
                    />
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      <Badge variant={course.enrollment_type === 'direct' ? 'default' : 'secondary'}>
                        {course.enrollment_type === 'direct' ? 'Inscription directe' : 'Via groupe'}
                      </Badge>
                      {course.group_name && (
                        <Badge variant="outline" className="text-xs">
                          {course.group_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">
                    {searchQuery ? "Aucun cours trouvé" : "Aucun cours en cours"}
                  </h3>
                  <p className="text-gray-500 text-center mt-2">
                    {searchQuery 
                      ? `Aucun cours ne correspond à "${searchQuery}"`
                      : "Vous n'êtes inscrit à aucun cours pour le moment"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {filteredCompleted.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompleted.map((course) => (
                  <div key={course.id} className="relative">
                    <CourseCard 
                      id={course.id}
                      title={course.name}
                      description={course.description}
                      image={course.image || "https://placehold.co/600x400?text=Course"}
                      instructor={course.creator ? `${course.creator.first_name} ${course.creator.last_name}` : "Instructeur"}
                      category={course.speciality?.name || "Général"}
                      duration="6h 30min"
                      lessons={5}
                      students={125}
                      linkPath={`/student/courses/${course.id}`}
                    />
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      <Badge variant={course.enrollment_type === 'direct' ? 'default' : 'secondary'}>
                        {course.enrollment_type === 'direct' ? 'Inscription directe' : 'Via groupe'}
                      </Badge>
                      {course.group_name && (
                        <Badge variant="outline" className="text-xs">
                          {course.group_name}
                        </Badge>
                      )}
                    </div>
                    {course.completed_at && (
                      <div className="absolute bottom-2 right-2 z-10">
                        <Badge variant="success" className="bg-green-100 text-green-800">
                          Terminé le {new Date(course.completed_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <GraduationCap className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700">
                    {searchQuery ? "Aucun cours trouvé" : "Aucun cours terminé"}
                  </h3>
                  <p className="text-gray-500 text-center mt-2">
                    {searchQuery 
                      ? `Aucun cours ne correspond à "${searchQuery}"`
                      : "Vous n'avez pas encore terminé de cours"
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

export default StudentCourses;
