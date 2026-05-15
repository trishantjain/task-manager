import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await API.post(
        "/api/auth/login",
        formData
      );

      login(res.data);

      navigate("/dashboard");
    }
    catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-2xl font-semibold transition-all
                      ${loading
              ? "bg-zinc-700 cursor-not-allowed opacity-70"
              : "bg-black text-white cursor-pointer hover:scale-[1.01]"
            }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-zinc-500 mt-6">

          Don't have an account?

<span
  onClick={() => navigate("/signup")}
  className="text-black font-semibold cursor-pointer ml-2 hover:underline"
>
  Signup
</span>

        </p>

      </form>

    </div>
  );
};

export default Login;