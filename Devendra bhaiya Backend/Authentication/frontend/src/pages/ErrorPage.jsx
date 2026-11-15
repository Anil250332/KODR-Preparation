import { Link, isRouteErrorResponse, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  const title = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : "Something went wrong";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 grid place-items-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-semibold">{title}</h1>
        <p className="mt-3 text-zinc-400">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/login" className="mt-6 inline-block rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400">
          Go to login
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
