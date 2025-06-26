
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/DashboardLayout";
import { getCourses } from "@/services/courseService";
import { Course } from "@/types/course";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CourseList from "@/components/admin/CourseList";

const CoursesIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch courses data
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  // Filter courses based on search term
  const filteredCourses = searchTerm && courses.length > 0
    ? courses.filter((course: Course) => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.speciality?.name && course.speciality.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.creator?.name && course.creator.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : courses;

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Cours</h1>
          
          <Button onClick={() => navigate('/admin/courses/create')}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un cours
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <Input
            placeholder="Rechercher des cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
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