import { useState } from "react";
import Input from "../component/Input";
import MapModal from "../component/MapModal";
import QRCodeModal from "../component/QRCodeModal";
import scheduleImg from "../assets/scheduleImg.jpeg";
import logo from "../assets/smartickk.png";
import { supabase } from "../utils/supabaseClient";
import useUserDetails from "../hooks/useUserDetails";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";

const VERCEL_URL = import.meta.env.VITE_VERCEL_URL;

const ClassSchedule = () => {
  const { userDetails, userDetailsError } = useUserDetails();

  const [formData, setFormData] = useState({
    courseTitle: "",
    courseCode: "",
    lectureVenue: "",
    time: "",
    date: "",
    note: "",
  });

  const [selectedLocationCoordinate, setSelectedLocationCoordinate] =
    useState(null);
  const [qrData, setQrData] = useState("");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (locationName, coordinate) => {
    setFormData({ ...formData, lectureVenue: locationName });
    setSelectedLocationCoordinate(coordinate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userDetails) {
      toast.error("Please wait... Lecturer details not yet loaded.");
      return;
    }

    if (!selectedLocationCoordinate) {
      toast.error("Please select a lecture venue location.");
      return;
    }

    const { courseTitle, courseCode, lectureVenue, time, date, note } = formData;
    const lecturerId = userDetails.lecturer_id;

    const registrationLink = `${VERCEL_URL}/studentLogin?courseCode=${encodeURIComponent(
      courseCode
    )}&time=${encodeURIComponent(time)}&lectureVenue=${encodeURIComponent(
      lectureVenue
    )}&lat=${selectedLocationCoordinate.lat}&lng=${selectedLocationCoordinate.lng}`;

    const locationGeography = `SRID=4326;POINT(${selectedLocationCoordinate.lng} ${selectedLocationCoordinate.lat})`;

    const { data, error } = await supabase
      .from("classes")
      .insert([
        {
          course_title: courseTitle,
          course_code: courseCode,
          time: new Date(`${date}T${time}`).toISOString(),
          date: new Date(date).toISOString(),
          location: locationGeography,
          note,
          qr_code: registrationLink,
          lecturer_id: lecturerId, // ✅ now correctly filled
          location_name: lectureVenue,
        },
      ])
      .select("course_id");

    if (error) {
      toast.error(`Error creating class schedule: ${error.message}`);
      console.error(error);
      return;
    }

    toast.success("Class schedule created successfully!");

    // Generate QR code modal
    const generatedCourseId = data[0]?.course_id;
    const updatedRegistrationLink = `${VERCEL_URL}/attendance?courseId=${encodeURIComponent(
      generatedCourseId
    )}&time=${encodeURIComponent(time)}&courseCode=${encodeURIComponent(
      courseCode
    )}&lat=${selectedLocationCoordinate.lat}&lng=${selectedLocationCoordinate.lng}`;

    setQrData(updatedRegistrationLink);
    setIsQRModalOpen(true);

    // Reset form
    setFormData({
      courseTitle: "",
      courseCode: "",
      lectureVenue: "",
      time: "",
      date: "",
      note: "",
    });
    setSelectedLocationCoordinate(null);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-[100vh] bg-gray-100">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-center relative">
          <div>
            <Link to="/classDetails">
              <button className="btn btn-sm rounded-full bg-blue-500 border-none text-white hover:bg-blue-600 transition-colors">
                Back
              </button>
            </Link>
          </div>

          <div className="w-full max-w-2xl h-[90vh] overflow-y-auto mt-4">
            <div className="flex justify-center items-center mb-4">
              <img src={logo} alt="smartickk Logo" className="h-24 w-24 object-contain" />
            </div>

            <p className="text-sm text-neutral-600 text-center mb-4">
              Schedule a class using the form below
            </p>

            {userDetailsError && (
              <p className="text-red-600 text-center mb-2">
                {userDetailsError}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Course Title"
                name="courseTitle"
                type="text"
                onChange={handleInputChange}
                value={formData.courseTitle}
                required
              />
              <Input
                label="Course Code"
                name="courseCode"
                type="text"
                onChange={handleInputChange}
                value={formData.courseCode}
                required
              />

              <div className="relative">
                <Input
                  label="Lecture Venue"
                  name="lectureVenue"
                  type="text"
                  placeholder="Kindly select location"
                  value={formData.lectureVenue}
                  readOnly
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="btn absolute right-0 top-9 px-3 bg-green-500 text-white rounded-r-md hover:bg-green-600 transition-colors"
                >
                  Select Location
                </button>
              </div>

              <Input
                name="time"
                type="time"
                label="Time"
                onChange={handleInputChange}
                value={formData.time}
                required
              />
              <Input
                name="date"
                type="date"
                label="Date"
                onChange={handleInputChange}
                value={formData.date}
                required
              />
              <Input
                label="Note"
                name="note"
                type="text"
                onChange={handleInputChange}
                value={formData.note}
              />

              <button
                type="submit"
                className="w-full btn bg-blue-500 text-white hover:bg-blue-600 transition-colors mt-4"
              >
                {userDetails ? "Generate QR Code" : "Loading Lecturer..."}
              </button>
            </form>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex w-1/2 h-screen items-center justify-center overflow-hidden">
          <img
            src={scheduleImg}
            alt="Schedule"
            className="object-cover w-full h-full max-w-none"
          />
        </div>

        {/* Modals */}
        {isMapModalOpen && (
          <MapModal
            onClose={() => setIsMapModalOpen(false)}
            onSelectLocation={handleLocationChange}
          />
        )}
        {isQRModalOpen && (
          <QRCodeModal qrData={qrData} onClose={() => setIsQRModalOpen(false)} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default ClassSchedule;
