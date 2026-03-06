/* eslint-disable react/prop-types */
import { QRCodeSVG } from "qrcode.react";

const QRCodeModal = ({ qrData, onClose }) => {
  if (!qrData) return null; 

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Generated QR Code
        </h2>

        <div className="flex justify-center mb-4">
          <QRCodeSVG value={qrData} size={220} />
        </div>

        <p className="text-sm mb-6 text-gray-600 text-center">
          Scan this QR code to access the class schedule information.
        </p>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
