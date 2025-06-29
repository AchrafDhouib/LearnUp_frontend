import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Eye, Pencil, Trash2, Check, X } from "lucide-react";
import { Course } from "@/types/course";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourse, acceptCourse, rejectCourse } from "@/services/courseService";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CourseListProps {
  courses: Course[];
}

const CourseList = ({ courses }: CourseListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du cours.",
        variant: "destructive",
      });
      console.error("Error deleting course:", error);
    }
  });

  // Accept course mutation
  const acceptMutation = useMutation({
    mutationFn: acceptCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Cours accepté",
        description: "Le cours a été accepté avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'acceptation du cours.",
        variant: "destructive",
      });
      console.error("Error accepting course:", error);
    }
  });

  // Reject course mutation
  const rejectMutation = useMutation({
    mutationFn: rejectCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Cours rejeté",
        description: "Le cours a été rejeté avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du rejet du cours.",
        variant: "destructive",
      });
      console.error("Error rejecting course:", error);
    }
  });

  const getStatusBadge = (isAccepted: 0 | 1 | null | undefined) => {
    if (isAccepted === null || isAccepted === undefined) {
      return <Badge variant="secondary">En attente</Badge>;
    }
    if (isAccepted === 1) {
      return <Badge variant="default" className="bg-green-500">Accepté</Badge>;
    }
    return <Badge variant="destructive">Rejeté</Badge>;
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun cours trouvé. Créez-en un nouveau!
      </div>
    );
  }
  
  return (
    <div className="grid gap-4">
      {courses.map((course) => (
        <div key={course.id} className="flex items-center p-4 border rounded-lg">
          <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
            {course.image ? (
              <img 
                src={course.image.startsWith('http') ? course.image : `http://localhost:8000/storage/${course.image}`}
                alt={course.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            ) : (
              <BookOpen className="h-6 w-6 text-blue-500" />
            )}
          </div>
          <div className="ml-4 flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{course.name}</h3>
              {getStatusBadge(course.is_accepted)}
            </div>
            <p className="text-gray-500 text-sm">
              {course.speciality?.name || `Spécialité ID: ${course.speciality_id}`}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Par: {course.creator?.name || `Enseignant ID: ${course.creator_id}`}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/admin/courses/${course.id}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/admin/courses/edit/${course.id}`)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            
            {/* Accept/Reject buttons - show for all courses */}
            <Button 
              variant="outline" 
              size="sm"
              className={`${
                course.is_accepted === 1 
                  ? "text-green-600 bg-green-50 border-green-200" 
                  : "text-green-600 hover:bg-green-50"
              }`}
              onClick={() => acceptMutation.mutate(course.id)}
              disabled={acceptMutation.isPending || course.is_accepted === 1}
            >
              <Check className="h-4 w-4 mr-1" />
              {course.is_accepted === 1 ? "Accepté" : "Accepter"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={`${
                course.is_accepted === 0 
                  ? "text-red-600 bg-red-50 border-red-200" 
                  : "text-red-600 hover:bg-red-50"
              }`}
              onClick={() => rejectMutation.mutate(course.id)}
              disabled={rejectMutation.isPending || course.is_accepted === 0}
            >
              <X className="h-4 w-4 mr-1" />
              {course.is_accepted === 0 ? "Rejeté" : "Rejeter"}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela supprimera définitivement
                    le cours "{course.name}" et toutes ses leçons associées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteMutation.mutate(course.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
