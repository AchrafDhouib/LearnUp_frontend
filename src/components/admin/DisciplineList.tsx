
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookUser } from "lucide-react";
import { Discipline } from "@/types/discipline";
import { useNavigate } from "react-router-dom";

interface DisciplineListProps {
  disciplines: Discipline[];
}

const DisciplineList = ({ disciplines }: DisciplineListProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-4">
      {disciplines.map((discipline) => (
        <div key={discipline.id} className="flex items-center p-4 border rounded-lg">
          <div className="flex-shrink-0 h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
            <BookUser className="h-6 w-6 text-primary" />
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="font-medium">{discipline.name}</h3>
            <p className="text-gray-500 text-sm">{discipline.description}</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/admin/disciplines/edit/${discipline.id}`)}
            >
              Modifier
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/admin/disciplines/${discipline.id}`)}
            >
              Voir
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisciplineList;
