import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  // Fetch appointments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });
      setAppointments(data.appointments.reverse());
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Auto-pay appointment
  const autoPayAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/auto-pay-appointment`,
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success("✅ Payment Done!");
        getUserAppointments();
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My appointments
      </p>

      <div>
        {appointments.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            {/* Doctor Image */}
            <div>
              <img
                className="w-36 bg-[#EAEFFF]"
                src={item.docData.image}
                alt=""
              />
            </div>

            {/* Doctor Info */}
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-[#464646] font-medium mt-1">Address:</p>
              <p>{item.docData.address.line1}</p>
              <p>{item.docData.address.line2}</p>
              <p className="mt-1">
                <span className="text-sm text-[#3C3C3C] font-medium">
                  Date & Time:
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col justify-end gap-2 text-sm text-center">
              {/* Pay button */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => autoPayAppointment(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay
                </button>
              )}

              {/* Paid button */}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]">
                  Paid
                </button>
              )}

              {/* Completed */}
              {item.isCompleted && (
                <button className="py-2 text-green-500 border border-green-500 rounded sm:min-w-48">
                  Completed
                </button>
              )}

              {/* Cancel appointment */}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel appointment
                </button>
              )}

              {/* Cancelled */}
              {item.cancelled && !item.isCompleted && (
                <button className="py-2 text-red-500 border border-red-500 rounded sm:min-w-48">
                  Appointment cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
