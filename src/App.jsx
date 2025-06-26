
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/student/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import CourseView from "./pages/CourseView";
import QuizPage from "./pages/QuizPage";
import QuizResults from "./pages/QuizResults";
import CertificatePage from "./pages/CertificatePage";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Pages étudiants
import StudentCourses from "./pages/student/Courses";
import StudentQuizzes from "./pages/student/Quizzes";
import StudentCertificates from "./pages/student/Certificates";
import StudentProfile from "./pages/student/Profile";
import StudentSettings from "./pages/student/Settings";

// Pages enseignants
import TeacherCourses from "./pages/teacher/Courses";
import TeacherQuizzes from "./pages/teacher/Quizzes";
import TeacherStudents from "./pages/teacher/Students";
import TeacherSettings from "./pages/teacher/Settings";
import CreateCourse from "./pages/teacher/CreateCourse";

// Pages légales
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import CookiePolicy from "./pages/legal/CookiePolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
 
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
