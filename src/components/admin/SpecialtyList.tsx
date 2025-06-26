
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSpecialty } from "@/services/specialtyService";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Specialty } from "@/types/specialty";
import { Edit, Trash2, Eye } from "lucide-react";

interface SpecialtyListProps {
  specialties: Specialty[];
}

const SpecialtyList = ({ specialties }: SpecialtyListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [specialtyToDelete, setSpecialtyToDelete] = useState<number | null>(null);
  
  // Delete specialty mutation
  const deleteSpecialtyMutation = useMutation({
    mutationFn: deleteSpecialty,
    onSuccess: () => {
      toast({
        title: "Spécialité supprimée",
        description: "La spécialité a été supprimée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      setSpecialtyToDelete(null);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la spécialité",
        variant: "destructive",
      });
    },
  });

  // Handle specialty deletion
  const handleDelete = (id: number) => {
    setSpecialtyToDelete(id);
  };

  const confirmDelete = () => {
    if (specialtyToDelete) {
      deleteSpecialtyMutation.mutate(specialtyToDelete);
    }
  };

  return (
    <>
      {/* Alert dialog for delete confirmation */}
      <AlertDialog open={!!specialtyToDelete} onOpenChange={() => setSpecialtyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement la spécialité 
              et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Specialty list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialties.length > 0 ? (
          specialties.map((specialty) => (
            <Card key={specialty.id} className="overflow-hidden">
              <CardHeader className="p-0">
                {specialty.image && (
                  <div className="relative h-40 w-full">
                    <img
                      src={specialty.image}
                      alt={specialty.name}
                      className="absolute h-full w-full object-cover"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4 pt-6">
                <CardTitle className="text-xl mb-2">{specialty.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {specialty.description}
                </CardDescription>
                
                {specialty.discipline && (
                  <div className="mt-3">
                    <span className="text-sm font-medium">Discipline:</span>
                    <span className="ml-2 text-sm text-gray-600">
                      {specialty.discipline.name}
                    </span>
                  </div>
                )}
                
                {specialty.courses && (
                  <div className="mt-1">
                    <span className="text-sm font-medium">Cours:</span>
                    <span className="ml-2 text-sm text-gray-600">
                      {specialty.courses.length}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/admin/specialties/${specialty.id}`)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/admin/specialties/edit/${specialty.id}`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(specialty.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-40">
            <p className="text-gray-500">Aucune spécialité trouvée.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SpecialtyList;
