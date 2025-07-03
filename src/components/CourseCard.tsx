import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen, Euro, User, Calendar, Star } from "lucide-react";
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
  price?: number;
  discount?: number;
  linkPath?: string;
  created_at?: string;
  rating?: number;
  totalReviews?: number;
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
  image,
  price,
  discount,
  linkPath,
  created_at,
  rating,
  totalReviews
}: CourseCardProps) => {
  // Convert price to number and handle undefined/null values
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Calculate discounted price
  const discountedPrice = numericPrice && discount && discount > 0 
    ? numericPrice - (numericPrice * discount / 100) 
    : numericPrice;

  // Check if there's a valid discount
  const hasDiscount = discount && discount > 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Course";
          }}
        />
        {/* Category Badge */}
        <Badge className="absolute top-3 right-3 bg-primary hover:bg-primary-dark text-white">
          {category}
        </Badge>
        {/* Discount Badge */}
        {hasDiscount && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white font-bold">
            -{discount}%
          </Badge>
        )}
        {/* Rating Badge */}
        {rating && rating > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <span className="text-xs font-medium">{rating.toFixed(1)}</span>
            {totalReviews && (
              <span className="text-xs text-gray-300">({totalReviews})</span>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-grow flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2 leading-tight">{title}</CardTitle>
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-1" />
            <span>Par <span className="font-medium">{instructor}</span></span>
          </div>
        </CardHeader>

        <CardContent className="flex-grow pb-3">
          <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">{description}</p>
          
          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <BookOpen className="h-3 w-3 mr-1" />
              <span>{lessons} leçons</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Users className="h-3 w-3 mr-1" />
              <span>{students} étudiants</span>
            </div>
            {created_at && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>

          {/* Price Section */}
          {numericPrice !== undefined && numericPrice !== null && !isNaN(numericPrice) && (
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-gray-500" />
                  {hasDiscount ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600">
                        {discountedPrice?.toFixed(2)}€
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {numericPrice.toFixed(2)}€
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {numericPrice.toFixed(2)}€
                    </span>
                  )}
                </div>
                {numericPrice === 0 && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Gratuit
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <Link to={linkPath || `/course/${id}`} className="w-full">
            <Button className="w-full bg-primary hover:bg-primary-dark transition-colors">
              {numericPrice !== undefined && numericPrice !== null && !isNaN(numericPrice) && numericPrice > 0 
                ? (hasDiscount 
                    ? `Voir le cours - ${discountedPrice?.toFixed(2)}€` 
                    : `Voir le cours - ${numericPrice.toFixed(2)}€`)
                : 'Voir le cours gratuitement'
              }
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};

export default CourseCard;
