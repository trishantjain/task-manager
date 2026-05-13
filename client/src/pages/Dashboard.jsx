import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ListTodo,
} from "lucide-react";

import API from "../api/axios";

import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {

  const [stats, setStats] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats = async () => {

    try {

      const res = await API.get(
        "/api/dashboard/stats"
      );

      setStats(res.data.stats);

    } catch (error) {

      console.log(error);

    }
  };

  const cards = [
    {
      title: "Total Tasks",
      value: stats?.totalTasks || 0,
      icon: <ListTodo size={22} />,
      color: "bg-blue-500",
    },

    {
      title: "Completed",
      value: stats?.completedTasks || 0,
      icon: <CheckCircle2 size={22} />,
      color: "bg-emerald-500",
    },

    {
      title: "Pending",
      value: stats?.pendingTasks || 0,
      icon: <Clock3 size={22} />,
      color: "bg-orange-500",
    },

    {
      title: "Overdue",
      value: stats?.overdueTasks || 0,
      icon: <AlertTriangle size={22} />,
      color: "bg-rose-500",
    },
  ];

  return (
    <DashboardLayout>

      {/* TOP SECTION */}

      <div className="flex items-center justify-between mb-10">

        <div>

          <p className="text-zinc-500 text-sm mb-2">
            Welcome back
          </p>

          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight">
            {user?.name}
          </h1>

        </div>

        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-zinc-200">

          <p className="text-sm text-zinc-500">
            Role
          </p>

          <h2 className="font-semibold text-zinc-900 capitalize">
            {user?.role}
          </h2>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {cards.map((card) => (

          <div
            key={card.title}
            className="bg-white rounded-3xl p-7 shadow-sm border border-zinc-200 hover:shadow-md transition-all"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-zinc-500 font-medium">
                  {card.title}
                </p>

                <h2 className="text-5xl font-bold mt-6 text-zinc-900 tracking-tight">
                  {card.value}
                </h2>

              </div>

              <div
                className={`${card.color} h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}
              >
                {card.icon}
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* LOWER GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">

        {/* RECENT ACTIVITY */}

        <div className="xl:col-span-2 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-zinc-900">
                Recent Activity
              </h2>

              <p className="text-zinc-500 mt-1">
                Latest updates from your workspace
              </p>

            </div>

          </div>

          <div className="space-y-4">

            <div className="p-5 rounded-2xl bg-zinc-100 flex items-center justify-between">

              <div>
                <p className="font-semibold text-zinc-900">
                  No recent activities
                </p>

                <p className="text-sm text-zinc-500 mt-1">
                  Activity logs will appear here
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* QUICK INFO */}

        <div className="bg-gradient-to-br from-black to-zinc-800 rounded-3xl p-8 text-white shadow-sm">

          <p className="text-zinc-400 text-sm">
            Productivity
          </p>

          <h2 className="text-4xl font-bold mt-3">
            Keep your team on track
          </h2>

          <p className="text-zinc-400 mt-4 leading-relaxed">
            Manage tasks, monitor deadlines, and improve collaboration across your projects.
          </p>

          <button className="mt-8 bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition-all">
            Explore Tasks
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;