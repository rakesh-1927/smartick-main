import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Input from "../component/Input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Footer from "../component/Footer";
import Logo from "../assets/smartickk.png";
import registerImg from "../assets/registerImg.jpg";

const RegisterLecturer = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!fullName || !email || !phoneNumber) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // Sign up lecturer with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      const userId = authData?.user?.id;

      if (!userId) {
        throw new Error("User ID not found after sign-up");
      }

      // Upsert lecturer details (insert or update if already exists)
      const { error: upsertError } = await supabase
        .from("lecturers")
        .upsert(
          {
            id: userId,
            fullname,
            email,
            phone_number: phoneNumber,
          },
          { onConflict: ["id"] } // ensures duplicate key errors are avoided
        );

      if (upsertError) throw upsertError;

      toast.success("Registration successful!");
      navigate("/loginLecturer");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen grid md:grid-cols-2">
      {/* Form Section */}
      <form
        onSubmit={handleRegister}
        className="px-6 lg:px-20 py-8 h-screen overflow-auto flex flex-col justify-center"
      >
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="smartickk Logo" className="h-24 w-24 object-contain" />
          <h2 className="text-[#000D46] font-bold text-3xl mt-4">
            Create Account
          </h2>
        </div>

        <div className="grid gap-4">
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Input
            type="tel"
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-2 bg-[#000D46] text-white font-bold rounded-md"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="mt-4 text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/loginLecturer" className="text-[#000D46] font-semibold">
            Login
          </Link>
        </p>
      </form>

      {/* Image Section */}
      <div className="hidden md:block h-screen w-full">
        <img
          src={registerImg}
          alt="Register Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <Footer />
    </section>
  );
};

export default RegisterLecturer;
