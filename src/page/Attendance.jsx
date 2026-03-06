import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { calculateDistance } from "../utils/distanceCalculation";
import Input from "../component/Input";
import { supabase } from "../utils/supabaseClient";
import toast from "react-hot-toast";
import Spinner from "../component/Spinner";
import dayjs from "dayjs";
import logo from "../assets/smartickk.png";

const Attendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [isLoading, setIsLoading] = useState(false);
  const [userDistance, setUserDistance] = useState(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [classDetails, setClassDetails] = useState(null);
  const [matricNumber, setMatricNumber] = useState("");
  const [name, setName] = useState("");

  const courseId = queryParams.get("courseId");
  const courseCode = queryParams.get("courseCode");
  const lat = parseFloat(queryParams.get("lat"));
  const lng = parseFloat(queryParams.get("lng"));

  // Fetch class details from Supabase
  useEffect(() => {
    const fetchClassDetails = async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("course_id", courseId)
        .single();

      if (error) {
        console.error("Error fetching class details:", error);
        toast.error("Failed to fetch class details.");
      } else {
        setClassDetails(data);
      }
    };
    fetchClassDetails();
  }, [courseId]);

  // Get user's geolocation and calculate distance
  useEffect(() => {
    if (!lat || !lng) return;

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const distance = calculateDistance(userLat, userLng, lat, lng);
            setUserDistance(distance);
            setIsWithinRange(distance <= 100);
          },
          (error) => {
            toast.error(`Error getting location: ${error.message}`);
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, [lat, lng]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!matricNumber || !name) {
      toast.error("Name and Matriculation number are required.");
      return;
    }

    setIsLoading(true);

    // Fetch current attendance
    const { data, error } = await supabase
      .from("classes")
      .select("attendance")
      .eq("course_id", courseId)
      .single();

    if (error) {
      toast.error(`Error fetching class data: ${error.message}`);
      setIsLoading(false);
      return;
    }

    const attendance = data?.attendance || [];

    // Check if matric number already exists
    const matricExists = attendance.some(
      (attendee) => attendee.matric_no === matricNumber.trim().toUpperCase()
    );

    if (matricExists) {
      toast.error("This matriculation number has already been registered.");
      setIsLoading(false);
      return;
    }

    const newAttendee = {
      matric_no: matricNumber.trim().toUpperCase(),
      name: name.trim().toUpperCase(),
      timestamp: new Date().toISOString(),
    };

    const updatedattendance = [...attendance, newAttendee];

    const { error: updateError } = await supabase
      .from("classes")
      .update({ attendance: updatedattendance })
      .eq("course_id", courseId);

    if (updateError) {
      toast.error(`Error marking attendance: ${updateError.message}`);
      setIsLoading(false);
    } else {
      toast.success("Attendance marked successfully.");
      setMatricNumber("");
      setName("");
      setIsLoading(false);
      navigate("/success", { replace: true });
    }
  };

  return (
    <section className="attendance h-screen grid place-items-center bg-gray-50">
      <div className="bg-white px-6 py-6 md:px-16 max-w-3xl rounded-xl shadow-lg w-full">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="smartickk Logo" className="h-20 w-20 object-contain" />
        </div>
        <h2 className="text-3xl text-[#000D46] text-center font-bold mb-4">
          smartickk
        </h2>

        {classDetails && (
          <div className="bg-gray-100 p-4 rounded mb-6">
            <p className="text-[#000D46] font-bold">
              Title: {classDetails.course_title}
            </p>
            <p className="text-[#000D46] font-bold">Code: {courseCode}</p>
            <p className="text-[#000D46] font-bold">
              Venue: {classDetails.location_name}
            </p>
            <p className="text-[#000D46] font-bold">
              Date: {dayjs(classDetails.date).format("DD MMMM, YYYY")}
            </p>
            <p className="text-[#000D46] font-bold">
              Time:{" "}
              {new Date(classDetails.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
            {classDetails.note && (
              <p className="text-[#000D46] font-bold mb-2">
                Note: {classDetails.note}
              </p>
            )}
            <p className="text-[#000D46] font-semibold">
              Distance to Lecture Venue:{" "}
              {userDistance !== null
                ? `${userDistance.toFixed(2)} meters`
                : "Calculating..."}
            </p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="text"
            name="name"
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="text"
            name="matricNumber"
            label="Matriculation Number"
            placeholder="Enter your matric number"
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value)}
            required
          />

          {isWithinRange ? (
            <button
              type="submit"
              className="btn w-full text-lg bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Mark Attendance"}
            </button>
          ) : (
            <p className="text-xs text-red-500 pt-2">
              You must be within 100 meters of the lecture venue to register.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Attendance;
