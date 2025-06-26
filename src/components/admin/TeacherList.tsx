
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeachers, activateUser, deactivateUser } from "@/services/userService";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

const TeacherList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch teachers
  const { data: teachers = [], isLoading, error } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  });

  // Activate teacher mutation
  const activateMutation = useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: "Enseignant activé",
        description: "L'enseignant a été activé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'activer l'enseignant.",
        variant: "destructive",
      });
    },
  });

  // Deactivate teacher mutation
  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: "Enseignant désactivé",
        description: "L'enseignant a été désactivé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de désactiver l'enseignant.",
        variant: "destructive",
      });
    },
  });

  // Handle teacher status toggle
  const handleTeacherStatusChange = (teacher: User) => {
    if (teacher.is_active) {
      deactivateMutation.mutate(teacher.id);
    } else {
      activateMutation.mutate(teacher.id);
    }
  };

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter((teacher: User) => 
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger les enseignants. Veuillez réessayer.",
      variant: "destructive"
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Liste des Enseignants</CardTitle>
        <div className="flex items-center mt-4">
          <Search className="w-4 h-4 mr-2 text-gray-500" />
          <Input
            placeholder="Rechercher un enseignant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-4 space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : filteredTeachers.length > 0 ? (
          <div className="space-y-4">
            {filteredTeachers.map((teacher: User) => (
              <div key={teacher.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage 
                      src={teacher.avatar ? `http://localhost:8000/storage/${teacher.avatar}` : undefined}
                      alt={teacher.name} 
                    />
                    <AvatarFallback>
                      {teacher.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-medium">{`${teacher.first_name} ${teacher.last_name}`}</div>
                    <div className="text-sm text-gray-500">{teacher.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${teacher.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {teacher.is_active ? 'Actif' : 'Inactif'}
                  </span>
                  <Switch 
                    checked={Boolean(teacher.is_active)} 
                    onCheckedChange={() => handleTeacherStatusChange(teacher)}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      if (teacher.is_active) {
                        deactivateMutation.mutate(teacher.id);
                      } else {
                        activateMutation.mutate(teacher.id);
                      }
                    }}
                  >
                    {teacher.is_active ? (
                      <UserX className="h-4 w-4 mr-1 text-red-500" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-1 text-green-500" />
                    )}
                    {teacher.is_active ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun enseignant trouvé.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherList;
