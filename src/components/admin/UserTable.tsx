
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { User } from "@/types/user";
import { activateUser, deactivateUser } from "@/services/userService";
import { useMutation } from "@tanstack/react-query";
import { Eye, UserCheck, UserX } from "lucide-react";

interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
  });

  // Handle user status toggle
  const handleUserStatusChange = (user: User) => {
    if (user.is_active) {
      deactivateMutation.mutate(user.id);
    } else {
      activateMutation.mutate(user.id);
    }
  };

  // Format the date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user: User) => (
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
                  {user.role && user.role.map((r) => (
                    <span 
                      key={r}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-1 ${
                        r === 'teacher' ? 'bg-purple-100 text-purple-800' : 
                        r === 'admin' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {r === 'teacher' ? 'Enseignant' : 
                       r === 'admin' ? 'Administrateur' : 'Étudiant'}
                    </span>
                  ))}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={Boolean(user.is_active)} 
                      onCheckedChange={() => handleUserStatusChange(user)}
                    />
                    <span className={`text-xs font-medium ${
                      user.is_active ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="mr-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleUserStatusChange(user)}
                  >
                    {user.is_active ? (
                      <UserX className="h-4 w-4 mr-1 text-red-500" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-1 text-green-500" />
                    )}
                    {user.is_active ? 'Désactiver' : 'Activer'}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Aucun utilisateur trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
