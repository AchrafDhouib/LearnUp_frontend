
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import DashboardLayout from "@/components/DashboardLayout";
import { getDisciplines, deleteDiscipline } from "@/services/disciplineService";
import { Discipline } from "@/types/discipline";

const DisciplinesIndex = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch disciplines data
  const { data: disciplines = [], isLoading } = useQuery({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
  });

  // Delete discipline mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDiscipline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
      toast({
        title: "Discipline supprimée",
        description: "La discipline a été supprimée avec succès.",
      });
    },
  });

  // Filter disciplines based on search term
  const filteredDisciplines = disciplines.filter((discipline: Discipline) => 
    discipline.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    discipline.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Disciplines</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Ajouter une discipline
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle discipline</DialogTitle>
                <DialogDescription>
                  Créez une nouvelle discipline pour vos cours.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <form action={`/admin/disciplines/create`} method="get">
                  <Button type="submit" className="w-full">Créer une nouvelle discipline</Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <Input
            placeholder="Rechercher des disciplines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p>Chargement des disciplines...</p>
          ) : filteredDisciplines.length > 0 ? (
            filteredDisciplines.map((discipline: Discipline) => (
              <Card key={discipline.id} className="overflow-hidden">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  {discipline.image ? (
                    <img 
                      src={discipline.image} 
                      alt={discipline.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">Pas d'image</span>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">{discipline.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{discipline.description}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      {discipline.specialities?.length || 0} spécialités
                    </div>
                    <div className="space-x-2 flex">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => window.location.href = `/admin/disciplines/edit/${discipline.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée. Cela supprimera définitivement
                              la discipline "{discipline.name}" et toutes les données associées.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteMutation.mutate(discipline.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-3 text-center py-10 text-gray-500">
              Aucune discipline trouvée. Créez-en une nouvelle!
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DisciplinesIndex;
