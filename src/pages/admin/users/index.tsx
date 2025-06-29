import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Search, Plus, Users, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { getUsers } from "@/services/userService";
import { User } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import UserTable from "@/components/admin/UserTable";

type UserRole = "student" | "teacher";

const UsersIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<UserRole>("student");

  // Fetch users data
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Filter users by role and search term
  const getFilteredUsers = (role: UserRole) => {
    let filtered = users.filter((user: User) => user.role === role);
    
    if (searchTerm) {
      filtered = filtered.filter((user: User) => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const students = getFilteredUsers("student");
  const teachers = getFilteredUsers("teacher");

  const getStatusCount = (role: UserRole, isActive: boolean) => {
    const roleUsers = users.filter((user: User) => user.role === role);
    return roleUsers.filter((user: User) => Boolean(user.is_active) === isActive).length;
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          
          <Button onClick={() => navigate('/admin/users/create')}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un utilisateur
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Étudiants</p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Enseignants</p>
                  <p className="text-2xl font-bold">{teachers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold">
                    {getStatusCount("student", true) + getStatusCount("teacher", true)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inactifs</p>
                  <p className="text-2xl font-bold">
                    {getStatusCount("student", false) + getStatusCount("teacher", false)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <Input
            placeholder="Rechercher des utilisateurs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserRole)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Étudiants ({students.length})
            </TabsTrigger>
            <TabsTrigger value="teacher" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Enseignants ({teachers.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="student" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex items-center p-4 border rounded-lg">
                        <Skeleton className="h-12 w-12 rounded-full mr-4" />
                        <div className="space-y-2 flex-grow">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[150px]" />
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <UserTable users={students} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teacher" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex items-center p-4 border rounded-lg">
                        <Skeleton className="h-12 w-12 rounded-full mr-4" />
                        <div className="space-y-2 flex-grow">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[150px]" />
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <UserTable users={teachers} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UsersIndex;