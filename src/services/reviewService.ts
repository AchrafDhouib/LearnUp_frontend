import apiClient from './api';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
}

export interface ReviewResponse {
  reviews: Review[];
  stats: ReviewStats;
}

export const reviewService = {
  // Get reviews for a course
  getCourseReviews: async (courseId: string): Promise<ReviewResponse> => {
    const response = await apiClient.get(`/courses/${courseId}/reviews`);
    return response.data;
  },

  // Create a review for a course
  createReview: async (courseId: string, data: { rating: number; comment?: string }): Promise<{ message: string; review: Review }> => {
    const response = await apiClient.post(`/courses/${courseId}/reviews`, data);
    return response.data;
  },
}; 