import Register from "@/views/Register/RegisterPage";

const RegisterPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  return <Register searchParams={resolvedSearchParams} />;
};

export default RegisterPage;
