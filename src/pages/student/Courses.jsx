
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, GraduationCap, Search } from "lucide-react";
import { getCourses } from "@/services/courseService";

const StudentCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['student-courses'],
    queryFn: getCourses,
  });
  
  // For demonstration, we'll consider the first 4 courses as enrolled and the first 2 as completed
  const enrolledCourses = courses.slice(0, Math.min(4, courses.length));
  const completedCourses = courses.slice(0, Math.min(2, courses.length));

  const filteredEnrolled = enrolledCourses.filter(course => 
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
            {filteredEnrolled.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEnrolled.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    id={course.id}
                    title={course.name}
                    description={course.description}
                    image={course.image ? `http://localhost:8000/storage/${course.image}` : "https://placehold.co/600x400?text=Course"}
                    author={course.creator ? `${course.creator.first_name} ${course.creator.last_name}` : "Instructeur"}
                    category={course.speciality?.name || "Général"}
                    level="Intermédiaire"
                    duration="6h 30min"
                    lessons={5}
                    students={125}
                    rating={4.8}
                    reviews={24}
                  />
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
                  <CourseCard 
                    key={course.id} 
                    id={course.id}
                    title={course.name}
                    description={course.description}
                    image={course.image ? `http://localhost:8000/storage/${course.image}` : "https://placehold.co/600x400?text=Course"}
                    author={course.creator ? `${course.creator.first_name} ${course.creator.last_name}` : "Instructeur"}
                    category={course.speciality?.name || "Général"}
                    level="Intermédiaire"
                    duration="6h 30min"
                    lessons={5}
                    students={125}
                    rating={4.8}
                    reviews={24}
                    progress={100} // 100% for completed courses
                  />
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
