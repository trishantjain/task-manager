import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FolderKanban,
  Plus,
  Users,
  Trash2
} from "lucide-react";

import API from "../api/axios";

import DashboardLayout from "../layouts/DashboardLayout";

import { AuthContext } from "../context/AuthContext";

const Projects = () => {

  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const submitLock = useRef(false);

  const fetchProjects = async () => {

    try {

      const res = await API.get("/api/projects");

      const uniqueProjects = Array.from(
        new Map(
          (res.data.projects || []).map((project) => [
            project._id,
            project,
          ])
        ).values()
      );

      setProjects(uniqueProjects);

    } catch (error) {

      console.log(error);

    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitLock.current) {
      return;
    }

    submitLock.current = true;

    setIsSubmitting(true);
    try {

      await API.post(
        "/api/projects",
        formData
      );

      setFormData({
        name: "",
        description: "",
      });

      setShowForm(false);

      fetchProjects();

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    } finally {

      submitLock.current = false;

      setIsSubmitting(false);
    }
  };

  const deleteProject = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this project?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/api/projects/${id}`
      );

      fetchProjects();

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchProjects();

  }, []);

  return (
    <DashboardLayout>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-10">

        <div>

          <p className="text-zinc-500 text-sm mb-2">
            Workspace
          </p>

          <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
            Projects
          </h1>

        </div>

        {user?.role === "admin" && (

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:scale-[1.02] transition-all"
          >

            <Plus size={18} />

            New Project

          </button>

        )}

      </div>

      {/* CREATE FORM */}

      {showForm && (

        <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Create New Project
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-zinc-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              required
            />

            <textarea
              name="description"
              placeholder="Project Description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-zinc-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-6 py-3 rounded-2xl font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>

          </form>

        </div>

      )}

      {/* PROJECT GRID */}

      {projects.length === 0 ? (

        <div className="bg-white rounded-3xl p-16 border border-zinc-200 text-center shadow-sm">

          <div className="flex justify-center mb-5">

            <div className="h-20 w-20 rounded-3xl bg-zinc-100 flex items-center justify-center">

              <FolderKanban
                size={40}
                className="text-zinc-500"
              />

            </div>

          </div>

          <h2 className="text-2xl font-bold text-zinc-900">
            No Projects Yet
          </h2>

          <p className="text-zinc-500 mt-3">
            Create your first project to start managing tasks.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {projects.map((project) => (

            <div
              key={project._id}
              className="bg-white rounded-3xl border border-zinc-200 p-7 shadow-sm hover:shadow-lg transition-all"
            >

              {/* TOP */}

              <div className="flex items-start justify-between">

                <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center">

                  <FolderKanban size={24} />

                </div>

                <span className="bg-zinc-100 text-zinc-700 text-sm px-3 py-1 rounded-full">
                  Active
                </span>

              </div>

              {/* CONTENT */}

              <div className="mt-7">

                <h2 className="text-2xl font-bold text-zinc-900">
                  {project.name}
                </h2>

                <p className="text-zinc-500 mt-3 leading-relaxed">
                  {project.description || "No description provided."}
                </p>

              </div>

              {/* FOOTER */}

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-2 text-zinc-600">

                  <Users size={18} />

                  <span className="font-medium">
                    {project.members?.length || 0} Members
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4">

                  <div className="text-sm text-zinc-500">
                    by {project.createdBy?.name}
                  </div>

                  {/* {user?.role?.toLowerCase() === "admin" && ( */}

                    <button
                      onClick={() => deleteProject(project._id)}
                      className=" flex-shrink-0 h-11 w-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-all cursor-pointer"
                    >

                      <Trash2 size={18} />
                      {/* DEL */}
                    </button>

                  {/* )} */}

                </div>

              </div>
            </div>
          ))}


        </div>

      )}

    </DashboardLayout>
  );
};

export default Projects;
