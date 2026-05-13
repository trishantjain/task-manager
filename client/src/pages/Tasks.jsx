import { useContext, useEffect, useState } from "react";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
} from "lucide-react";

import API from "../api/axios";

import DashboardLayout from "../layouts/DashboardLayout";

import { AuthContext } from "../context/AuthContext";

const Tasks = () => {

  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);

  const [projects, setProjects] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {

    fetchTasks();

    fetchProjects();

  }, []);

  const fetchTasks = async () => {

    try {

      const res = await API.get("/api/tasks");

      setTasks(res.data.tasks);

    } catch (error) {

      console.log(error);

    }
  };

  const fetchProjects = async () => {

    try {

      const res = await API.get("/api/projects");

      setProjects(res.data.projects);

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

    try {

      await API.post(
        "/api/tasks",
        formData
      );

      setShowForm(false);

      fetchTasks();

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    }
  };

  const updateStatus = async (id, status) => {

    try {

      await API.put(
        `/api/tasks/${id}/status`,
        { status }
      );

      fetchTasks();

    } catch (error) {

      console.log(error);

    }
  };

  const getPriorityColor = (priority) => {

    switch (priority) {

      case "High":
        return "bg-red-100 text-red-600";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const getStatusColor = (status) => {

    switch (status) {

      case "Done":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  return (
    <DashboardLayout>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-10">

        <div>

          <p className="text-zinc-500 text-sm mb-2">
            Workspace
          </p>

          <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
            Tasks
          </h1>

        </div>

        {user?.role === "admin" && (

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:scale-[1.02] transition-all"
          >

            <Plus size={18} />

            Create Task

          </button>

        )}

      </div>

      {/* CREATE FORM */}

      {showForm && (

        <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Create Task
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            <input
              type="text"
              name="title"
              placeholder="Task Title"
              onChange={handleChange}
              className="border border-zinc-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              required
            />

            <input
              type="date"
              name="dueDate"
              onChange={handleChange}
              className="border border-zinc-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="md:col-span-2 border border-zinc-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              rows="4"
            />

            <select
              name="project"
              onChange={handleChange}
              className="border border-zinc-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              required
            >

              <option value="">
                Select Project
              </option>

              {projects.map((project) => (

                <option
                  key={project._id}
                  value={project._id}
                >
                  {project.name}
                </option>

              ))}

            </select>

            <select
              name="assignedTo"
              onChange={handleChange}
              className="border border-zinc-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
              required
            >

              <option value="">
                Assign Member
              </option>

              {projects
                .find(
                  (p) => p._id === formData.project
                )
                ?.members?.map((member) => (

                  <option
                    key={member._id}
                    value={member._id}
                  >
                    {member.name}
                  </option>

                ))}

            </select>

            <select
              name="priority"
              onChange={handleChange}
              className="border border-zinc-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black"
            >

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

            </select>

            <button
              type="submit"
              className="bg-black text-white rounded-2xl px-6 py-4 font-medium"
            >
              Create Task
            </button>

          </form>

        </div>

      )}

      {/* TASKS */}

      <div className="space-y-6">

        {tasks.length === 0 ? (

          <div className="bg-white rounded-3xl p-16 border border-zinc-200 text-center shadow-sm">

            <div className="flex justify-center mb-5">

              <div className="h-20 w-20 rounded-3xl bg-zinc-100 flex items-center justify-center">

                <CheckCircle2
                  size={40}
                  className="text-zinc-500"
                />

              </div>

            </div>

            <h2 className="text-2xl font-bold text-zinc-900">
              No Tasks Yet
            </h2>

            <p className="text-zinc-500 mt-3">
              Create tasks to start managing team workflow.
            </p>

          </div>

        ) : (

          tasks.map((task) => {

            const overdue =
              new Date(task.dueDate) < new Date() &&
              task.status !== "Done";

            return (

              <div
                key={task._id}
                className="bg-white rounded-3xl border border-zinc-200 p-7 shadow-sm hover:shadow-lg transition-all"
              >

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                  {/* LEFT */}

                  <div className="flex-1">

                    <div className="flex items-center gap-3 flex-wrap">

                      <h2 className="text-2xl font-bold text-zinc-900">
                        {task.title}
                      </h2>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>

                      {overdue && (

                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">

                          <AlertTriangle size={14} />

                          Overdue

                        </span>

                      )}

                    </div>

                    <p className="text-zinc-500 mt-4 leading-relaxed">
                      {task.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-zinc-600">

                      <div>
                        <span className="font-semibold">
                          Project:
                        </span>{" "}
                        {task.project?.name}
                      </div>

                      <div>
                        <span className="font-semibold">
                          Assigned:
                        </span>{" "}
                        {task.assignedTo?.name}
                      </div>

                      <div className="flex items-center gap-2">

                        <CalendarDays size={16} />

                        {new Date(
                          task.dueDate
                        ).toLocaleDateString()}

                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div>

                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(
                          task._id,
                          e.target.value
                        )
                      }
                      className="border border-zinc-300 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-black"
                    >

                      <option value="Todo">
                        Todo
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Done">
                        Done
                      </option>

                    </select>

                  </div>

                </div>

              </div>

            );
          })

        )}

      </div>

    </DashboardLayout>
  );
};

export default Tasks;