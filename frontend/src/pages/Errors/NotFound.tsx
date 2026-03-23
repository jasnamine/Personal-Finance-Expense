import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>

      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
        <Link to="/dashboard">Back to Dashboard</Link>
      </button>
    </div>
  );
}
