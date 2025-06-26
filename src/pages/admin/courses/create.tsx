import DashboardLayout from "@/components/DashboardLayout";
import CourseForm from "@/components/admin/CourseForm";

const CreateCourse = () => {
  return (
    <DashboardLayout userType="admin">
      <CourseForm />
    </DashboardLayout>
  );
};

export default CreateCourse;