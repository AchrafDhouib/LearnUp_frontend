
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowUpDown, Download, Mail, Search, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TeacherStudents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([
    { id: 1, name: "Jean Dupont", email: "jean.dupont@example.com", course: "Introduction au développement web moderne", progress: 80 },
    { id: 2, name: "Marie Martin", email: "marie.martin@example.com", course: "Introduction au développement web moderne", progress: 65 },
    { id: 3, name: "Paul Bernard", email: "paul.bernard@example.com", course: "React.js pour les débutants", progress: 42 },
    { id: 4, name: "Sophie Laurent", email: "sophie.laurent@example.com", course: "React.js pour les débutants", progress: 90 },
    { id: 5, name: "Thomas Petit", email: "thomas.petit@example.com", course: "Introduction au développement web moderne", progress: 25 },
    { id: 6, name: "Claire Moreau", email: "claire.moreau@example.com", course: "Python pour la science des données", progress: 55 },
    { id: 7, name: "Lucas Dubois", email: "lucas.dubois@example.com", course: "Bases de données avec MySQL", progress: 72 },
    { id: 8, name: "Emma Richard", email: "emma.richard@example.com", course: "Développement mobile avec React Native", progress: 38 },
  ]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewStudentDetails = (studentId) => {
    const student = students.find(s => s.id === studentId);
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

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
            <CardTitle>Étudiants inscrits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      Nom
                      <ArrowUpDown className="h-3 w-3 ml-1 cursor-pointer" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.course}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              student.progress >= 70 ? 'bg-green-500' : 
                              student.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{student.progress}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600"
                          onClick={() => handleViewStudentDetails(student.id)}
                        >
                          Détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun étudiant trouvé
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal pour afficher les détails de l'étudiant */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Détails de l'étudiant</DialogTitle>
              <DialogDescription>
                Informations détaillées sur l'étudiant
              </DialogDescription>
            </DialogHeader>
            
            {selectedStudent && (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-primary-light flex items-center justify-center text-primary text-2xl font-bold">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 font-medium">Nom:</div>
                  <div className="col-span-2">{selectedStudent.name}</div>
                  
                  <div className="col-span-1 font-medium">Email:</div>
                  <div className="col-span-2">{selectedStudent.email}</div>
                  
                  <div className="col-span-1 font-medium">Cours:</div>
                  <div className="col-span-2">{selectedStudent.course}</div>
                  
                  <div className="col-span-1 font-medium">Progression:</div>
                  <div className="col-span-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div 
                        className={`h-2.5 rounded-full ${
                          selectedStudent.progress >= 70 ? 'bg-green-500' : 
                          selectedStudent.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedStudent.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{selectedStudent.progress}%</span>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Fermer
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(`mailto:${selectedStudent.email}`, '_blank');
                    }}
                    className="flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contacter
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