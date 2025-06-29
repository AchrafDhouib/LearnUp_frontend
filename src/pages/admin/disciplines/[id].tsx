import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDiscipline } from "@/services/disciplineService";
import { getSpecialties } from "@/services/specialtyService";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Users, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DisciplineIndex = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const disciplineId = parseInt(id || "0");

  // Fetch discipline data
  const { data: discipline, isLoading: isLoadingDiscipline } = useQuery({
    queryKey: ["discipline", disciplineId],
    queryFn: () => getDiscipline(disciplineId),
    enabled: !!disciplineId,
  });

  // Fetch all specialties to filter by discipline
  const { data: allSpecialties = [], isLoading: isLoadingSpecialties } = useQuery({
    queryKey: ["specialties"],
    queryFn: getSpecialties,
  });

  // Filter specialties for this discipline
  const disciplineSpecialties = allSpecialties.filter(
    (specialty: any) => specialty.discipline_id === disciplineId
  );

  if (isLoadingDiscipline || isLoadingSpecialties) {
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
                  <Skeleton key={index} className="h-32 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!discipline) {
    return (
      <DashboardLayout userType="admin">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Discipline non trouvée</h2>
          <p className="text-gray-600 mb-6">La discipline que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate("/admin/disciplines")}>
            Retour aux disciplines
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4" 
            onClick={() => navigate("/admin/disciplines")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">{discipline.name}</h1>
            <p className="text-gray-500">Détails de la discipline</p>
          </div>
        </div>

        {/* Discipline Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Informations de la discipline
            </CardTitle>
            <CardDescription>
              Détails et description de la discipline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{discipline.name}</h3>
              <p className="text-gray-600">{discipline.description}</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Créée le {new Date(discipline.created_at).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {disciplineSpecialties.length} spécialité{disciplineSpecialties.length > 1 ? 's' : ''}
              </div>
            </div>

            {discipline.image && (
              <div className="mt-4">
                <img 
                  src={discipline.image.startsWith('http') ? discipline.image : `http://localhost:8000/storage/${discipline.image}`}
                  alt={discipline.name}
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

        {/* Specialties */}
        <Card>
          <CardHeader>
            <CardTitle>Spécialités de cette discipline</CardTitle>
            <CardDescription>
              Cliquez sur une spécialité pour voir ses détails et cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            {disciplineSpecialties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {disciplineSpecialties.map((specialty: any) => (
                  <Card key={specialty.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{specialty.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {specialty.description}
                          </p>
                        </div>
                      </div>
                      
                      {specialty.image && (
                        <div className="mb-3">
                          <img 
                            src={specialty.image.startsWith('http') ? specialty.image : `http://localhost:8000/storage/${specialty.image}`}
                            alt={specialty.name}
                            className="w-full h-24 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">
                          {specialty.courses_count || 0} cours
                        </Badge>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/admin/specialties/${specialty.id}`)}
                        >
                          Voir les cours
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune spécialité trouvée pour cette discipline.</p>
                <p className="text-sm">Créez une nouvelle spécialité pour commencer.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DisciplineIndex; 