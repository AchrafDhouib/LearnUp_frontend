import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSpecialty } from "@/services/specialtyService";
import { getCoursesBySpecialty } from "@/services/courseService";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Users, Calendar, Clock, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SpecialtyIndex = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const specialtyId = parseInt(id || "0");

  // Fetch specialty data
  const { data: specialty, isLoading: isLoadingSpecialty } = useQuery({
    queryKey: ["specialty", specialtyId],
    queryFn: () => getSpecialty(specialtyId),
    enabled: !!specialtyId,
  });

  // Fetch courses for this specialty
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses", "specialty", specialtyId],
    queryFn: () => getCoursesBySpecialty(specialtyId),
    enabled: !!specialtyId,
  });

  if (isLoadingSpecialty || isLoadingCourses) {
    return (
      <DashboardLayout userType="admin">
        <div className="space-y-6">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 mr-4" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-48 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!specialty) {
    return (
      <DashboardLayout userType="admin">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Spécialité non trouvée</h2>
          <p className="text-gray-600 mb-6">La spécialité que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate("/admin/specialties")}>
            Retour aux spécialités
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (isAccepted: boolean | null) => {
    if (isAccepted === null || isAccepted === undefined) {
      return <Badge variant="secondary">En attente</Badge>;
    }
    if (isAccepted) {
      return <Badge variant="default" className="bg-green-500">Accepté</Badge>;
    }
    return <Badge variant="destructive">Rejeté</Badge>;
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4" 
            onClick={() => navigate("/admin/specialties")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">{specialty.name}</h1>
            <p className="text-gray-500">Détails de la spécialité</p>
          </div>
        </div>

        {/* Specialty Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Informations de la spécialité
            </CardTitle>
            <CardDescription>
              Détails et description de la spécialité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{specialty.name}</h3>
              <p className="text-gray-600">{specialty.description}</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Créée le {new Date(specialty.created_at).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {courses.length} cours
              </div>
            </div>

            {specialty.image && (
              <div className="mt-4">
                <img 
                  src={specialty.image.startsWith('http') ? specialty.image : `http://localhost:8000/storage/${specialty.image}`}
                  alt={specialty.name}
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Cours de cette spécialité</CardTitle>
            <CardDescription>
              Cliquez sur un cours pour voir ses détails, leçons et quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course: any) => (
                  <Card key={course.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{course.name}</h3>
                            {getStatusBadge(course.is_accepted)}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                      </div>
                      
                      {course.image && (
                        <div className="mb-3">
                          <img 
                            src={course.image.startsWith('http') ? course.image : `http://localhost:8000/storage/${course.image}`}
                            alt={course.name}
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          {course.creator?.name || `Enseignant ID: ${course.creator_id}`}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.lessons?.length || 0} leçons
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">
                          {course.lessons?.length || 0} leçons
                        </Badge>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/admin/courses/${course.id}`)}
                        >
                          Voir le cours
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun cours trouvé pour cette spécialité.</p>
                <p className="text-sm">Créez un nouveau cours pour commencer.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SpecialtyIndex; 