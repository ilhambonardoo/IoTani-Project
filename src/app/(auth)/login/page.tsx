import Login from "@/views/Login/page";

const LoginPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  return <Login searchParams={searchParams} />;
};

export default LoginPage;
