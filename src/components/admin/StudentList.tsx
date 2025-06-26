
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudents, activateUser, deactivateUser } from "@/services/userService";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

const StudentList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch students
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  // Activate student mutation
  const activateMutation = useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Étudiant activé",
        description: "L'étudiant a été activé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'activer l'étudiant.",
        variant: "destructive",
      });
    },
  });

  // Deactivate student mutation
  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Étudiant désactivé",
        description: "L'étudiant a été désactivé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de désactiver l'étudiant.",
        variant: "destructive",
      });
    },
  });

  // Handle student status toggle
  const handleStudentStatusChange = (student: User) => {
    if (student.is_active) {
      deactivateMutation.mutate(student.id);
    } else {
      activateMutation.mutate(student.id);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter((student: User) => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger les étudiants. Veuillez réessayer.",
      variant: "destructive"
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Liste des Étudiants</CardTitle>
        <div className="flex items-center mt-4">
          <Search className="w-4 h-4 mr-2 text-gray-500" />
          <Input
            placeholder="Rechercher un étudiant..."
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
        ) : filteredStudents.length > 0 ? (
          <div className="space-y-4">
            {filteredStudents.map((student: User) => (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage 
                      src={student.avatar ? `http://localhost:8000/storage/${student.avatar}` : undefined}
                      alt={student.name} 
                    />
                    <AvatarFallback>
                      {student.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="font-medium">{`${student.first_name} ${student.last_name}`}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${student.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {student.is_active ? 'Actif' : 'Inactif'}
                  </span>
                  <Switch 
                    checked={Boolean(student.is_active)} 
                    onCheckedChange={() => handleStudentStatusChange(student)}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      if (student.is_active) {
                        deactivateMutation.mutate(student.id);
                      } else {
                        activateMutation.mutate(student.id);
                      }
                    }}
                  >
                    {student.is_active ? (
                      <UserX className="h-4 w-4 mr-1 text-red-500" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-1 text-green-500" />
                    )}
                    {student.is_active ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun étudiant trouvé.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentList;
