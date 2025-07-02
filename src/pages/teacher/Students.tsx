import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowUpDown, Download, Mail, Search, User, X, Users, GraduationCap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/userService";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: number;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  groups?: Array<{
    id: number;
    name: string;
    course?: {
      id: number;
      name: string;
    };
  }>;
  passed_exams?: Array<{
    id: number;
    exam: {
      id: number;
      description: string;
      course: {
        id: number;
        name: string;
      };
    };
    score: number;
    passed_at: string;
  }>;
  certifications?: Array<{
    id: number;
    name: string;
    course: {
      id: number;
      name: string;
    };
    issued_at: string;
  }>;
}

const TeacherStudents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch all students
  const { data: allUsers = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Filter students (users with role 'student') who are enrolled in teacher's courses
  const students = allUsers.filter((user: any) => user.role === 'student');

  const filteredStudents = students.filter((student: Student) => 
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  const calculateProgress = (student: Student) => {
    // Calculate progress based on passed exams vs total courses enrolled
    const totalCourses = student.groups?.length || 0;
    const completedCourses = student.passed_exams?.length || 0;
    
    if (totalCourses === 0) return 0;
    return Math.round((completedCourses / totalCourses) * 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes étudiants</h1>
            <p className="text-gray-500">Gérez les étudiants inscrits à vos cours.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <Skeleton className="h-10 w-80" />
            <div className="flex gap-2 w-full md:w-auto">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Étudiants inscrits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes étudiants</h1>
            <p className="text-gray-500">Gérez les étudiants inscrits à vos cours.</p>
          </div>

          <Card className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-6">
              Impossible de charger la liste des étudiants. Veuillez réessayer.
            </p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes étudiants</h1>
          <p className="text-gray-500">Gérez les étudiants inscrits à vos cours.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un étudiant..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex items-center whitespace-nowrap">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" className="flex items-center whitespace-nowrap">
              <Mail className="h-4 w-4 mr-2" />
              Contacter tous
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Étudiants inscrits ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStudents.length > 0 ? (
              <div className="border rounded-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                        Nom
                        <ArrowUpDown className="h-3 w-3 ml-1 cursor-pointer" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours inscrits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student: Student) => {
                      const progress = calculateProgress(student);
                      return (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold">
                                {(student.first_name?.[0] || '') + (student.last_name?.[0] || '')}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.first_name} {student.last_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student.groups?.length || 0} cours
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${getProgressColor(progress)}`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{progress}%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-600"
                              onClick={() => handleViewStudentDetails(student)}
                            >
                              Détails
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? 'Aucun étudiant trouvé' : 'Aucun étudiant inscrit à vos cours'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal pour afficher les détails de l'étudiant */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'étudiant</DialogTitle>
              <DialogDescription>
                Informations détaillées sur l'étudiant
              </DialogDescription>
            </DialogHeader>
            
            {selectedStudent && (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-primary-light flex items-center justify-center text-primary text-2xl font-bold">
                    {(selectedStudent.first_name?.[0] || '') + (selectedStudent.last_name?.[0] || '')}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="font-medium">Nom complet:</div>
                    <div>{selectedStudent.first_name} {selectedStudent.last_name}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium">Email:</div>
                    <div>{selectedStudent.email}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium">Cours inscrits:</div>
                    <div>{selectedStudent.groups?.length || 0} cours</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium">Progression:</div>
                    <div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div 
                          className={`h-2.5 rounded-full ${getProgressColor(calculateProgress(selectedStudent))}`}
                          style={{ width: `${calculateProgress(selectedStudent)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{calculateProgress(selectedStudent)}%</span>
                    </div>
                  </div>
                </div>

                {/* Cours inscrits */}
                {selectedStudent.groups && selectedStudent.groups.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-medium flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Cours inscrits:
                    </div>
                    <div className="space-y-1">
                      {selectedStudent.groups.map((group) => (
                        <Badge key={group.id} variant="outline" className="mr-2 mb-2">
                          {group.course?.name || group.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examens réussis */}
                {selectedStudent.passed_exams && selectedStudent.passed_exams.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-medium">Examens réussis:</div>
                    <div className="space-y-1">
                      {selectedStudent.passed_exams.map((exam) => (
                        <div key={exam.id} className="text-sm bg-green-50 p-2 rounded">
                          <div className="font-medium">{exam.exam.course.name}</div>
                          <div className="text-gray-600">Score: {exam.score}%</div>
                          <div className="text-gray-500 text-xs">
                            Réussi le {new Date(exam.passed_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {selectedStudent.certifications && selectedStudent.certifications.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-medium">Certifications obtenues:</div>
                    <div className="space-y-1">
                      {selectedStudent.certifications.map((cert) => (
                        <div key={cert.id} className="text-sm bg-blue-50 p-2 rounded">
                          <div className="font-medium">{cert.name}</div>
                          <div className="text-gray-600">{cert.course.name}</div>
                          <div className="text-gray-500 text-xs">
                            Obtenue le {new Date(cert.issued_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudents;