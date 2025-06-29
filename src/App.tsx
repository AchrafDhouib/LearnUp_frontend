import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
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

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import DisciplinesIndex from "./pages/admin/disciplines/index";
import DisciplineIndex from "./pages/admin/disciplines/[id]";
import CreateDiscipline from "./pages/admin/disciplines/create";
import EditDiscipline from "./pages/admin/disciplines/edit/[id]";
import SpecialtiesIndex from "./pages/admin/specialties/index";
import SpecialtyIndex from "./pages/admin/specialties/[id]";
import CreateSpecialty from "./pages/admin/specialties/create";
import EditSpecialty from "./pages/admin/specialties/edit/[id]";
import CoursesIndex from "./pages/admin/courses/index";
import CourseIndex from "./pages/admin/courses/[id]";
import CreateCourse from "./pages/admin/courses/create";
import EditCourse from "./pages/admin/courses/edit/[id]";
import UsersIndex from "./pages/admin/users/index";
import UserDetails from "./pages/admin/users/[id]";
import SettingsPage from "./pages/admin/settings/index";

// Student pages
import StudentCourses from "./pages/student/Courses";
import StudentQuizzes from "./pages/student/Quizzes";
import StudentCertificates from "./pages/student/Certificates";
import StudentProfile from "./pages/student/Profile";
import StudentSettings from "./pages/student/Settings";

// Teacher pages
import TeacherCourses from "./pages/teacher/Courses";
import TeacherQuizzes from "./pages/teacher/Quizzes";
import TeacherStudents from "./pages/teacher/Students";
import TeacherSettings from "./pages/teacher/Settings";
import CreateTeacherCourse from "./pages/teacher/CreateCourse";
import CreateQuiz from "./pages/teacher/CreateQuiz";
import TeacherRegister from "./pages/TeacherRegister";

// Legal pages
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import CookiePolicy from "./pages/legal/CookiePolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/teacher/register" element={<TeacherRegister />} />
            
            {/* Student routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/quizzes" element={<StudentQuizzes />} />
            <Route path="/student/certificates" element={<StudentCertificates />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/settings" element={<StudentSettings />} />
            
            {/* Teacher routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<TeacherCourses />} />
            <Route path="/teacher/quizzes" element={<TeacherQuizzes />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/settings" element={<TeacherSettings />} />
            <Route path="/teacher/create-course" element={<CreateTeacherCourse />} />
            <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
            <Route path="/teacher/quizzes/:id/edit" element={<CreateQuiz />} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/disciplines" element={<DisciplinesIndex />} />
            <Route path="/admin/disciplines/:id" element={<DisciplineIndex />} />
            <Route path="/admin/disciplines/create" element={<CreateDiscipline />} />
            <Route path="/admin/disciplines/edit/:id" element={<EditDiscipline />} />
            <Route path="/admin/specialties" element={<SpecialtiesIndex />} />
            <Route path="/admin/specialties/:id" element={<SpecialtyIndex />} />
            <Route path="/admin/specialties/create" element={<CreateSpecialty />} />
            <Route path="/admin/specialties/edit/:id" element={<EditSpecialty />} />
            <Route path="/admin/courses" element={<CoursesIndex />} />
            <Route path="/admin/courses/:id" element={<CourseIndex />} />
            <Route path="/admin/courses/create" element={<CreateCourse />} />
            <Route path="/admin/courses/edit/:id" element={<EditCourse />} />
            <Route path="/admin/users" element={<UsersIndex />} />
            <Route path="/admin/users/:id" element={<UserDetails />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            
            <Route path="/course/:id" element={<CourseView />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/quiz/:id/results" element={<QuizResults />} />
            <Route path="/certificate/:id" element={<CertificatePage />} />
            
            {/* Legal pages */}
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;