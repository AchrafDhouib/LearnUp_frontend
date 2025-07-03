import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, BookOpen, Award, Calendar, Mail, User, Lock, Unlock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getUser, activateUser, deactivateUser } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(Number(id)),
    enabled: !!id,
  });

  // Mutations for user activation/deactivation
  const activateMutation = useMutation({
    mutationFn: (userId: number) => activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
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
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Utilisateur désactivé",
        description: "L'utilisateur a été désactivé avec succès.",
      });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (isLoading) {
    return (
      <DashboardLayout userType="admin">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout userType="admin">
        <div className="text-center py-8">
          <p className="text-red-500">Erreur lors du chargement de l'utilisateur</p>
          <Button onClick={() => navigate('/admin/users')} className="mt-4">
            Retour à la liste
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isTeacher = user.role === 'teacher';
  const isStudent = user.role === 'student';

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/users')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{user.first_name} {user.last_name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getRoleBadge(user.role)}
            {getStatusBadge(user.is_active)}
            {Boolean(user.is_active) ? (
              <Button 
                variant="outline"
                className="text-red-600 hover:bg-red-50 border-red-200"
                onClick={() => deactivateMutation.mutate(user.id)}
                disabled={deactivateMutation.isPending}
              >
                <Lock className="h-4 w-4 mr-2" />
                Bloquer
              </Button>
            ) : (
              <Button 
                variant="outline"
                className="text-green-600 hover:bg-green-50 border-green-200"
                onClick={() => activateMutation.mutate(user.id)}
                disabled={activateMutation.isPending}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Débloquer
              </Button>
            )}
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nom complet</p>
                <p className="font-medium">{user.first_name} {user.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nom d'utilisateur</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Membre depuis</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(user.created_at)}
                </p>
              </div>
            </CardContent>
          </Card>

          {isTeacher && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Cours créés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {user.courses?.length || 0}
                </div>
                <p className="text-sm text-gray-600 mt-1">cours créés</p>
              </CardContent>
            </Card>
          )}

          {isStudent && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Examens réussis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {user.passed_exams?.length || 0}
                </div>
                <p className="text-sm text-gray-600 mt-1">examens réussis</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Groupes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {isTeacher ? (user.created_groups?.length || 0) : (user.groups?.length || 0)}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {isTeacher ? 'groupes créés' : 'groupes rejoints'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue={isTeacher ? "courses" : "exams"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {isTeacher ? (
              <>
                <TabsTrigger value="courses">Cours créés</TabsTrigger>
                <TabsTrigger value="groups">Groupes créés</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="exams">Examens réussis</TabsTrigger>
                <TabsTrigger value="groups">Groupes rejoints</TabsTrigger>
              </>
            )}
          </TabsList>
          
          {isTeacher ? (
            <>
              <TabsContent value="courses" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cours créés par {user.first_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.courses && user.courses.length > 0 ? (
                      <div className="space-y-4">
                        {user.courses.map((course: any) => (
                          <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{course.name}</h3>
                              <p className="text-sm text-gray-600">{course.description}</p>
                            </div>
                            <Badge variant={course.is_accepted === 1 ? "default" : course.is_accepted === 0 ? "destructive" : "secondary"}>
                              {course.is_accepted === 1 ? 'Approuvé' : course.is_accepted === 0 ? 'Rejeté' : 'En attente'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Aucun cours créé</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="groups" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Groupes créés par {user.first_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.created_groups && user.created_groups.length > 0 ? (
                      <div className="space-y-4">
                        {user.created_groups.map((group: any) => (
                          <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{group.name}</h3>
                              <p className="text-sm text-gray-600">{group.description}</p>
                              {group.course && (
                                <p className="text-xs text-blue-600">Cours: {group.course.name}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{group.students?.length || 0} étudiants</p>
                              <p className="text-xs text-gray-500">Max: {group.max_students}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Aucun groupe créé</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          ) : (
            <>
              <TabsContent value="exams" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Examens réussis par {user.first_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.passed_exams && user.passed_exams.length > 0 ? (
                      <div className="space-y-4">
                        {user.passed_exams.map((exam: any) => (
                          <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{exam.exam?.title || 'Examen'}</h3>
                              <p className="text-sm text-gray-600">
                                Score: {exam.score}/{exam.exam?.total_points || 100}
                              </p>
                              {exam.certification && (
                                <p className="text-xs text-green-600">Certification obtenue</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{exam.score}%</p>
                              <p className="text-xs text-gray-500">{formatDate(exam.created_at)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Aucun examen réussi</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="groups" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Groupes rejoints par {user.first_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.groups && user.groups.length > 0 ? (
                      <div className="space-y-4">
                        {user.groups.map((group: any) => (
                          <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{group.name}</h3>
                              <p className="text-sm text-gray-600">{group.description}</p>
                              {group.course && (
                                <p className="text-xs text-blue-600">Cours: {group.course.name}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">Par: {group.creator?.name}</p>
                              <p className="text-xs text-gray-500">{formatDate(group.created_at)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Aucun groupe rejoint</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserDetails; 