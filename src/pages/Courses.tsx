import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Navbar from "@/components/Navbar";
import Footer from "@/components/home/Footer";
import CourseCard from "@/components/CourseCard";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/services/courseService";
import { getSpecialties } from "@/services/specialtyService";
import { getDisciplines } from "@/services/disciplineService";
import { Course } from "@/types/course";

interface Filters {
  search: string;
  discipline: string;
  specialty: string;
  sort: string;
}

const Courses = () => {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    discipline: "all",
    specialty: "all",
    sort: "newest"
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Get courses from API
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses
  });

  // Get specialties for filter
  const { data: specialties = [], isLoading: isLoadingSpecialties } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
  });

  // Get disciplines for filter
  const { data: disciplines = [], isLoading: isLoadingDisciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
  });

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter((course: Course) => {
      // Only show accepted courses for public pages
      if (course.is_accepted !== 1) {
        return false;
      }

      // Search filter
      const matchesSearch = !filters.search || 
        course.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.creator?.name?.toLowerCase().includes(filters.search.toLowerCase());

      // Discipline filter
      const matchesDiscipline = filters.discipline === "all" || 
        course.speciality?.discipline_id === parseInt(filters.discipline);

      // Specialty filter
      const matchesSpecialty = filters.specialty === "all" || 
        course.speciality_id === parseInt(filters.specialty);

      return matchesSearch && matchesDiscipline && matchesSpecialty;
    });

    // Sort courses
    filtered.sort((a: Course, b: Course) => {
      switch (filters.sort) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return ((a.price || 0) - (b.price || 0));
        case "price-desc":
          return ((b.price || 0) - (a.price || 0));
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [courses, filters]);

  const clearFilters = () => {
    setFilters({
      search: "",
      discipline: "all",
      specialty: "all",
      sort: "newest"
    });
  };

  const hasActiveFilters = filters.search || filters.discipline !== "all" || filters.specialty !== "all" || filters.sort !== "newest";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-light to-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Explorez nos cours</h1>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez notre sélection de cours et développez vos compétences
            </p>
            
            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un cours..."
                  className="pl-10 pr-4 h-12 w-full"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Filters Section */}
          <Card className="mb-8">
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres avancés
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2">
                        {[filters.discipline !== "all", filters.specialty !== "all", filters.sort !== "newest"].filter(Boolean).length} actifs
                      </Badge>
                    )}
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Discipline Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discipline</label>
                    <select 
                      value={filters.discipline} 
                      onChange={(e) => setFilters(prev => ({ ...prev, discipline: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">Toutes les disciplines</option>
                      {disciplines.map((discipline: any) => (
                        <option key={discipline.id} value={discipline.id.toString()}>
                          {discipline.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Specialty Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Spécialité</label>
                    <select 
                      value={filters.specialty} 
                      onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">Toutes les spécialités</option>
                      {specialties.map((specialty: any) => (
                        <option key={specialty.id} value={specialty.id.toString()}>
                          {specialty.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Trier par</label>
                    <select 
                      value={filters.sort} 
                      onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="newest">Plus récents</option>
                      <option value="oldest">Plus anciens</option>
                      <option value="name-asc">Nom A-Z</option>
                      <option value="name-desc">Nom Z-A</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                    </select>
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
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-8">
              <div className="text-sm text-gray-600">
                {filteredAndSortedCourses.length} cours trouvé{filteredAndSortedCourses.length > 1 ? 's' : ''} 
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

          {/* Results */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              {filteredAndSortedCourses.length} cours trouvés
            </p>
            
            {coursesLoading || isLoadingSpecialties || isLoadingDisciplines ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedCourses.map((course: Course) => (
                  <CourseCard 
                    key={course.id}
                    id={course.id}
                    title={course.name}
                    description={course.description}
                    instructor={course.creator?.name || `Enseignant ${course.creator_id}`}
                    category={course.speciality?.name || `Spécialité ${course.speciality_id}`}
                    duration={`${course.lessons?.length || 0} leçons`}
                    students={course.students_count || 0}
                    lessons={course.lessons?.length || 0}
                    image={course.image || "https://placehold.co/600x400?text=Course"}
                    price={course.price}
                    discount={course.discount}
                  />
                ))}
              </div>
            )}
          </div>

          {!coursesLoading && !isLoadingSpecialties && !isLoadingDisciplines && filteredAndSortedCourses.length === 0 && (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center">
                <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Aucun cours ne correspond à vos critères
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <Button 
                  variant="outline"
                  onClick={clearFilters}
                >
                  Voir tous les cours
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;