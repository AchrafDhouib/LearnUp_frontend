
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/home/Footer";
import CourseCard from "@/components/CourseCard";
import { getCourses, getCoursesByDiscipline, getCoursesBySpecialty } from "@/services/courseService";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSort, setSelectedSort] = useState("popular");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  
  // Fetch all courses by default
  const { data: allCourses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  // Fetch courses by discipline when discipline changes
  const { data: disciplineCourses = [] } = useQuery({
    queryKey: ['courses', 'discipline', selectedDiscipline],
    queryFn: () => getCoursesByDiscipline(selectedDiscipline),
    enabled: !!selectedDiscipline,
  });

  // Fetch courses by specialty when specialty changes
  const { data: specialtyCourses = [] } = useQuery({
    queryKey: ['courses', 'specialty', selectedSpecialty],
    queryFn: () => getCoursesBySpecialty(selectedSpecialty),
    enabled: !!selectedSpecialty,
  });

  // Determine which courses array to use based on active filters
  const coursesToUse = selectedSpecialty 
    ? specialtyCourses 
    : selectedDiscipline 
      ? disciplineCourses 
      : allCourses;

  // Filter courses by search query and other filters
  const filteredCourses = coursesToUse.filter(course => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.speciality?.name && course.speciality.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by level (if needed - using mock data level for now)
    // In a real scenario, you'd have level in your API response
    const matchesLevel = !selectedLevel || course.level === selectedLevel;

    // Filter by category (if needed - using mock data category for now)
    const matchesCategory = !selectedCategory || 
      (course.speciality && course.speciality.name === selectedCategory);

    return matchesSearch && matchesLevel && matchesCategory;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (selectedSort) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "price-asc":
        return ((a.price || 0) - (b.price || 0)); // Replace with actual price field
      case "price-desc":
        return ((b.price || 0) - (a.price || 0)); // Replace with actual price field
      case "popular":
      default:
        // Sort by a popularity metric if available, for now using created_at
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // List of disciplines and specialties (extract unique values from courses)
  const disciplines = Array.from(new Set(
    allCourses
      .filter(course => course.speciality?.discipline_id)
      .map(course => ({
        id: course.speciality.discipline_id,
        name: course.speciality.discipline?.name || `Discipline ${course.speciality.discipline_id}`
      }))
  ));

  const specialties = Array.from(new Set(
    allCourses
      .filter(course => course.speciality)
      .map(course => ({
        id: course.speciality.id,
        name: course.speciality.name
      }))
  ));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        {/* En-tête */}
        <div className="bg-gradient-to-br from-primary-light to-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Explorez nos cours</h1>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez notre sélection de cours et développez vos compétences
            </p>
            
            {/* Barre de recherche */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un cours..."
                  className="pl-10 pr-4 h-12 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div>
              <Label htmlFor="discipline">Discipline</Label>
              <Select 
                value={selectedDiscipline} 
                onValueChange={(value) => {
                  setSelectedDiscipline(value);
                  // Reset specialty when discipline changes
                  if (selectedSpecialty) setSelectedSpecialty("");
                }}
              >
                <SelectTrigger id="discipline">
                  <SelectValue placeholder="Toutes les disciplines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les disciplines</SelectItem>
                  {disciplines.map((discipline) => (
                    <SelectItem key={discipline.id} value={discipline.id.toString()}>
                      {discipline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="specialty">Spécialité</Label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Toutes les spécialités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les spécialités</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.id.toString()}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="level">Niveau</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger id="level">
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les niveaux</SelectItem>
                  <SelectItem value="Débutant">Débutant</SelectItem>
                  <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                  <SelectItem value="Avancé">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sort">Trier par</Label>
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Trier par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Les plus populaires</SelectItem>
                  <SelectItem value="newest">Les plus récents</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setSelectedLevel("");
                  setSelectedSort("popular");
                  setSelectedDiscipline("");
                  setSelectedSpecialty("");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>

          {/* Résultats */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Chargement des cours...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-600">Erreur lors du chargement des cours</p>
              <p className="text-gray-600">{error.message}</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  {sortedCourses.length} cours trouvés
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedCourses.map((course) => (
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
              </div>

              {sortedCourses.length === 0 && (
                <Card className="p-12 text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Aucun cours ne correspond à vos critères
                  </h3>
                  <p className="text-gray-600">
                    Essayez de modifier vos filtres ou votre recherche
                  </p>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
