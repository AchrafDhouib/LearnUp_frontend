import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { User } from "@/types/user";
import { activateUser, deactivateUser } from "@/services/userService";
import { useMutation } from "@tanstack/react-query";
import { Eye, UserCheck, UserX, Lock, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutations for user activation/deactivation
  const activateMutation = useMutation({
    mutationFn: (userId: number) => activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Utilisateur activé",
        description: "L'utilisateur a été activé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'activation de l'utilisateur.",
        variant: "destructive",
      });
      console.error("Error activating user:", error);
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: (userId: number) => deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Utilisateur désactivé",
        description: "L'utilisateur a été désactivé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la désactivation de l'utilisateur.",
        variant: "destructive",
      });
      console.error("Error deactivating user:", error);
    }
  });

  // Format the date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'teacher': { label: 'Enseignant', className: 'bg-purple-100 text-purple-800' },
      'student': { label: 'Étudiant', className: 'bg-blue-100 text-blue-800' },
      'admin': { label: 'Administrateur', className: 'bg-red-100 text-red-800' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, className: 'bg-gray-100 text-gray-800' };

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean | number) => {
    const isUserActive = Boolean(isActive);
    return (
      <Badge variant={isUserActive ? "default" : "secondary"} className={isUserActive ? "bg-green-500" : "bg-gray-500"}>
        {isUserActive ? 'Actif' : 'Inactif'}
      </Badge>
    );
  };

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun utilisateur trouvé.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : ''}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{user.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role && getRoleBadge(user.role)}
              </TableCell>
              <TableCell>
                {getStatusBadge(user.is_active)}
              </TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  
                  {Boolean(user.is_active) ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:bg-red-50 border-red-200"
                      onClick={() => deactivateMutation.mutate(user.id)}
                      disabled={deactivateMutation.isPending}
                    >
                      <Lock className="h-4 w-4 mr-1" />
                      Bloquer
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 hover:bg-green-50 border-green-200"
                      onClick={() => activateMutation.mutate(user.id)}
                      disabled={activateMutation.isPending}
                    >
                      <Unlock className="h-4 w-4 mr-1" />
                      Débloquer
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
