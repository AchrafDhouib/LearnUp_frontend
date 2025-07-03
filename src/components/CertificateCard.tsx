// CertificateCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { format } from "date-fns";
import { useRef } from "react";

interface CertificateCardProps {
  id: string;
  courseTitle: string;
  studentName: string;
  instructor: string;
  issueDate: string | Date;
  score?: number;
  certificateNumber?: string;
}

const CertificateCard = ({
  id,
  courseTitle,
  studentName,
  instructor,
  issueDate,
  score,
  certificateNumber
}: CertificateCardProps) => {
  const certRef = useRef<HTMLDivElement>(null);



  return (
    <Card ref={certRef} className="overflow-hidden hover:shadow-lg transition-shadow bg-white p-6 rounded-lg">
      <CardHeader className="bg-primary text-white">
        <CardTitle className="text-xl flex items-center">
          <Award className="mr-2 h-5 w-5" />
          Certificat d'accomplissement
        </CardTitle>
        <CardDescription className="text-white/80">
          ID: {certificateNumber || `CERT-${id}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-serif mb-1">{studentName}</h3>
          <p className="text-gray-500">a complété avec succès</p>
          <h2 className="text-xl font-semibold mt-2 mb-1">{courseTitle}</h2>
          <p className="text-gray-500">dispensé par {instructor}</p>
          {score && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Score obtenu</p>
              <p className="text-lg font-semibold text-green-600">{score}%</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
          <div>
            <p>Date d'obtention</p>
            <p className="font-medium text-gray-700">
              {format(new Date(issueDate), 'dd MMMM yyyy')}
            </p>
          </div>
          <div className="text-right">
            <p>Validité</p>
            <p className="font-medium text-gray-700">Permanente</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">

      </CardFooter>
    </Card>
  );
};

export default CertificateCard;
