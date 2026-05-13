import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-100">

      <Sidebar />

      <main className="ml-64 min-h-screen">

        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>

      </main>

    </div>
  );
};

export default DashboardLayout;