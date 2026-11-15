import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import FormInput from "../components/FormInput.jsx";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    // UI only — hook up the auth API here later
    console.log("register data:", { username: data.username, email: data.email, password: data.password });
    navigate("/main");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
      <p className="mt-1 text-sm text-zinc-400">It only takes a minute.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <FormInput
          id="username"
          label="Username"
          placeholder="johndoe"
          autoComplete="username"
          error={errors.username}
          register={register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "Username must be at least 3 characters" },
          })}
        />
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
          register={register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password}
          register={register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
        />
        <FormInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword}
          register={register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value, formValues) => value === formValues.password || "Passwords do not match",
          })}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
          Log in
        </Link>
      </p>
    </>
  );
};

export default Register;
