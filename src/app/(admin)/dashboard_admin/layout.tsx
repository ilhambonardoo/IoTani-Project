import Dashboard from "@/app/(user)/dashboard/page";

const DashboardAdmin = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <Dashboard />
    </div>
  );
};

export default DashboardAdmin;
