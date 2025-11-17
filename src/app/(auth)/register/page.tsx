import Register from "@/views/Register/RegisterPage";

const RegisterPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  return <Register searchParams={searchParams} />;
};

export default RegisterPage;
