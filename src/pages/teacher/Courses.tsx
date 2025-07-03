import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { PlusCircle, PenSquare, Trash2, Eye, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoursesByCreatorQuery, deleteCourse } from "@/services/courseService";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";

const TeacherCourses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [teacherId, setTeacherId] = useState<number | null>(null);

  // Get teacher ID from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setTeacherId(user.id);
    }
  }, []);

  // Fetch teacher's courses
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['teacher-courses', teacherId],
    queryFn: () => getCoursesByCreatorQuery(teacherId || undefined),
    enabled: !!teacherId,
  });

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du cours.",
        variant: "destructive",
      });
      console.error("Error deleting course:", error);
    }
  });

  const handleDeleteCourse = (courseId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      deleteMutation.mutate(courseId);
    }
  };

  const getStatusBadge = (isAccepted: 0 | 1 | null) => {
    if (isAccepted === null || isAccepted === undefined) {
      return <Badge variant="secondary">En attente</Badge>;
    }
    if (isAccepted === 1) {
      return <Badge variant="default" className="bg-green-500">Approuvé</Badge>;
    }
    return <Badge variant="destructive">Rejeté</Badge>;
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes cours</h1>
              <p className="text-gray-500">Gérez vos cours et créez du contenu éducatif.</p>
            </div>
            <Link to="/teacher/create-course">
              <Button className="bg-primary hover:bg-primary-dark">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouveau cours
              </Button>
            </Link>
          </div>

          <div className="grid gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <Skeleton className="w-full md:w-1/4 h-48 md:h-full" />
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes cours</h1>
              <p className="text-gray-500">Gérez vos cours et créez du contenu éducatif.</p>
            </div>
            <Link to="/teacher/create-course">
              <Button className="bg-primary hover:bg-primary-dark">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouveau cours
              </Button>
            </Link>
          </div>

          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-6">
              Impossible de charger vos cours. Veuillez réessayer.
            </p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes cours</h1>
            <p className="text-gray-500">Gérez vos cours et créez du contenu éducatif.</p>
          </div>
          <Link to="/teacher/create-course">
            <Button className="bg-primary hover:bg-primary-dark">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouveau cours
            </Button>
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid gap-6">
            {courses.map((course: Course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4">
                      {course.image ? (
                        <img 
                          src={course.image.startsWith('http') ? course.image : `http://localhost:8000/storage/${course.image}`}
                          alt={course.name}
                          className="h-48 md:h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="h-48 md:h-full w-full bg-gray-100 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{course.name}</h3>
                          {getStatusBadge(course.is_accepted)}
                        </div>
                        <p className="text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <span className="mr-4">Spécialité: {course.speciality?.name || 'Non spécifiée'}</span>
                          <span className="mr-4">{course.lessons?.length || 0} leçons</span>
                          {course.price && (
                            <span className="mr-4">
                              Prix: {course.price}€
                              {course.discount && (
                                <span className="text-green-600 ml-1">
                                  (-{course.discount}%)
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Link to={`/teacher/courses/${course.id}`}>
                          <Button variant="outline" className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                        </Link>
                        <Link to={`/teacher/courses/edit/${course.id}`}>
                          <Button variant="outline" className="flex items-center">
                            <PenSquare className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="flex items-center text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteCourse(course.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vous n'avez pas encore créé de cours</h3>
            <p className="text-gray-600 mb-6">
              Commencez par créer votre premier cours pour partager vos connaissances
            </p>
            <Link to="/teacher/create-course">
              <Button className="bg-primary hover:bg-primary-dark">
                <PlusCircle className="h-4 w-4 mr-2" />
                Créer un cours
              </Button>
            </Link>
          </Card>
        )}
        
        {courses.length > 0 && (
          <Link to="/teacher/create-course">
            <Button className="w-full py-6 bg-gray-100 text-gray-800 hover:bg-gray-200 border border-dashed border-gray-300">
              <PlusCircle className="h-5 w-5 mr-2" />
              Ajouter un nouveau cours
            </Button>
          </Link>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherCourses;
