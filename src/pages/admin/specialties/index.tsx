
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSpecialties } from "@/services/specialtyService";
import DashboardLayout from "@/components/DashboardLayout";
import SpecialtyList from "@/components/admin/SpecialtyList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const SpecialtiesIndex = () => {
  const navigate = useNavigate();
  
  // Use state for search/filter functionality
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch specialties data
  const { data: specialties = [], isLoading } = useQuery({
    queryKey: ["specialties"],
    queryFn: getSpecialties,
  });

  // Filter specialties if search implemented
  const filteredSpecialties = searchTerm
    ? specialties.filter((specialty) =>
        specialty.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : specialties;

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Spécialités</h1>
            <p className="text-gray-500">
              Gérez les spécialités disponibles sur la plateforme
            </p>
          </div>
          <Button onClick={() => navigate("/admin/specialties/create")}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une spécialité
          </Button>
        </div>

        <div className="relative">
          <Input
            placeholder="Rechercher des spécialités..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <SpecialtyList specialties={filteredSpecialties} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SpecialtiesIndex;
