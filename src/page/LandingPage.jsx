import { Link } from "react-router-dom";
import logo from "../assets/smartickk.png";
import Footer from "../component/Footer";

const LandingPage = () => {
  return (
    <>
      <section className="h-screen w-full grid place-items-center px-6 bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="smartickk Logo" className="h-24 w-24 object-contain" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            Welcome to smartickk
          </h1>
          <h2 className="text-lg md:text-xl text-gray-700 mb-6">
            Register or Login
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/registerLecturer">
              <button className="btn bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md transition-colors">
                Register
              </button>
            </Link>

            <Link to="/loginLecturer">
              <button className="btn bg-gray-800 text-white hover:bg-gray-900 px-6 py-2 rounded-md transition-colors">
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LandingPage;
