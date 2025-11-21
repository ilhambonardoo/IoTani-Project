import { Suspense } from "react";
import ResetPassword from "@/views/ResetPassword/ResetPasswordPage";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default ResetPasswordPage;

