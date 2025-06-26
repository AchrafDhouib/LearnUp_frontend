import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { getDiscipline, updateDiscipline } from "@/services/disciplineService";
import { Discipline } from "@/types/discipline";

const EditDiscipline = () => {
  const { id } = useParams();
  const disciplineId = parseInt(id || '0');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: discipline, isLoading } = useQuery({
    queryKey: ['discipline', disciplineId],
    queryFn: () => getDiscipline(disciplineId),
    enabled: !!disciplineId,
  });
  
  const form = useForm<Partial<Discipline>>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
  });

  // Set form values when discipline data is loaded
  useEffect(() => {
    if (discipline) {
      form.reset({
        name: discipline.name,
        description: discipline.description,
        image: discipline.image,
      });
    }
  }, [discipline, form]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Discipline>) => updateDiscipline(disciplineId, data),
    onSuccess: () => {
      toast({
        title: "Discipline mise à jour",
        description: "La discipline a été mise à jour avec succès.",
      });
      navigate("/admin/disciplines");
    },
    onError: (error) => {
      console.error("Error updating discipline:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la discipline.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: Partial<Discipline>) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="admin">
        <p>Chargement de la discipline...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Modifier la discipline</h1>
          <Button variant="outline" onClick={() => navigate("/admin/disciplines")}>
            Retour
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Développement Web" {...field} />
                      </FormControl>
                      <FormDescription>
                        Le nom de la discipline.
                      </FormDescription>
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
                          placeholder="Description de la discipline..." 
                          {...field} 
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription>
                        Une description détaillée de la discipline.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="nom-image.png" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nom de l'image pour la discipline.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour la discipline"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditDiscipline;