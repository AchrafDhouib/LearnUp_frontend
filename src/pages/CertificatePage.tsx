
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Course, getCourseById } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

const CertificatePage = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Information du certificat (simulée, à remplacer par des données de votre API)
  const [certificateData] = useState({
    id: `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    studentName: "Jean Dupont",
    issueDate: new Date(),
    validUntil: "Permanente",
  });

  useEffect(() => {
    if (id) {
      // Simuler un appel API à votre backend Laravel
      const fetchedCourse = getCourseById(id);
      
      if (fetchedCourse) {
        setCourse(fetchedCourse);
      }
      
      setLoading(false);
    }
  }, [id]);

  const handleDownload = () => {
    // Logique de téléchargement du certificat (à remplacer par un appel à votre API)
    toast({
      title: "Certificat téléchargé",
      description: "Votre certificat a été téléchargé avec succès.",
    });
  };

  const handleShare = () => {
    // Logique de partage du certificat (à remplacer par un appel à votre API)
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Lien copié",
      description: "Le lien vers votre certificat a été copié dans le presse-papier.",
    });
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Chargement du certificat...</h2>
          <p className="text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center text-gray-600"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Votre certificat d'accomplissement</h1>
            <p className="text-gray-600">
              Félicitations pour avoir terminé avec succès le cours et réussi l'évaluation finale !
            </p>
          </div>
          
          {/* Certificat */}
          <Card className="relative overflow-hidden border-8 border-double border-primary/20 p-8 mb-8 bg-white">
            {/* Filigrane */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="text-9xl font-serif font-bold text-gray-900 transform -rotate-30">CERTIFIÉ</div>
            </div>
            
            {/* Contenu du certificat */}
            <div className="relative z-10 text-center">
              <div className="mb-8">
                <h2 className="text-lg text-gray-600 mb-1">LearnUp</h2>
                <div className="w-32 h-1 bg-primary mx-auto"></div>
              </div>
              
              <h2 className="text-3xl font-serif mb-8">Certificat d'accomplissement</h2>
              
              <p className="text-gray-600 mb-6">Ce certificat est décerné à</p>
              <h3 className="text-4xl font-serif font-bold mb-6">{certificateData.studentName}</h3>
              
              <p className="text-gray-600 mb-2">pour avoir complété avec succès</p>
              <h4 className="text-2xl font-medium mb-8">{course.title}</h4>
              
              <p className="text-gray-600 mb-1">Dispensé par</p>
              <p className="text-xl mb-8">{course.instructor}</p>
              
              <div className="flex justify-between items-center mt-12">
                <div className="text-left">
                  <p className="text-sm text-gray-500">ID du certificat</p>
                  <p className="font-medium">{certificateData.id}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Date d'émission</p>
                  <p className="font-medium">{certificateData.issueDate.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Validité</p>
                  <p className="font-medium">{certificateData.validUntil}</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Télécharger PDF
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
            <Link to="/student/dashboard">
              <Button className="bg-primary hover:bg-primary-dark">
                Retour au tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
