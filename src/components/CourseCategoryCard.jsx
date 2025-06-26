
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, GraduationCap, BarChart, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const CourseCategoryCard = ({
  id,
  name,
  description,
  icon,
  courseCount,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "BookOpen":
        return <BookOpen className="w-6 h-6 text-primary" />;
      case "Code":
        return <Code className="w-6 h-6 text-primary" />;
      case "GraduationCap":
        return <GraduationCap className="w-6 h-6 text-primary" />;
      case "BarChart":
        return <BarChart className="w-6 h-6 text-primary" />;
      case "Briefcase":
        return <Briefcase className="w-6 h-6 text-primary" />;
      default:
        return <BookOpen className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 hover:scale-105">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center mb-4">
          {renderIcon()}
        </div>
        <CardTitle className="text-xl mb-2 text-gray-800">{name}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{courseCount} cours</span>
          <Link to={`/category/${id}`}>
            <Button 
              variant="outline" 
              className="text-primary hover:bg-primary hover:text-white transition-colors duration-300"
            >
              Voir les cours
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCategoryCard;
