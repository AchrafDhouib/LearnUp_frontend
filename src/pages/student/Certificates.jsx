import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CertificateCard from "@/components/CertificateCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCertifications } from "@/services/certificationService";

const StudentCertificates = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Get certifications
  const { data: certifications, isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: getCertifications
  });

  // Filter certificates based on search query
  const filteredCertificates = certifications?.filter(cert => 
    cert.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.certificate_number?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <DashboardLayout userType="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes certificats</h1>
          <p className="text-gray-500">Consultez et téléchargez vos certificats de réussite.</p>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un certificat..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gray-500 mt-2">Chargement des certificats...</p>
            </CardContent>
          </Card>
        ) : filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCertificates.map((cert) => (
              <CertificateCard 
                key={cert.id}
                id={cert.id}
                courseTitle={cert.course_name}
                studentName={cert.student_name}
                issueDate={cert.issued_date}
                instructor={cert.instructor_name}
                score={cert.score}
                certificateNumber={cert.certificate_number}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <GraduationCap className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">
                {searchQuery ? "Aucun certificat trouvé" : "Aucun certificat"}
              </h3>
              <p className="text-gray-500 text-center mt-2">
                {searchQuery 
                  ? `Aucun certificat ne correspond à "${searchQuery}"`
                  : "Complétez vos cours et réussissez les quiz pour obtenir des certificats"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
