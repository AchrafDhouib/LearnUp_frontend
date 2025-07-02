import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourse } from "@/services/courseService";
import { createLesson, updateLesson, deleteLesson } from "@/services/lessonService";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Trash2, Edit, X, Video, File } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCourse } from "@/services/courseService";
import { getSpecialties } from "@/services/specialtyService";

const TeacherEditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const courseId = parseInt(id || "0");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    speciality_id: "",
    cours_url: "",
    image: "",
    price: "",
    discount: "",
  });

  const [lessons, setLessons] = useState([{ 
    title: "", 
    content: "", 
    duration: "",
    url_video: "",
    url_pdf: ""
  }]);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
  });

  const { data: specialities = [], isLoading: isLoadingSpecialities, error: specialitiesError } = useQuery({
    queryKey: ['specialities'],
    queryFn: getSpecialties,
    retry: 3,
    retryDelay: 1000,
  });

  // Debug logging for specialties
  useEffect(() => {
    console.log("Specialities loaded in teacher edit:", specialities);
    if (specialitiesError) {
      console.error("Specialities error in teacher edit:", specialitiesError);
    }
  }, [specialities, specialitiesError]);

  useEffect(() => {
    if (course) {
      console.log("Course data loaded:", course); // Debug log
      console.log("Speciality ID:", course.speciality_id); // Debug log
      console.log("Speciality object:", course.speciality); // Debug log
      console.log("Available specialities:", specialities); // Debug log
      
      // Check if the specialty exists in the dropdown
      const specialtyExists = specialities.some((s: any) => s.id === course.speciality_id);
      console.log("Specialty exists in dropdown:", specialtyExists);
      
      setFormData({
        name: course.name || "",
        description: course.description || "",
        speciality_id: course.speciality_id && specialtyExists ? String(course.speciality_id) : "",
        cours_url: course.cours_url || "",
        image: course.image || "",
        price: course.price ? String(course.price) : "",
        discount: course.discount ? String(course.discount) : "",
      });
      
      if (course.lessons && course.lessons.length > 0) {
        console.log("Loading lessons:", course.lessons); // Debug log
        setLessons(course.lessons.map((lesson: any) => ({
          title: lesson.title || "",
          content: lesson.content || "",
          duration: lesson.duration ? String(lesson.duration) : "",
          url_video: lesson.url_video || "",
          url_pdf: lesson.url_pdf || "",
        })));
      } else {
        setLessons([{ title: "", content: "", duration: "", url_video: "", url_pdf: "" }]);
      }
    }
  }, [course, specialities]);

  // Course update mutation
  const updateMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      toast({
        title: "Succès",
        description: "Le cours a été mis à jour avec succès.",
      });
      navigate(`/teacher/courses/${courseId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de mettre à jour le cours.",
        variant: "destructive",
      });
    }
  });

  // Lesson mutations
  const createLessonMutation = useMutation({
    mutationFn: (lessonData: any) => createLesson(courseId, lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      toast({
        title: "Succès",
        description: "La leçon a été ajoutée avec succès.",
      });
      // Reset the form
      setLessons([{ title: "", content: "", duration: "", url_video: "", url_pdf: "" }]);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible d'ajouter la leçon.",
        variant: "destructive",
      });
    }
  });

  const updateLessonMutation = useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: number; data: any }) => 
      updateLesson(courseId, lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      toast({
        title: "Succès",
        description: "La leçon a été mise à jour avec succès.",
      });
      setEditingLessonIndex(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de mettre à jour la leçon.",
        variant: "destructive",
      });
    }
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: number) => deleteLesson(courseId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      toast({
        title: "Succès",
        description: "La leçon a été supprimée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de supprimer la leçon.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addLesson = () => {
    setLessons([...lessons, { title: "", content: "", duration: "", url_video: "", url_pdf: "" }]);
  };

  const removeLesson = (index: number) => {
    if (lessons.length > 1) {
      const updatedLessons = [...lessons];
      updatedLessons.splice(index, 1);
      setLessons(updatedLessons);
    }
  };

  const updateLesson = (index: number, field: string, value: string) => {
    const updatedLessons = [...lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setLessons(updatedLessons);
  };

  const handleEditLesson = (index: number) => {
    const lesson = course?.lessons?.[index];
    if (lesson) {
      setEditingLesson({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        url_video: lesson.url_video || "",
        url_pdf: lesson.url_pdf || "",
      });
      setEditingLessonIndex(index);
    }
  };

  const handleCancelEdit = () => {
    setEditingLessonIndex(null);
    setEditingLesson(null);
  };

  const handleSaveLesson = () => {
    if (editingLesson && editingLesson.title.trim() && editingLesson.description.trim()) {
      const lessonData = {
        title: editingLesson.title,
        description: editingLesson.description,
        duration: parseInt(editingLesson.duration) || 0,
        url_video: editingLesson.url_video || null,
        url_pdf: editingLesson.url_pdf || null,
      };
      
      updateLessonMutation.mutate({ lessonId: editingLesson.id, data: lessonData });
    }
  };

  const handleDeleteLesson = (lessonId: number) => {
    deleteLessonMutation.mutate(lessonId);
  };

  const handleSubmitNewLesson = () => {
    const lesson = lessons[0]; // We'll use the first lesson as the new lesson form
    if (lesson.title.trim() && lesson.content.trim()) {
      const lessonData = {
        title: lesson.title,
        description: lesson.content,
        duration: parseInt(lesson.duration) || 0,
        url_video: lesson.url_video || null,
        url_pdf: lesson.url_pdf || null,
      };
      
      createLessonMutation.mutate(lessonData);
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le titre et le contenu de la leçon.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitCourse = (e: React.FormEvent) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      speciality_id: parseInt(formData.speciality_id),
      price: formData.price ? parseFloat(formData.price) : null,
      discount: formData.discount ? parseFloat(formData.discount) : null,
    };
    
    updateMutation.mutate(courseData);
  };



  if (isLoading) {
    return (
      <DashboardLayout userType="teacher">
        <div className="space-y-6">
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

  if (!course) {
    return (
      <DashboardLayout userType="teacher">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cours non trouvé</h2>
          <p className="text-gray-600 mb-6">Le cours que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate("/teacher/courses")}>
            Retour à mes cours
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4" 
            onClick={() => navigate(`/teacher/courses/${courseId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Modifier le cours</h1>
            <p className="text-gray-500">Modifiez les informations de votre cours</p>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Détails du cours</TabsTrigger>
            <TabsTrigger value="lessons">Leçons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du cours</CardTitle>
                <CardDescription>
                  Modifiez les détails de votre cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitCourse} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nom du cours</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nom du cours"
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
                      placeholder="Description du cours"
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
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une spécialité" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialitiesError ? (
                            <SelectItem value="error" disabled>
                              Erreur de chargement des spécialités
                            </SelectItem>
                          ) : specialities.length > 0 ? (
                            specialities.map((speciality: any) => (
                              <SelectItem key={speciality.id} value={speciality.id.toString()}>
                                {speciality.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="loading" disabled>
                              Chargement des spécialités...
                            </SelectItem>
                          )}
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

                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Mise à jour..." : "Mettre à jour le cours"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/teacher/courses/${courseId}`)}
                    >
                      Annuler
                    </Button>
                  </div>
                  
                  {/* Quiz Management Section */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Gestion du quiz</h4>
                    <div className="flex gap-2">
                      {course?.exam ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate(`/teacher/quizzes/${course.exam.id}/edit`)}
                        >
                          Modifier quiz
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate(`/teacher/create-quiz?courseId=${courseId}`)}
                        >
                          Ajouter quiz
                        </Button>
                      )}
                    </div>
                    {course?.exam && (
                      <p className="text-sm text-gray-500 mt-2">
                        Ce cours a déjà un quiz associé. Cliquez sur "Modifier quiz" pour le modifier.
                      </p>
                    )}
                    {!course?.exam && (
                      <p className="text-sm text-gray-500 mt-2">
                        Ce cours n'a pas encore de quiz. Cliquez sur "Ajouter quiz" pour en créer un.
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lessons">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des leçons</CardTitle>
                <CardDescription>
                  Ajoutez, modifiez ou supprimez les leçons pour le cours "{course?.name}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Form for adding new lesson */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h4 className="font-medium">Ajouter une nouvelle leçon</h4>
                    
                    <div>
                      <Label htmlFor="new-lesson-title">Titre de la leçon</Label>
                      <Input
                        id="new-lesson-title"
                        value={lessons[0].title}
                        onChange={(e) => updateLesson(0, 'title', e.target.value)}
                        placeholder="Titre de la leçon"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-lesson-content">Contenu de la leçon</Label>
                      <Textarea
                        id="new-lesson-content"
                        value={lessons[0].content}
                        onChange={(e) => updateLesson(0, 'content', e.target.value)}
                        placeholder="Contenu détaillé de la leçon..."
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="new-lesson-duration">Durée (en minutes)</Label>
                      <Input
                        id="new-lesson-duration"
                        type="number"
                        value={lessons[0].duration}
                        onChange={(e) => updateLesson(0, 'duration', e.target.value)}
                        placeholder="30"
                        min="1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-lesson-video">URL Vidéo (optionnel)</Label>
                        <Input
                          id="new-lesson-video"
                          type="url"
                          value={lessons[0].url_video}
                          onChange={(e) => updateLesson(0, 'url_video', e.target.value)}
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="new-lesson-pdf">URL PDF (optionnel)</Label>
                        <Input
                          id="new-lesson-pdf"
                          type="url"
                          value={lessons[0].url_pdf}
                          onChange={(e) => updateLesson(0, 'url_pdf', e.target.value)}
                          placeholder="https://example.com/document.pdf"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleSubmitNewLesson}
                      disabled={createLessonMutation.isPending}
                    >
                      {createLessonMutation.isPending ? "Ajout en cours..." : "Ajouter la leçon"}
                    </Button>
                  </div>

                  {/* Display existing lessons */}
                  {course?.lessons && course.lessons.length > 0 && (
                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">Leçons existantes</h4>
                      
                      {/* Edit form for existing lesson */}
                      {editingLesson && (
                        <div className="border rounded-lg p-4 space-y-4 mb-4 bg-blue-50">
                          <h5 className="font-medium">Modifier la leçon</h5>
                          
                          <div>
                            <Label htmlFor="edit-lesson-title">Titre de la leçon</Label>
                            <Input
                              id="edit-lesson-title"
                              value={editingLesson.title}
                              onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})}
                              placeholder="Titre de la leçon"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="edit-lesson-description">Contenu de la leçon</Label>
                            <Textarea
                              id="edit-lesson-description"
                              value={editingLesson.description}
                              onChange={(e) => setEditingLesson({...editingLesson, description: e.target.value})}
                              placeholder="Contenu détaillé de la leçon..."
                              className="min-h-[100px]"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="edit-lesson-duration">Durée (en minutes)</Label>
                            <Input
                              id="edit-lesson-duration"
                              type="number"
                              value={editingLesson.duration}
                              onChange={(e) => setEditingLesson({...editingLesson, duration: e.target.value})}
                              placeholder="30"
                              min="1"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-lesson-video">URL Vidéo (optionnel)</Label>
                              <Input
                                id="edit-lesson-video"
                                type="url"
                                value={editingLesson.url_video}
                                onChange={(e) => setEditingLesson({...editingLesson, url_video: e.target.value})}
                                placeholder="https://example.com/video.mp4"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="edit-lesson-pdf">URL PDF (optionnel)</Label>
                              <Input
                                id="edit-lesson-pdf"
                                type="url"
                                value={editingLesson.url_pdf}
                                onChange={(e) => setEditingLesson({...editingLesson, url_pdf: e.target.value})}
                                placeholder="https://example.com/document.pdf"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={handleSaveLesson}
                              disabled={updateLessonMutation.isPending}
                            >
                              {updateLessonMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {course.lessons.map((lesson: any, index: number) => (
                          <div key={lesson.id} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium">Leçon {index + 1}: {lesson.title}</h5>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditLesson(index)}
                                  disabled={editingLessonIndex === index}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="text-red-500 border-red-200 hover:bg-red-50"
                                  disabled={deleteLessonMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600">{lesson.description}</p>
                            <p className="text-sm text-gray-500">Durée: {lesson.duration} minutes</p>
                            
                            {/* Visual indicators for available resources */}
                            {(lesson.url_video || lesson.url_pdf) && (
                              <div className="flex gap-3 text-xs text-gray-500">
                                {lesson.url_video && (
                                  <span className="flex items-center">
                                    <Video className="h-3 w-3 mr-1" /> Vidéo disponible
                                  </span>
                                )}
                                {lesson.url_pdf && (
                                  <span className="flex items-center">
                                    <File className="h-3 w-3 mr-1" /> PDF disponible
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherEditCourse; 