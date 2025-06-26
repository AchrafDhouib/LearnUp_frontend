
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/services/courseService";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const FeaturedCourses = () => {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  // Prendre seulement les 3 premiers cours pour la section "featured"
  const featuredCourses = courses?.slice(0, 3) || [];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <h2 className="text-3xl font-bold relative mb-8 md:mb-0">
            <span className="relative z-10">Cours populaires</span>
            <span className="absolute bottom-0 left-0 w-24 h-2 bg-primary rounded-full"></span>
          </h2>
          <Link to="/courses">
            <Button variant="outline" className="text-primary border-2 border-primary hover:text-primary-dark hover:border-primary-dark font-semibold">
              Voir tous les cours
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-6" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">
            Une erreur s'est produite lors du chargement des cours.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                id={course.id}
                title={course.name}
                description={course.description}
                instructor={`${course.creator?.first_name || ''} ${course.creator?.last_name || ''}`}
                category={course.speciality?.name || 'Général'}
                duration="6 semaines"
                students={125}
                lessons={8}
                image={course.image ? `http://localhost:8000/storage/${course.image}` : "https://placehold.co/600x400?text=Course"}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-16 mb-10">
          <Link to="/register">
            <Button size="lg" className="bg-primary hover:bg-primary-dark shadow-lg px-8 py-5 font-semibold border-2 border-primary-dark">
              Rejoindre la communauté
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
