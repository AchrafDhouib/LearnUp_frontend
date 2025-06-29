import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { getCourses } from "@/services/courseService";
import { getSpecialties } from "@/services/specialtyService";
import { getDisciplines } from "@/services/disciplineService";
import { Course } from "@/types/course";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import CourseList from "@/components/admin/CourseList";

type CourseStatus = "all" | "pending" | "accepted" | "rejected";

interface Filters {
  search: string;
  status: CourseStatus;
  specialty: string;
  discipline: string;
}

const CoursesIndex = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    specialty: "all",
    discipline: "all",
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Fetch courses data
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  // Fetch specialties for filter
  const { data: specialties = [], isLoading: isLoadingSpecialties } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
  });

  // Fetch disciplines for filter
  const { data: disciplines = [], isLoading: isLoadingDisciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
  });

  // Filter courses based on all criteria
  const filteredCourses = courses.filter((course: Course) => {
    // Search filter
    const matchesSearch = !filters.search || 
      course.name.toLowerCase().includes(filters.search.toLowerCase()) || 
      (course.description && course.description.toLowerCase().includes(filters.search.toLowerCase())) ||
      (course.speciality?.name && course.speciality.name.toLowerCase().includes(filters.search.toLowerCase())) ||
      (course.creator?.name && course.creator.name.toLowerCase().includes(filters.search.toLowerCase()));

    // Status filter
    const matchesStatus = filters.status === "all" || 
      (filters.status === "pending" && (course.is_accepted === null || course.is_accepted === undefined)) ||
      (filters.status === "accepted" && course.is_accepted === 1) ||
      (filters.status === "rejected" && course.is_accepted === 0);

    // Specialty filter
    const matchesSpecialty = filters.specialty === "all" || 
      course.speciality_id === parseInt(filters.specialty);

    // Discipline filter
    const matchesDiscipline = filters.discipline === "all" || 
      course.speciality?.discipline_id === parseInt(filters.discipline);

    return matchesSearch && matchesStatus && matchesSpecialty && matchesDiscipline;
  });

  const getStatusCount = (status: CourseStatus) => {
    if (status === "all") return courses.length;
    if (status === "pending") return courses.filter((c: Course) => c.is_accepted === null || c.is_accepted === undefined).length;
    if (status === "accepted") return courses.filter((c: Course) => c.is_accepted === 1).length;
    if (status === "rejected") return courses.filter((c: Course) => c.is_accepted === 0).length;
    return 0;
  };

  const getSpecialtyCount = (specialtyId: string) => {
    if (specialtyId === "all") return courses.length;
    return courses.filter((c: Course) => c.speciality_id === parseInt(specialtyId)).length;
  };

  const getDisciplineCount = (disciplineId: string) => {
    if (disciplineId === "all") return courses.length;
    return courses.filter((c: Course) => c.speciality?.discipline_id === parseInt(disciplineId)).length;
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      specialty: "all",
      discipline: "all",
    });
  };

  const hasActiveFilters = filters.search || filters.status !== "all" || filters.specialty !== "all" || filters.discipline !== "all";

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Cours</h1>
          
          <Button onClick={() => navigate('/admin/courses/create')}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un cours
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <Input
            placeholder="Rechercher des cours..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>

        {/* Filters Section */}
        <Card>
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres avancés
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {[filters.status !== "all", filters.specialty !== "all", filters.discipline !== "all"].filter(Boolean).length} actifs
                    </Badge>
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value: CourseStatus) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Tous les statuts ({getStatusCount("all")})
                      </SelectItem>
                      <SelectItem value="pending">
                        En attente ({getStatusCount("pending")})
                      </SelectItem>
                      <SelectItem value="accepted">
                        Acceptés ({getStatusCount("accepted")})
                      </SelectItem>
                      <SelectItem value="rejected">
                        Rejetés ({getStatusCount("rejected")})
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Specialty Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Spécialité</label>
                  <Select 
                    value={filters.specialty} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, specialty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Toutes les spécialités ({getSpecialtyCount("all")})
                      </SelectItem>
                      {specialties.map((specialty: any) => (
                        <SelectItem key={specialty.id} value={String(specialty.id)}>
                          {specialty.name} ({getSpecialtyCount(String(specialty.id))})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Discipline Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discipline</label>
                  <Select 
                    value={filters.discipline} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, discipline: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par discipline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Toutes les disciplines ({getDisciplineCount("all")})
                      </SelectItem>
                      {disciplines.map((discipline: any) => (
                        <SelectItem key={discipline.id} value={String(discipline.id)}>
                          {discipline.name} ({getDisciplineCount(String(discipline.id))})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Effacer les filtres
                  </Button>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Results Summary */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? 's' : ''} 
              {filters.search && ` pour "${filters.search}"`}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Effacer
            </Button>
          </div>
        )}

        {/* Courses List */}
        {isLoadingCourses || isLoadingSpecialties || isLoadingDisciplines ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded mr-4" />
                    <div className="space-y-2 flex-grow">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <CourseList courses={filteredCourses} />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CoursesIndex;