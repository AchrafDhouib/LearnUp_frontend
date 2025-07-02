import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, ArrowLeft, Save } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createCourse } from "@/services/courseService";
import { getSpecialties } from "@/services/specialtyService";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const CreateCourse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [teacherId, setTeacherId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    speciality_id: "",
    cours_url: "",
    image: "",
    price: "",
    discount: "",
  });

  const [lessons, setLessons] = useState([{ title: "", content: "", duration: "" }]);

  // Get teacher ID from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setTeacherId(user.id);
    }
  }, []);

  // Fetch specialities
  const { data: specialities = [], isLoading: isLoadingSpecialities } = useQuery({
    queryKey: ['specialities'],
    queryFn: getSpecialties,
  });

  // Create course mutation
  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      toast({
        title: "Cours créé",
        description: "Le cours a été créé avec succès.",
      });
      navigate("/teacher/courses");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de créer le cours.",
        variant: "destructive",
      });
    }
  });

  const addLesson = () => {
    setLessons([...lessons, { title: "", content: "", duration: "" }]);
  };

  const removeLesson = (index: number) => {
    const updatedLessons = [...lessons];
    updatedLessons.splice(index, 1);
    setLessons(updatedLessons);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCourse = () => {
    if (!teacherId) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations de l'enseignant.",
        variant: "destructive",
      });
      return;
    }

    const courseData = {
      ...formData,
      creator_id: teacherId,
      price: formData.price ? parseFloat(formData.price) : null,
      discount: formData.discount ? parseFloat(formData.discount) : null,
    };

    createMutation.mutate(courseData);
  };

  if (isLoadingSpecialities) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-8">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 mr-4" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

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
              <Label htmlFor="name">Nom du cours</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Exemple: Introduction au développement web moderne" 
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez votre cours de manière détaillée..."
                className="min-h-[120px]"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="speciality_id">Spécialité</Label>
                <Select
                  value={formData.speciality_id}
                  onValueChange={(value) => handleSelectChange('speciality_id', value)}
                >
                  <SelectTrigger id="speciality_id">
                    <SelectValue placeholder="Sélectionner une spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialities.map((speciality: any) => (
                      <SelectItem key={speciality.id} value={speciality.id.toString()}>
                        {speciality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cours_url">URL du matériel</Label>
                <Input 
                  id="cours_url"
                  name="cours_url"
                  value={formData.cours_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/material"
                  type="url"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="image">Image du cours (URL)</Label>
              <Input 
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prix (optionnel)</Label>
                <Input 
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="discount">Remise (%) (optionnel)</Label>
                <Input 
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>
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
              onClick={addLesson}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une leçon
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button 
            onClick={handleSaveCourse}
            disabled={createMutation.isPending}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {createMutation.isPending ? "Création..." : "Créer le cours"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/teacher/courses")}
          >
            Annuler
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateCourse;
