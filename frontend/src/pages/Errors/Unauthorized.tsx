import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <ShieldAlert size={48} className="text-destructive" />

      <h1 className="text-2xl font-semibold">403 - Không có quyền truy cập</h1>
      <p className="text-muted-foreground">
        Bạn không có quyền truy cập trang này
      </p>

      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        onClick={() => navigate(-1)}
      >
        Quay lại
      </button>
    </div>
  );
}
