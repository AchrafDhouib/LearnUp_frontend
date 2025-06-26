
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "@/services/courseService";
import DashboardLayout from "@/components/DashboardLayout";
import CourseForm from "@/components/admin/CourseForm";
import CourseLessonForm from "@/components/admin/CourseLessonForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "0");
  
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <DashboardLayout userType="admin">
        <div className="space-y-6">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Détails du cours</TabsTrigger>
          <TabsTrigger value="lessons">Leçons</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <CourseForm courseId={courseId} isEdit={true} />
        </TabsContent>
        
        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des leçons</CardTitle>
              <CardDescription>
                Ajoutez, modifiez ou supprimez les leçons pour le cours "{course?.name}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseLessonForm 
                courseId={courseId} 
                lessons={course?.lessons || []} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default EditCourse;
