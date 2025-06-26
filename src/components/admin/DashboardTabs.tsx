
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserTable from "./UserTable";
import DisciplineList from "./DisciplineList";
import SpecialtyList from "./SpecialtyList";
import CourseList from "./CourseList";
import TeacherList from "./TeacherList";
import StudentList from "./StudentList";
import { User } from "@/types/user";
import { Discipline } from "@/types/discipline";
import { Specialty } from "@/types/specialty";
import { Course } from "@/types/course";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, BookUser, Book } from "lucide-react";

interface DashboardTabsProps {
  users: User[];
  disciplines: Discipline[];
  specialties: Specialty[];
  courses: Course[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const DashboardTabs = ({
  users,
  disciplines,
  specialties,
  courses,
  currentTab,
  setCurrentTab
}: DashboardTabsProps) => {
  const navigate = useNavigate();

  const tabs = [
    { id: "users", name: "Utilisateurs", icon: <Users className="h-4 w-4 mr-2" /> },
    { id: "teachers", name: "Enseignants", icon: <GraduationCap className="h-4 w-4 mr-2" /> },
    { id: "students", name: "Étudiants", icon: <Users className="h-4 w-4 mr-2" /> },
    { id: "disciplines", name: "Disciplines", icon: <BookUser className="h-4 w-4 mr-2" /> },
    { id: "specialties", name: "Spécialités", icon: <BookUser className="h-4 w-4 mr-2" /> },
    { id: "courses", name: "Cours", icon: <Book className="h-4 w-4 mr-2" /> },
  ];

  return (
    <Tabs defaultValue={currentTab} value={currentTab} onValueChange={setCurrentTab}>
      <TabsList className="mb-4 flex flex-wrap">
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
            {tab.icon}
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="users" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>
          <Button variant="outline">Exporter</Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <UserTable users={users} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="teachers" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Gestion des Enseignants</h2>
          <Button variant="outline">Exporter</Button>
        </div>
        <TeacherList />
      </TabsContent>
      
      <TabsContent value="students" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Gestion des Étudiants</h2>
          <Button variant="outline">Exporter</Button>
        </div>
        <StudentList />
      </TabsContent>
      
      <TabsContent value="disciplines" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Liste des disciplines</h2>
          <Button onClick={() => navigate('/admin/disciplines/create')}>
            Ajouter une discipline
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <DisciplineList disciplines={disciplines} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="specialties" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Liste des spécialités</h2>
          <Button onClick={() => navigate('/admin/specialties/create')}>
            Ajouter une spécialité
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <SpecialtyList specialties={specialties} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="courses" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Liste des cours</h2>
          <Button onClick={() => navigate('/admin/courses/create')}>
            Ajouter un cours
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <CourseList courses={courses} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
