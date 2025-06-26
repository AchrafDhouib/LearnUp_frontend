
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, ArrowLeft, Save } from "lucide-react";
import { courseCategories } from "@/data/mockData";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([{ title: "", content: "", duration: "" }]);

  const addLesson = () => {
    setLessons([...lessons, { title: "", content: "", duration: "" }]);
  };

  const removeLesson = (index) => {
    const updatedLessons = [...lessons];
    updatedLessons.splice(index, 1);
    setLessons(updatedLessons);
  };

  const handleSaveCourse = () => {
    // Simuler l'enregistrement du cours
    alert("Cours enregistré avec succès!");
    navigate("/teacher/courses");
  };

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4" 
            onClick={() => navigate("/teacher/courses")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Créer un nouveau cours</h1>
            <p className="text-gray-500">Remplissez le formulaire ci-dessous pour créer votre cours.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>
              Entrez les détails principaux de votre cours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Titre du cours</Label>
              <Input 
                id="title" 
                placeholder="Exemple: Introduction au développement web moderne" 
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Décrivez votre cours de manière détaillée..."
                className="min-h-[120px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="level">Niveau</Label>
                <Select>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Débutant">Débutant</SelectItem>
                    <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="Avancé">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prix (€)</Label>
                <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="duration">Durée totale (heures)</Label>
                <Input id="duration" type="number" min="0" step="0.5" placeholder="1.5" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="image">Image du cours (URL)</Label>
              <Input id="image" placeholder="https://example.com/image.jpg" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contenu du cours</CardTitle>
            <CardDescription>
              Ajoutez les leçons qui composent votre cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lessons.map((lesson, index) => (
              <div key={index} className="mb-8 pb-8 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Leçon {index + 1}</h3>
                  {lessons.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeLesson(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`lesson-title-${index}`}>Titre de la leçon</Label>
                    <Input 
                      id={`lesson-title-${index}`} 
                      value={lesson.title}
                      onChange={(e) => {
                        const updatedLessons = [...lessons];
                        updatedLessons[index].title = e.target.value;
                        setLessons(updatedLessons);
                      }}
                      placeholder="Exemple: Introduction aux bases du HTML"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`lesson-content-${index}`}>Contenu</Label>
                    <Textarea 
                      id={`lesson-content-${index}`}
                      value={lesson.content}
                      onChange={(e) => {
                        const updatedLessons = [...lessons];
                        updatedLessons[index].content = e.target.value;
                        setLessons(updatedLessons);
                      }}
                      className="min-h-[100px]"
                      placeholder="Détaillez le contenu de votre leçon..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`lesson-duration-${index}`}>Durée (minutes)</Label>
                    <Input 
                      id={`lesson-duration-${index}`}
                      type="number"
                      min="1"
                      value={lesson.duration}
                      onChange={(e) => {
                        const updatedLessons = [...lessons];
                        updatedLessons[index].duration = e.target.value;
                        setLessons(updatedLessons);
                      }}
                      placeholder="30"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={addLesson}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une leçon
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline"
            onClick={() => navigate("/teacher/courses")}
          >
            Annuler
          </Button>
          <Button onClick={handleSaveCourse}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer le cours
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateCourse;
