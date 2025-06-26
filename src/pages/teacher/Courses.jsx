
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { PlusCircle, PenSquare, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { courses } from "@/data/mockData";

const TeacherCourses = () => {
  const [teacherCourses] = useState(courses.slice(0, 5));

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
          {teacherCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="h-48 md:h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="mr-4">{course.level}</span>
                        <span className="mr-4">{course.lessons} leçons</span>
                        <span>{course.students} étudiants</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button variant="outline" className="flex items-center">
                        <PenSquare className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button variant="outline" className="flex items-center text-red-500 border-red-200 hover:bg-red-50">
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
        
        <Link to="/teacher/create-course">
          <Button className="w-full py-6 bg-gray-100 text-gray-800 hover:bg-gray-200 border border-dashed border-gray-300">
            <PlusCircle className="h-5 w-5 mr-2" />
            Ajouter un nouveau cours
          </Button>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default TeacherCourses;
