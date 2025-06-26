// CertificateCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/components/ui/use-toast";
import { useRef } from "react";

interface CertificateCardProps {
  id: string;
  courseTitle: string;
  studentName: string;
  instructor: string;
  issueDate: Date; // 👉 ajoute issueDate dans les props
  onDownload?: () => void;
}

const CertificateCard = ({
  id,
  courseTitle,
  studentName,
  instructor,
  issueDate, // 👈 récupère issueDate ici
  onDownload
}: CertificateCardProps) => {
  const { toast } = useToast();
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
      return;
    }

    if (!certRef.current) {
      toast({ title: "Erreur", description: "Certificat non trouvé.", variant: "destructive" });
      return;
    }

    try {
      toast({
        title: "Préparation du certificat",
        description: "Génération en cours...",
      });

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;

      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`certificat-${courseTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`);

      toast({
        title: "Succès",
        description: "Le certificat a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      toast({
        title: "Erreur",
        description: "Échec lors de la génération du certificat.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card ref={certRef} className="overflow-hidden hover:shadow-lg transition-shadow bg-white p-6 rounded-lg">
      <CardHeader className="bg-primary text-white">
        <CardTitle className="text-xl flex items-center">
          <Award className="mr-2 h-5 w-5" />
          Certificat d'accomplissement
        </CardTitle>
        <CardDescription className="text-white/80">
          ID: CERT-{id}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-serif mb-1">{studentName}</h3>
          <p className="text-gray-500">a complété avec succès</p>
          <h2 className="text-xl font-semibold mt-2 mb-1">{courseTitle}</h2>
          <p className="text-gray-500">dispensé par {instructor}</p>
        </div>
        
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
          <div>
            <p>Date d'obtention</p>
            <p className="font-medium text-gray-700">{format(issueDate, 'dd MMMM yyyy')}</p> {/* 👈 utilise la vraie date */}
          </div>
          <div className="text-right">
            <p>Validité</p>
            <p className="font-medium text-gray-700">Permanente</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <Button 
          variant="outline" 
          className="ml-auto flex gap-2 items-center"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Télécharger PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;
