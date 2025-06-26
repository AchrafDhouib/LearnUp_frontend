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
import { getSpecialty, updateSpecialty } from "@/services/specialtyService";
import { getDisciplines } from "@/services/disciplineService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Specialty } from "@/types/specialty";

const EditSpecialty = () => {
  const { id } = useParams();
  const specialtyId = parseInt(id || '0');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: specialty, isLoading: isSpecialtyLoading } = useQuery({
    queryKey: ['specialty', specialtyId],
    queryFn: () => getSpecialty(specialtyId),
    enabled: !!specialtyId,
  });
  
  const { data: disciplines = [], isLoading: isDisciplinesLoading } = useQuery({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
  });
  
  const form = useForm<Partial<Specialty>>({
    defaultValues: {
      name: "",
      discipline_id: 0,
      description: "",
      image: "",
    },
  });

  // Set form values when specialty data is loaded
  useEffect(() => {
    if (specialty) {
      form.reset({
        name: specialty.name,
        discipline_id: specialty.discipline_id,
        description: specialty.description,
        image: specialty.image,
      });
    }
  }, [specialty, form]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Specialty>) => updateSpecialty(specialtyId, data),
    onSuccess: () => {
      toast({
        title: "Spécialité mise à jour",
        description: "La spécialité a été mise à jour avec succès.",
      });
      navigate("/admin/specialities");
    },
    onError: (error) => {
      console.error("Error updating specialty:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la spécialité.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: Partial<Specialty>) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  const isLoading = isSpecialtyLoading || isDisciplinesLoading;

  if (isLoading) {
    return (
      <DashboardLayout userType="admin">
        <p>Chargement des données...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Modifier la spécialité</h1>
          <Button variant="outline" onClick={() => navigate("/admin/specialities")}>
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
                        <Input placeholder="React JS" {...field} />
                      </FormControl>
                      <FormDescription>
                        Le nom de la spécialité.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discipline_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discipline</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value ? String(field.value) : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une discipline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {disciplines.map((discipline) => (
                            <SelectItem key={discipline.id} value={String(discipline.id)}>
                              {discipline.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        La discipline à laquelle appartient cette spécialité.
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
                          placeholder="Description de la spécialité..." 
                          {...field} 
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription>
                        Une description détaillée de la spécialité.
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
                        Nom de l'image pour la spécialité.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour la spécialité"}
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

export default EditSpecialty;
