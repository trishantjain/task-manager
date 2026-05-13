import DashboardLayout from "../layouts/DashboardLayout";

const Tasks = () => {
  return (
    <DashboardLayout>

      <div>

        <h1 className="text-4xl font-bold text-zinc-900">
          Tasks
        </h1>

        <p className="text-zinc-500 mt-2">
          Track and manage assigned tasks.
        </p>

      </div>

    </DashboardLayout>
  );
};

export default Tasks;