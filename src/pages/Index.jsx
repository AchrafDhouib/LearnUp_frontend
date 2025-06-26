
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import Features from "@/components/home/Features";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <Features />
      <FeaturedCourses />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
