import useLogout from "../hooks/useLogout";

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <button
      onClick={() => logout()}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
