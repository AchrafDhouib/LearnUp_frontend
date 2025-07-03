import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Share2, 
  Trophy, 
  Award, 
  Calendar,
  User,
  BookOpen,
  CheckCircle,
  Star
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getCertification } from "@/services/certificationService";
import DashboardLayout from "@/components/DashboardLayout";

interface Certification {
  id: number;
  certificate_number: string;
  student_name: string;
  course_name: string;
  instructor_name: string;
  score: number;
  required_score: number;
  issued_date: string;
  validity_period: string;
  achievement_description: string;
  passed_exam: {
    id: number;
    exam: {
      id: number;
      title: string;
      course: {
        id: number;
        name: string;
        description: string;
        creator: {
          id: number;
          name: string;
          email: string;
        };
      };
    };
  };
}

const CertificatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: certification, isLoading, error } = useQuery({
    queryKey: ['certification', id],
    queryFn: () => id ? getCertification(parseInt(id)) : null,
    enabled: !!id
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Lien copié",
      description: "Le lien vers votre certificat a été copié dans le presse-papier.",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Chargement du certificat...</h2>
            <p className="text-gray-500">Veuillez patienter</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !certification) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Certificat non trouvé</h2>
            <p className="text-gray-500">Le certificat demandé n'existe pas ou n'est pas accessible.</p>
            <Button 
              className="mt-4"
              onClick={() => navigate('/student/certificates')}
            >
              Retour aux certificats
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isExcellent = certification.score >= 90;
  const isGood = certification.score >= 80;
  const isPassed = certification.score >= certification.required_score;

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/student/certificates')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux certificats
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Certificat d'accomplissement</h1>
              <p className="text-gray-500">Votre réussite est reconnue officiellement</p>
            </div>
          </div>
        </div>

        {/* Certificate */}
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-indigo-100 p-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 border-8 border-blue-500 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-6 border-indigo-500 rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border-4 border-purple-500 rounded-full -translate-x-8 -translate-y-8"></div>
          </div>

          {/* Certificate Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">LearnUp</h2>
                  <p className="text-sm text-gray-600">Plateforme d'apprentissage en ligne</p>
                </div>
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
            </div>

            {/* Main Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">
                Certificat d'accomplissement
              </h1>
              <p className="text-lg text-gray-600">
                Ce certificat est décerné en reconnaissance de l'achèvement réussi
              </p>
            </div>

            {/* Student Name */}
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-2">à</p>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {certification.student_name}
              </h2>
              <p className="text-gray-600">pour avoir complété avec succès</p>
            </div>

            {/* Course Details */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {certification.course_name}
              </h3>
              <div className="flex items-center justify-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {certification.instructor_name}
                </span>
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {certification.passed_exam.exam.title}
                </span>
              </div>
            </div>

            {/* Score and Achievement */}
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {Math.round(certification.score)}%
                  </div>
                  <p className="text-sm text-gray-600">Score obtenu</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {Math.round(certification.required_score)}%
                  </div>
                  <p className="text-sm text-gray-600">Score requis</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    {isExcellent ? (
                      <Star className="h-8 w-8 text-yellow-500 fill-current" />
                    ) : isGood ? (
                      <Award className="h-8 w-8 text-green-500" />
                    ) : (
                      <CheckCircle className="h-8 w-8 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {isExcellent ? 'Excellence' : isGood ? 'Très bien' : 'Réussi'}
                  </p>
                </div>
              </div>
            </div>

            {/* Achievement Description */}
            <div className="text-center mb-8">
              <p className="text-gray-700 leading-relaxed">
                {certification.achievement_description}
              </p>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <p className="text-gray-500 mb-1">Numéro de certificat</p>
                <p className="font-mono font-medium">{certification.certificate_number}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 mb-1">Date d'émission</p>
                <p className="font-medium">
                  {new Date(certification.issued_date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 mb-1">Validité</p>
                <p className="font-medium">{certification.validity_period}</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-32 h-0.5 bg-gray-400 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Signature du directeur</p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-0.5 bg-gray-400 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Signature de l'instructeur</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Partager
          </Button>
          <Link to="/student/dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Retour au tableau de bord
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CertificatePage;
