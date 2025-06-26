
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Course } from "@/types/course";
import { useNavigate } from "react-router-dom";

interface CourseListProps {
  courses: Course[];
}

const CourseList = ({ courses }: CourseListProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-4">
      {courses.map((course) => (
        <div key={course.id} className="flex items-center p-4 border rounded-lg">
          <div className="flex-shrink-0 h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-blue-500" />
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="font-medium">{course.name}</h3>
            <p className="text-gray-500 text-sm">
              {course.speciality?.name || `Spécialité ID: ${course.speciality_id}`}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/admin/courses/edit/${course.id}`)}
            >
              Modifier
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/admin/courses/${course.id}`)}
            >
              Voir
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
