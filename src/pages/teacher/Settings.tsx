import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenSquare, Camera, Lock, User, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { updateUser, changePassword } from "@/services/userService";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

const TeacherSettings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || "",
        first_name: parsedUser.first_name || "",
        last_name: parsedUser.last_name || "",
        email: parsedUser.email || "",
      });
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => updateUser(user?.id || 0, data),
    onSuccess: (updatedUser) => {
      // Update user data in localStorage
      const newUserData = { ...user, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData as User);

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => changePassword(data),
    onSuccess: () => {
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setShowPasswordForm(false);
      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été modifié avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de modifier le mot de passe.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate(passwordData);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`http://localhost:8000/api/users/${user?.id}/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update avatar');
      }

      const data = await response.json();
      const avatarUrl = data.avatar;
      
      // Update user avatar in localStorage
      const updatedUser = { ...user, avatar: avatarUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser as User);

      toast({
        title: "Avatar mis à jour",
        description: "Votre photo de profil a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error("Failed to update avatar:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la photo de profil.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="teacher">
        <div className="flex justify-center items-center h-64">
          <p>Chargement du profil...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout userType="teacher">
        <div className="flex justify-center items-center h-64">
          <Alert>
            <AlertDescription>
              Impossible de charger les informations du profil.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="teacher">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
          <p className="text-gray-500">
            Consultez et modifiez vos informations personnelles
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Photo de profil */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Photo de profil
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div
                  className="relative cursor-pointer group"
                  onClick={handleAvatarClick}
                >
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={user?.avatar ? `http://localhost:8000/storage/${user.avatar}` : undefined}
                      alt={user?.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarClick}
                  className="w-full"
                >
                  Changer la photo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Informations personnelles */}
          <div className="md:col-span-2 space-y-6">
            {/* Profil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenSquare className="h-5 w-5 mr-2" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom d'utilisateur</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom d'utilisateur"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre.email@example.com"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="w-full"
                  >
                    {updateProfileMutation.isPending ? "Mise à jour..." : "Mettre à jour le profil"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator />

            {/* Mot de passe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showPasswordForm ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Modifiez votre mot de passe pour sécuriser votre compte.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      Changer le mot de passe
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Mot de passe actuel</Label>
                      <Input
                        id="current_password"
                        name="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        placeholder="Votre mot de passe actuel"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new_password">Nouveau mot de passe</Label>
                      <Input
                        id="new_password"
                        name="new_password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        placeholder="Votre nouveau mot de passe"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new_password_confirmation">Confirmer le nouveau mot de passe</Label>
                      <Input
                        id="new_password_confirmation"
                        name="new_password_confirmation"
                        type="password"
                        value={passwordData.new_password_confirmation}
                        onChange={handlePasswordChange}
                        placeholder="Confirmez votre nouveau mot de passe"
                        required
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={changePasswordMutation.isPending}
                      >
                        {changePasswordMutation.isPending ? "Modification..." : "Modifier le mot de passe"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({
                            current_password: "",
                            new_password: "",
                            new_password_confirmation: "",
                          });
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherSettings;