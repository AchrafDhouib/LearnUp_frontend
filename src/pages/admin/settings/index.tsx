import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { updateUser, changePassword } from "@/services/userService";
import { Loader2, User, Lock, Settings } from "lucide-react";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  name: string;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

const SettingsPage = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile form
  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      name: "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  // Update form values when user data is available
  useEffect(() => {
    if (user) {
      profileForm.reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        name: user.name || "",
      });
    }
  }, [user, profileForm]);

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => updateUser(user?.id!, data),
    onSuccess: (response) => {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations de profil ont été mises à jour avec succès.",
      });
      
      // Update the auth context with new user data
      if (updateAuthUser) {
        updateAuthUser(response.user);
      }
      
      // Reset password form
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur s'est produite lors de la mise à jour du profil.",
        variant: "destructive",
      });
    }
  });

  // Password change mutation
  const passwordMutation = useMutation({
    mutationFn: (data: PasswordFormData) => changePassword(user?.id!, data),
    onSuccess: () => {
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });
      
      // Reset password form
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur s'est produite lors du changement de mot de passe.",
        variant: "destructive",
      });
    }
  });

  const handleProfileSubmit = (data: ProfileFormData) => {
    profileMutation.mutate(data);
  };

  const handlePasswordSubmit = (data: PasswordFormData) => {
    if (data.new_password !== data.new_password_confirmation) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    
    passwordMutation.mutate(data);
  };

  if (!user) {
    return (
      <DashboardLayout userType="admin">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-gray-500">
            Gérez vos paramètres de compte et de l'application.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="app" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Application
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de profil</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input 
                        id="first_name" 
                        {...profileForm.register("first_name", { required: "Le prénom est requis" })}
                        disabled={profileMutation.isPending}
                      />
                      {profileForm.formState.errors.first_name && (
                        <p className="text-sm text-red-500">{profileForm.formState.errors.first_name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <Input 
                        id="last_name" 
                        {...profileForm.register("last_name", { required: "Le nom est requis" })}
                        disabled={profileMutation.isPending}
                      />
                      {profileForm.formState.errors.last_name && (
                        <p className="text-sm text-red-500">{profileForm.formState.errors.last_name.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom d'utilisateur</Label>
                    <Input 
                      id="name" 
                      {...profileForm.register("name", { required: "Le nom d'utilisateur est requis" })}
                      disabled={profileMutation.isPending}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...profileForm.register("email", { 
                        required: "L'email est requis",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Adresse email invalide"
                        }
                      })}
                      disabled={profileMutation.isPending}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={profileMutation.isPending}>
                    {profileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modifier le mot de passe</CardTitle>
                <CardDescription>
                  Mettez à jour votre mot de passe pour sécuriser votre compte.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Mot de passe actuel</Label>
                    <Input 
                      id="current_password" 
                      type="password" 
                      {...passwordForm.register("current_password", { required: "Le mot de passe actuel est requis" })}
                      disabled={passwordMutation.isPending}
                    />
                    {passwordForm.formState.errors.current_password && (
                      <p className="text-sm text-red-500">{passwordForm.formState.errors.current_password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_password">Nouveau mot de passe</Label>
                    <Input 
                      id="new_password" 
                      type="password" 
                      {...passwordForm.register("new_password", { 
                        required: "Le nouveau mot de passe est requis",
                        minLength: {
                          value: 8,
                          message: "Le mot de passe doit contenir au moins 8 caractères"
                        }
                      })}
                      disabled={passwordMutation.isPending}
                    />
                    {passwordForm.formState.errors.new_password && (
                      <p className="text-sm text-red-500">{passwordForm.formState.errors.new_password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_password_confirmation">Confirmer le mot de passe</Label>
                    <Input 
                      id="new_password_confirmation" 
                      type="password" 
                      {...passwordForm.register("new_password_confirmation", { required: "La confirmation du mot de passe est requise" })}
                      disabled={passwordMutation.isPending}
                    />
                    {passwordForm.formState.errors.new_password_confirmation && (
                      <p className="text-sm text-red-500">{passwordForm.formState.errors.new_password_confirmation.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={passwordMutation.isPending}>
                    {passwordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Changer le mot de passe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="app" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de l'application</CardTitle>
                <CardDescription>
                  Personnalisez votre expérience sur la plateforme.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Emails</p>
                      <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mises à jour du cours</p>
                      <p className="text-sm text-gray-500">Être notifié des nouvelles mises à jour</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Affichage</h3>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mode sombre</p>
                      <p className="text-sm text-gray-500">Activer le mode sombre</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Button disabled>Enregistrer les préférences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;