import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="mb-6">
        You do not have permission to access this page.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Login
      </button>
    </div>
  );
}
