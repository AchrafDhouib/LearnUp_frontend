import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { PlusCircle, Edit, Trash2, Users, Calendar, DollarSign, BookOpen, Eye, UserPlus } from "lucide-react";
import { getGroups, createGroup, updateGroup, deleteGroup, addUserToGroup, removeUserFromGroup, getGroupsByCreator, Group } from "@/services/groupService";
import { getUsersByRole } from "@/services/userService";
import { getCoursesByCreatorQuery } from "@/services/courseService";
import { Course } from "@/types/course";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const TeacherGroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cour_id: '',
    start_date: '',
    end_date: '',
    max_students: '',
    image: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsData, coursesData] = await Promise.all([
        getGroupsByCreator(user?.id || 0),
        getCoursesByCreatorQuery(user?.id)
      ]);
      setGroups(groupsData);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const groupData = {
        ...formData,
        creator_id: user?.id,
        cour_id: parseInt(formData.cour_id),
        max_students: formData.max_students ? parseInt(formData.max_students) : undefined,
      };

      await createGroup(groupData);
      toast({
        title: "Succès",
        description: "Groupe créé avec succès",
      });
      setIsCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le groupe",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      const groupData = {
        ...formData,
        cour_id: parseInt(formData.cour_id),
        max_students: formData.max_students ? parseInt(formData.max_students) : undefined,
      };

      await updateGroup(selectedGroup.id, groupData);
      toast({
        title: "Succès",
        description: "Groupe mis à jour avec succès",
      });
      setIsEditDialogOpen(false);
      setSelectedGroup(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error updating group:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le groupe",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await deleteGroup(groupId);
      toast({
        title: "Succès",
        description: "Groupe supprimé avec succès",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le groupe",
        variant: "destructive",
      });
    }
  };

  const handleEditGroup = async (group: Group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      cour_id: group.cour_id.toString(),
      start_date: group.start_date || '',
      end_date: group.end_date || '',
      max_students: group.max_students?.toString() || '',
      image: group.image || ''
    });
    
    // Fetch available students (students who are not in this group)
    try {
      setLoadingStudents(true);
      console.log('Fetching students for group:', group.id);
      const allStudents = await getUsersByRole('student');
      console.log('All students fetched:', allStudents);
      const enrolledStudentIds = group.students?.map(s => s.id) || [];
      console.log('Enrolled student IDs:', enrolledStudentIds);
      const available = allStudents.filter((student: any) => !enrolledStudentIds.includes(student.id));
      console.log('Available students:', available);
      setAvailableStudents(available);
    } catch (error) {
      console.error('Error fetching students:', error);
      setAvailableStudents([]);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des étudiants",
        variant: "destructive",
      });
    } finally {
      setLoadingStudents(false);
    }
    
    setIsEditDialogOpen(true);
  };

  const handleViewGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cour_id: '',
      start_date: '',
      end_date: '',
      max_students: '',
      image: ''
    });
  };

  const handleAddStudent = async () => {
    if (!selectedStudentId || !selectedGroup) return;
    
    try {
      await addUserToGroup(selectedGroup.id, parseInt(selectedStudentId));
      toast({
        title: "Succès",
        description: "Étudiant ajouté au groupe",
      });
      setSelectedStudentId('');
      // Refresh the group data
      const updatedGroup = await getGroupsByCreator(user?.id || 0);
      const currentGroup = updatedGroup.find((g: Group) => g.id === selectedGroup.id);
      if (currentGroup) {
        setSelectedGroup(currentGroup);
      }
      // Update available students
      const enrolledStudentIds = currentGroup?.students?.map(s => s.id) || [];
      const available = availableStudents.filter(student => !enrolledStudentIds.includes(student.id));
      setAvailableStudents(available);
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'étudiant",
        variant: "destructive",
      });
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!selectedGroup) return;
    
    try {
      await removeUserFromGroup(selectedGroup.id, studentId);
      toast({
        title: "Succès",
        description: "Étudiant retiré du groupe",
      });
      // Refresh the group data
      const updatedGroup = await getGroupsByCreator(user?.id || 0);
      const currentGroup = updatedGroup.find((g: Group) => g.id === selectedGroup.id);
      if (currentGroup) {
        setSelectedGroup(currentGroup);
      }
      // Update available students
      const removedStudent = selectedGroup.students?.find(s => s.id === studentId);
      if (removedStudent) {
        setAvailableStudents([...availableStudents, removedStudent]);
      }
    } catch (error) {
      console.error('Error removing student:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer l'étudiant",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getTeacherGroups = () => {
    return groups.filter(group => group.creator_id === user?.id);
  };

  if (loading) {
    return (
      <DashboardLayout userType="teacher">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  const teacherGroups = getTeacherGroups();

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des groupes</h1>
            <p className="text-gray-500">Créez et gérez vos groupes d'étudiants</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-dark">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouveau groupe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau groupe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du groupe</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom du groupe"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description du groupe"
                  />
                </div>
                <div>
                  <Label htmlFor="course">Cours associé</Label>
                  <Select value={formData.cour_id} onValueChange={(value) => setFormData({ ...formData, cour_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Date de début</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">Date de fin</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="max_students">Nombre max d'étudiants</Label>
                  <Input
                    id="max_students"
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                    placeholder="Illimité"
                  />
                </div>
                <div>
                  <Label htmlFor="image">URL de l'image (optionnel)</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateGroup}>
                    Créer le groupe
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center pt-6">
              <div className="mr-4 p-2 rounded-full bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total groupes</p>
                <p className="text-2xl font-semibold">{teacherGroups.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center pt-6">
              <div className="mr-4 p-2 rounded-full bg-green-100">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cours actifs</p>
                <p className="text-2xl font-semibold">{courses.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center pt-6">
              <div className="mr-4 p-2 rounded-full bg-purple-100">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">En cours</p>
                <p className="text-2xl font-semibold">
                  {teacherGroups.filter(g => g.start_date && g.end_date && 
                    new Date() >= new Date(g.start_date) && new Date() <= new Date(g.end_date)).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center pt-6">
              <div className="mr-4 p-2 rounded-full bg-orange-100">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenus totaux</p>
                <p className="text-2xl font-semibold">
                  {teacherGroups.reduce((sum, group) => {
                    const coursePrice = group.course?.price || 0;
                    const discount = group.course?.discount || 0;
                    const finalPrice = coursePrice * (1 - discount / 100);
                    return sum + finalPrice;
                  }, 0).toFixed(2)}€
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Groups Table */}
        <Card>
          <CardHeader>
            <CardTitle>Mes groupes</CardTitle>
          </CardHeader>
          <CardContent>
            {teacherGroups.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun groupe créé</h3>
                <p className="text-gray-500 mb-4">Commencez par créer votre premier groupe d'étudiants</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Créer un groupe
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Cours</TableHead>
                      <TableHead>Étudiants</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{group.name}</div>
                            {group.description && (
                              <div className="text-sm text-gray-500">{group.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {group.course?.title || 'Cours non trouvé'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">
                              {group.students?.length || 0} étudiants
                            </Badge>
                            {group.max_students && (
                              <span className="text-sm text-gray-500">
                                / {group.max_students}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {group.start_date && group.end_date ? (
                            <div className="text-sm">
                              <div>{formatDate(group.start_date)}</div>
                              <div className="text-gray-500">à {formatDate(group.end_date)}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Non définie</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {group.course?.price ? (
                            <span className="font-medium">
                              {group.course.price}€
                              {group.course.discount && (
                                <span className="text-sm text-green-600 ml-1">
                                  (-{group.course.discount}%)
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-gray-500">Gratuit</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewGroup(group)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditGroup(group)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer le groupe</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer le groupe "{group.name}" ? 
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteGroup(group.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Modifier le groupe</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Détails du groupe</TabsTrigger>
                <TabsTrigger value="students">Gestion des étudiants</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nom du groupe</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom du groupe"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du groupe"
                />
              </div>
              <div>
                <Label htmlFor="edit-course">Cours associé</Label>
                <Select value={formData.cour_id} onValueChange={(value) => setFormData({ ...formData, cour_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un cours" />
                  </SelectTrigger>
                  <SelectContent>
                                          {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-start-date">Date de début</Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-end-date">Date de fin</Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-max-students">Nombre max d'étudiants</Label>
                <Input
                  id="edit-max-students"
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                  placeholder="Illimité"
                />
              </div>
              <div>
                <Label htmlFor="edit-image">URL de l'image (optionnel)</Label>
                <Input
                  id="edit-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdateGroup}>
                  Mettre à jour
                </Button>
              </div>
              </TabsContent>
              
              <TabsContent value="students" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-4">Étudiants inscrits ({selectedGroup?.students?.length || 0})</h3>
                  
                  {/* Add Student Section */}
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-3">Ajouter un étudiant</h4>
                    {loadingStudents ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500">Chargement des étudiants...</p>
                      </div>
                    ) : availableStudents.length > 0 ? (
                      <div className="flex gap-2">
                        <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Sélectionner un étudiant" />
                          </SelectTrigger>
                          <SelectContent>
                                                      {availableStudents.map((student) => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                              {student.first_name && student.last_name 
                                ? `${student.first_name} ${student.last_name}`
                                : student.name
                              } ({student.email})
                            </SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAddStudent} disabled={!selectedStudentId}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-2">Aucun étudiant disponible à ajouter</p>
                        <p className="text-sm text-gray-400">Tous les étudiants sont déjà inscrits dans ce groupe ou il n'y a pas d'étudiants dans le système.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Students List */}
                  {selectedGroup?.students && selectedGroup.students.length > 0 ? (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Étudiant</TableHead>
                            <TableHead>Nom complet</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedGroup.students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={student.avatar} alt={student.name} />
                                    <AvatarFallback className="text-xs">
                                      {(student.first_name?.[0] || '') + (student.last_name?.[0] || '')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{student.name}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {student.first_name && student.last_name 
                                  ? `${student.first_name} ${student.last_name}`
                                  : student.name
                                }
                              </TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Retirer
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Retirer l'étudiant</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir retirer {student.first_name && student.last_name 
                                          ? `${student.first_name} ${student.last_name}`
                                          : student.name
                                        } du groupe ?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleRemoveStudent(student.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Retirer
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun étudiant inscrit</h3>
                      <p className="text-gray-500">Ajoutez des étudiants à ce groupe en utilisant le formulaire ci-dessus.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Détails du groupe</DialogTitle>
            </DialogHeader>
            {selectedGroup && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Informations générales</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Nom:</span> {selectedGroup.name}
                      </div>
                      <div>
                        <span className="font-medium">Description:</span> {selectedGroup.description || 'Aucune description'}
                      </div>
                      <div>
                        <span className="font-medium">Cours:</span> {selectedGroup.course?.title || 'Cours non trouvé'}
                      </div>
                      <div>
                        <span className="font-medium">Prix:</span> {selectedGroup.course?.price ? (
                          <span>
                            {selectedGroup.course.price}€
                            {selectedGroup.course.discount && (
                              <span className="text-sm text-green-600 ml-1">
                                (-{selectedGroup.course.discount}%)
                              </span>
                            )}
                          </span>
                        ) : 'Gratuit'}
                      </div>
                      <div>
                        <span className="font-medium">Capacité:</span> {selectedGroup.students?.length || 0} / {selectedGroup.max_students || 'Illimité'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Période</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Date de début:</span> {selectedGroup.start_date ? formatDate(selectedGroup.start_date) : 'Non définie'}
                      </div>
                      <div>
                        <span className="font-medium">Date de fin:</span> {selectedGroup.end_date ? formatDate(selectedGroup.end_date) : 'Non définie'}
                      </div>
                      <div>
                        <span className="font-medium">Créé le:</span> {formatDate(selectedGroup.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Étudiants inscrits ({selectedGroup.students?.length || 0})</h3>
                  {selectedGroup.students && selectedGroup.students.length > 0 ? (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Étudiant</TableHead>
                            <TableHead>Nom complet</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedGroup.students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={student.avatar} alt={student.name} />
                                    <AvatarFallback className="text-xs">
                                      {(student.first_name?.[0] || '') + (student.last_name?.[0] || '')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{student.name}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {student.first_name && student.last_name 
                                  ? `${student.first_name} ${student.last_name}`
                                  : student.name
                                }
                              </TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-red-600">
                                      Retirer
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Retirer l'étudiant</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir retirer {student.first_name && student.last_name 
                                          ? `${student.first_name} ${student.last_name}`
                                          : student.name
                                        } du groupe ?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          removeUserFromGroup(selectedGroup.id, student.id);
                                          setIsViewDialogOpen(false);
                                          fetchData();
                                        }}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Retirer
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun étudiant inscrit dans ce groupe.</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeacherGroupsPage;
