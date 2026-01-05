import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const linkClasses = ({ isActive }) => {
  const baseClasses =
    "px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md";
  if (isActive) {
    return `${baseClasses} text-indigo-600 bg-indigo-50`;
  }
  return `${baseClasses} text-slate-600 hover:text-slate-900 hover:bg-slate-50`;
};

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            CampusKart
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClasses}>
            Home
          </NavLink>
          <NavLink to="/marketplace" className={linkClasses}>
            Marketplace
          </NavLink>
          <NavLink to="/notes" className={linkClasses}>
            Notes
          </NavLink>
          <NavLink to="/sell" className={linkClasses}>
            Sell Item
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-sm font-medium text-slate-700 sm:block">
                {user?.first_name || user?.email?.split("@")[0]}
              </span>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Sign in
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Get Started
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
