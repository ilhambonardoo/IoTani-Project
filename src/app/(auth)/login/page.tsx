import Login from "@/views/Login/LoginPage";

const LoginPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  return <Login searchParams={searchParams} />;
};

export default LoginPage;
