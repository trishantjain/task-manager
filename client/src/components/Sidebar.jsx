import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

const Sidebar = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },

    {
      name: "Projects",
      path: "/projects",
      icon: <FolderKanban size={18} />,
    },

    {
      name: "Tasks",
      path: "/tasks",
      icon: <CheckSquare size={18} />,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-zinc-800 flex flex-col justify-between p-6">

      <div>

        {/* LOGO */}

        <div className="mb-12">

          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-black font-bold text-xl">
            T
          </div>

          <h1 className="text-white text-2xl font-bold mt-5">
            TaskFlow
          </h1>

          <p className="text-zinc-500 mt-2 text-sm leading-relaxed">
            Modern team task management dashboard.
          </p>

        </div>

        {/* NAVIGATION */}

        <nav className="space-y-2">

          {menuItems.map((item) => (

            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
              ${
                location.pathname === item.path
                  ? "bg-white text-black shadow-lg"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >

              {item.icon}

              <span className="font-medium">
                {item.name}
              </span>

            </Link>

          ))}

        </nav>

      </div>

      {/* USER SECTION */}

      <div>

        <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">

          <div className="flex items-center gap-4">

            <div className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-lg uppercase">
              {user?.name?.charAt(0)}
            </div>

            <div>

              <p className="text-white font-semibold">
                {user?.name}
              </p>

              <p className="text-zinc-500 text-sm capitalize">
                {user?.role}
              </p>

            </div>

          </div>

        </div>

        <button
          onClick={logout}
          className="mt-4 w-full bg-white text-black py-3 rounded-2xl font-semibold hover:scale-[1.02] transition-all"
        >
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;