import Login from "@/views/Auth/Login/LoginPage";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  return <Login searchParams={resolvedSearchParams} />;
};

export default LoginPage;
