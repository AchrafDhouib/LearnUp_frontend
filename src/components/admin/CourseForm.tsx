import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCourse, updateCourse, getCourse } from "@/services/courseService";
import { getSpecialties } from "@/services/specialtyService";
import { getActiveTeachers } from "@/services/userService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Course schema validation
const courseSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  speciality_id: z.string().min(1, "Veuillez sélectionner une spécialité"),
  creator_id: z.string().min(1, "Veuillez sélectionner un enseignant"),
  image: z.string().optional(),
  cours_url: z.string().optional(),
  price: z.string().optional(),
  discount: z.string().optional(),
});

interface CourseFormProps {
  courseId?: number;
  isEdit?: boolean;
}

const CourseForm = ({ courseId, isEdit = false }: CourseFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form definition
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      speciality_id: "",
      creator_id: "",
      image: "",
      cours_url: "",
      price: "",
      discount: "",
    },
  });

  // Get specialties for dropdown
  const { data: specialties = [], isLoading: isLoadingSpecialties, error: specialtiesError } = useQuery({
    queryKey: ["specialties"],
    queryFn: getSpecialties,
    retry: 3,
    retryDelay: 1000,
  });

  // Get active teachers for dropdown
  const { data: teachers = [], isLoading: isLoadingTeachers, error: teachersError } = useQuery({
    queryKey: ["activeTeachers"],
    queryFn: getActiveTeachers,
    retry: 3,
    retryDelay: 1000,
  });

  // Debug logging
  useEffect(() => {
    console.log("Specialties loaded:", specialties);
    console.log("Teachers loaded:", teachers);
    if (specialtiesError) {
      console.error("Specialties error:", specialtiesError);
    }
    if (teachersError) {
      console.error("Teachers error:", teachersError);
    }
  }, [specialties, teachers, specialtiesError, teachersError]);

  // If editing, fetch course data
  const { data: courseData, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseId ? getCourse(courseId) : null,
    enabled: !!courseId && isEdit,
  });

  // Update form when course data is loaded
  useEffect(() => {
    if (courseData && isEdit) {
      console.log("Loading course data for edit:", courseData); // Debug log
      console.log("Speciality ID:", courseData.speciality_id); // Debug log
      console.log("Creator ID:", courseData.creator_id); // Debug log
      console.log("Available specialties:", specialties); // Debug log
      console.log("Available teachers:", teachers); // Debug log
      
      // Check if the specialty and teacher exist in the dropdowns
      const specialtyExists = specialties.some((s: any) => s.id === courseData.speciality_id);
      const teacherExists = teachers.some((t: any) => t.id === courseData.creator_id);
      
      console.log("Specialty exists in dropdown:", specialtyExists);
      console.log("Teacher exists in dropdown:", teacherExists);
      
      form.reset({
        name: courseData.name || "",
        description: courseData.description || "",
        speciality_id: courseData.speciality_id && specialtyExists ? String(courseData.speciality_id) : "",
        creator_id: courseData.creator_id && teacherExists ? String(courseData.creator_id) : "",
        image: courseData.image || "",
        cours_url: courseData.cours_url || "",
        price: courseData.price ? String(courseData.price) : "",
        discount: courseData.discount ? String(courseData.discount) : "",
      });
    }
  }, [courseData, isEdit, form, specialties, teachers]);

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Le cours a été créé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      navigate("/admin/courses");
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du cours",
        variant: "destructive",
      });
      console.error("Error creating course:", error);
    },
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateCourse(id, data),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Le cours a été mis à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      navigate("/admin/courses");
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour du cours",
        variant: "destructive",
      });
      console.error("Error updating course:", error);
    },
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof courseSchema>) => {
    const courseData = {
      ...data,
      speciality_id: parseInt(data.speciality_id),
      creator_id: parseInt(data.creator_id),
      price: data.price ? parseFloat(data.price) : null,
      discount: data.discount ? parseFloat(data.discount) : null,
    };

    if (isEdit && courseId) {
      updateCourseMutation.mutate({ id: courseId, data: courseData });
    } else {
      createCourseMutation.mutate(courseData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-4" 
          onClick={() => navigate("/admin/courses")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isEdit ? "Modifier le cours" : "Créer un nouveau cours"}
          </h1>
          <p className="text-gray-500">
            {isEdit 
              ? "Modifiez les informations du cours existant" 
              : "Remplissez le formulaire ci-dessous pour créer votre cours"
            }
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Entrez les détails principaux du cours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du cours</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Introduction au développement web moderne" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez votre cours de manière détaillée..." 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="speciality_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spécialité</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une spécialité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialtiesError ? (
                            <SelectItem value="error" disabled>
                              Erreur de chargement des spécialités
                            </SelectItem>
                          ) : specialties.length > 0 ? (
                            specialties.map((specialty: any) => (
                              <SelectItem 
                                key={specialty.id} 
                                value={String(specialty.id)}
                              >
                                {specialty.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-specialty" disabled>
                              Chargement des spécialités...
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="creator_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enseignant</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un enseignant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachersError ? (
                            <SelectItem value="error" disabled>
                              Erreur de chargement des enseignants
                            </SelectItem>
                          ) : teachers.length > 0 ? (
                            teachers.map((teacher: any) => (
                              <SelectItem 
                                key={teacher.id} 
                                value={String(teacher.id)}
                              >
                                {teacher.name} ({teacher.email})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-teacher" disabled>
                              Chargement des enseignants...
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image du cours (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cours_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL du cours (PDF/Matériel)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/course-material.pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix (optionnel)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remise (%) (optionnel)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate("/admin/courses")}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoadingCourse || createCourseMutation.isPending || updateCourseMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoadingCourse || createCourseMutation.isPending || updateCourseMutation.isPending
                ? "Chargement..."
                : isEdit ? "Enregistrer les modifications" : "Créer le cours"
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CourseForm;
