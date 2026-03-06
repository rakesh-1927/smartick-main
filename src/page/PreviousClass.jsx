import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import toast from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";
import useUserDetails from "../hooks/useUserDetails";
import AttendanceListModal from "../component/AttendanceListModal";
import Footer from "../component/Footer";

const PreviousClass = () => {
  const { userDetails } = useUserDetails();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const lecturerId = userDetails?.lecturer_id;

  const fetchClasses = async () => {
    if (!lecturerId) return;
    setIsLoading(true);

    const { data, error } = await supabase
  .from("classes")
  .select("*, attendance, lecturer:lecturer_id(fullName, email)")
  .eq("lecturer_id", lecturerId);


    if (error) {
      toast.error(`Error fetching classes: ${error.message}`);
    } else {
      setClasses(data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, [lecturerId]);

  const handleViewAttendance = (classItem) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  return (
    <>
      <section className="pb-20 pt-8 px-6 max-w-7xl mx-auto min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/classDetails">
            <button className="btn btn-sm bg-blue-500 text-white rounded-full flex items-center gap-1">
              <BiArrowBack />
              Back
            </button>
          </Link>
          <h2 className="text-2xl font-bold text-black text-center flex-1">
            Previous Classes
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loading loading-spinner bg-blue-500"></div>
          </div>
        ) : classes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200 text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">S/N</th>
                  <th className="border px-2 py-1">Course Code</th>
                  <th className="border px-2 py-1">Course Title</th>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Time</th>
                  <th className="border px-2 py-1">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem, index) => {
                  const formattedDate = new Date(classItem.date).toLocaleDateString();
                  const formattedTime = new Date(classItem.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <tr key={classItem.id} className="text-gray-700 text-center">
                      <td className="border px-2 py-1">{index + 1}</td>
                      <td className="border px-2 py-1">{classItem.course_code}</td>
                      <td className="border px-2 py-1">{classItem.course_title}</td>
                      <td className="border px-2 py-1">{formattedDate}</td>
                      <td className="border px-2 py-1">{formattedTime}</td>
                      <td className="border px-2 py-1">
                        <button
                          onClick={() => handleViewAttendance(classItem)}
                          className="btn btn-sm bg-green-500 text-white rounded-md"
                        >
                          View List
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-black mt-4">No previous classes found.</p>
        )}

        <AttendanceListModal
          isOpen={isModalOpen}
          selectedClass={selectedClass}
          onClose={handleCloseModal}
        />
      </section>
      <Footer />
    </>
  );
};

export default PreviousClass;
