import { AlertCircle } from "lucide-react";

import { useNavigate } from "react-router-dom";

interface MissingProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionPath?: string;
}

export default function Missing({
  title = "Missing Information",
  description = "You need to complete this step to continue",
  actionLabel = "Action Now",
  actionPath = "/",
}: MissingProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <AlertCircle size={48} className="text-warning" />

      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>

      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        onClick={() => navigate(actionPath)}
      >
        {actionLabel}
      </button>
    </div>
  );
}
