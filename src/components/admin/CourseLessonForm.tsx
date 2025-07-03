import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLesson, updateLesson, deleteLesson } from "@/services/lessonService";
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
import { PlusCircle, Trash2, FileText, Video, File } from "lucide-react";

const lessonSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  duration: z.string().min(1, "Veuillez spécifier une durée"),
  url_video: z.string().optional(),
  url_pdf: z.string().optional(),
});

interface CourseLessonFormProps {
  courseId: number;
  lessons?: any[];
  onLessonsUpdated?: () => void;
}

const CourseLessonForm = ({ courseId, lessons = [], onLessonsUpdated }: CourseLessonFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);

  // Form definition
  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      url_video: "",
      url_pdf: "",
    },
  });

  // Create lesson mutation
  const createLessonMutation = useMutation({
    mutationFn: (data: any) => createLesson(courseId, data),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "La leçon a été ajoutée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      form.reset();
      if (onLessonsUpdated) onLessonsUpdated();
    },
  });

  // Update lesson mutation
  const updateLessonMutation = useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: number; data: any }) => 
      updateLesson(courseId, lessonId, data),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "La leçon a été mise à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      setEditingLessonId(null);
      form.reset();
      if (onLessonsUpdated) onLessonsUpdated();
    },
  });

  // Delete lesson mutation
  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: number) => deleteLesson(courseId, lessonId),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "La leçon a été supprimée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      if (onLessonsUpdated) onLessonsUpdated();
    },
  });

  // Form submission handler
  const onSubmit = (data: z.infer<typeof lessonSchema>) => {
    const lessonData = {
      ...data,
      duration: parseInt(data.duration),
    };
    
    if (editingLessonId) {
      updateLessonMutation.mutate({ lessonId: editingLessonId, data: lessonData });
    } else {
      createLessonMutation.mutate(lessonData);
    }
  };

  // Edit lesson handler
  const handleEditLesson = (lesson: any) => {
    setEditingLessonId(lesson.id);
    form.reset({
      title: lesson.title,
      description: lesson.description,
      duration: String(lesson.duration),
      url_video: lesson.url_video || "",
      url_pdf: lesson.url_pdf || "",
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingLessonId(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {editingLessonId ? "Modifier la leçon" : "Ajouter une nouvelle leçon"}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la leçon</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Introduction aux bases du HTML" {...field} />
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
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Détaillez le contenu de votre leçon..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url_video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Vidéo </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/video.mp4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url_pdf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL PDF </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/document.pdf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-3">
              {editingLessonId && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancelEdit}
                >
                  Annuler
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
              >
                {editingLessonId ? "Mettre à jour la leçon" : "Ajouter la leçon"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Leçons du cours</h2>
        {lessons && lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div 
                key={lesson.id || index} 
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-medium">
                        Leçon {index + 1}: {lesson.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{lesson.duration} minutes</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditLesson(lesson)}
                    >
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteLessonMutation.mutate(lesson.id)}
                      disabled={deleteLessonMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm mt-2 line-clamp-2">{lesson.description}</p>
                
                <div className="flex mt-3 text-xs text-gray-500">
                  {lesson.url_video && (
                    <span className="flex items-center mr-3">
                      <Video className="h-3 w-3 mr-1" /> Vidéo disponible
                    </span>
                  )}
                  {lesson.url_pdf && (
                    <span className="flex items-center">
                      <File className="h-3 w-3 mr-1" /> PDF disponible
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
            Aucune leçon ajoutée pour ce cours. Utilisez le formulaire ci-dessus pour ajouter des leçons.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLessonForm;
