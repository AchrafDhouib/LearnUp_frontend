
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const StudentSettings = () => {
  const [isEmailNotifications, setIsEmailNotifications] = useState(true);
  const [isPublicProfile, setIsPublicProfile] = useState(false);

  return (
    <DashboardLayout userType="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-gray-500">Gérez vos préférences et paramètres de compte.</p>
        </div>

        <Tabs defaultValue="notifications">
          <TabsList className="mb-8">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="language">Langue</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Configurez comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-gray-500">Recevez des emails concernant votre activité</p>
                  </div>
                  <Switch 
                    checked={isEmailNotifications} 
                    onCheckedChange={setIsEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouveaux cours</p>
                    <p className="text-sm text-gray-500">Soyez notifié quand de nouveaux cours sont disponibles</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappels de quiz</p>
                    <p className="text-sm text-gray-500">Soyez notifié des quiz à compléter et de leurs échéances</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Messagerie</p>
                    <p className="text-sm text-gray-500">Soyez notifié des nouveaux messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de confidentialité</CardTitle>
                <CardDescription>
                  Gérez qui peut voir vos informations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profil public</p>
                    <p className="text-sm text-gray-500">Votre profil sera visible par les autres étudiants et enseignants</p>
                  </div>
                  <Switch 
                    checked={isPublicProfile} 
                    onCheckedChange={setIsPublicProfile}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Afficher les certificats</p>
                    <p className="text-sm text-gray-500">Vos certificats seront visibles sur votre profil public</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Afficher les cours suivis</p>
                    <p className="text-sm text-gray-500">Vos cours seront visibles sur votre profil public</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Thème</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 justify-start">
                      <Badge className="bg-white text-black border">
                        <span className="sr-only">Light</span>
                      </Badge>
                      <span className="ml-2">Clair</span>
                    </Button>
                    <Button variant="outline" className="flex-1 justify-start">
                      <Badge className="bg-gray-950 text-white">
                        <span className="sr-only">Dark</span>
                      </Badge>
                      <span className="ml-2">Sombre</span>
                    </Button>
                    <Button variant="outline" className="flex-1 justify-start">
                      <Badge className="bg-gradient-to-r from-white to-gray-950">
                        <span className="sr-only">System</span>
                      </Badge>
                      <span className="ml-2">Système</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Langue</CardTitle>
                <CardDescription>
                  Choisissez votre langue préférée
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Select defaultValue="fr">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentSettings;
