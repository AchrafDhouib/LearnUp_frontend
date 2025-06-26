
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  bgColor?: string;
}

const StatsCard = ({ icon, title, value, bgColor = "bg-gray-100" }: StatsCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex items-center pt-6">
        <div className={`mr-4 p-2 rounded-full ${bgColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
