
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: number | string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  duration: string;
  students: number;
  lessons: number;
  image: string;
}

const CourseCard = ({
  id,
  title,
  description,
  instructor,
  category,
  duration,
  students,
  lessons,
  image
}: CourseCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // Fallback si l'image ne peut pas être chargée
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Course";
          }}
        />
        <Badge className="absolute top-3 right-3 bg-primary hover:bg-primary-dark">
          {category}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
        <CardDescription className="text-sm">Par {instructor}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{students}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{lessons} leçons</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/course/${id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary-dark">
            Voir le cours
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
