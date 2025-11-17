import Dashboard from "@/app/(user)/dashboard/page";

const DashboardOwner = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <Dashboard />
    </div>
  );
};

export default DashboardOwner;
