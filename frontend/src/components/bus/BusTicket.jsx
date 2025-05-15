import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../assets/logo.svg';

const BusTicket = ({ bookingData, schedule, selectedSeats }) => {
  const ticketRef = React.useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const bookingId = `BUS${Date.now()}`;

  const generateTicketData = () => {
    return JSON.stringify({
      bookingId,
      passengerName: `${bookingData.firstName} ${bookingData.lastName}`,
      from: schedule.from,
      to: schedule.to,
      date: new Date(schedule.departureTime).toLocaleDateString(),
      time: new Date(schedule.departureTime).toLocaleTimeString(),
      seats: selectedSeats,
      operator: schedule.operator.name,
      busType: schedule.busType,
      price: schedule.price * selectedSeats.length
    });
  };

  const downloadTicket = async () => {
    if (!ticketRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      const downloadButton = document.querySelector('[data-download-button]');
      if (downloadButton) {
        downloadButton.disabled = true;
        downloadButton.innerHTML = 'Generating PDF...';
      }

      // Wait for images to load
      const images = ticketRef.current.getElementsByTagName('img');
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) resolve();
              else {
                img.onload = resolve;
                img.onerror = resolve; // Resolve even on error to continue
              }
            })
        )
      );

      // Create canvas with better quality
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        imageTimeout: 0, // No timeout for images
        onclone: (clonedDoc) => {
          // Ensure all images in the cloned document are loaded
          const clonedImages = clonedDoc.getElementsByTagName('img');
          Array.from(clonedImages).forEach(img => {
            img.crossOrigin = 'anonymous';
          });
        }
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit the page
      const imgWidth = 297; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

      // Save PDF
      pdf.save(`bus-ticket-${bookingId}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating ticket PDF. Please try again.');
    } finally {
      setIsGenerating(false);
      const downloadButton = document.querySelector('[data-download-button]');
      if (downloadButton) {
        downloadButton.disabled = false;
        downloadButton.innerHTML = '<Download className="h-5 w-5" /> Download Ticket';
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={downloadTicket}
          data-download-button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5" />
          Download Ticket
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
        >
          <Printer className="h-5 w-5" />
          Print Ticket
        </button>
      </div>

      <div
        ref={ticketRef}
        className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-100"
      >
        {/* Ticket Header with Logo */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-6">
            <img src={logo} alt="Company Logo" className="h-28 w-auto" />
            <div>
              <h2 className="text-2xl font-bold text-blue-600">Bus Ticket</h2>
              <p className="text-neutral-500">Booking ID: {bookingId}</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <QRCodeSVG
              value={generateTicketData()}
              size={100}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        {/* Journey Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Journey Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">From:</span>
                <span className="font-medium">{schedule.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">To:</span>
                <span className="font-medium">{schedule.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Date:</span>
                <span className="font-medium">
                  {new Date(schedule.departureTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Time:</span>
                <span className="font-medium">
                  {new Date(schedule.departureTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Passenger Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Name:</span>
                <span className="font-medium">
                  {bookingData.firstName} {bookingData.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">NIC:</span>
                <span className="font-medium">{bookingData.nic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Phone:</span>
                <span className="font-medium">{bookingData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Email:</span>
                <span className="font-medium">{bookingData.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bus Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Bus Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Operator:</span>
                <span className="font-medium">{schedule.operator.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Bus Type:</span>
                <span className="font-medium">{schedule.busType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Seats:</span>
                <span className="font-medium">{selectedSeats.join(', ')}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Total Amount:</span>
                <span className="font-medium text-blue-600">
                  LKR {schedule.price * selectedSeats.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Payment Method:</span>
                <span className="font-medium">Credit Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Status:</span>
                <span className="font-medium text-green-600">Confirmed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="text-sm text-neutral-500 border-t border-neutral-200 pt-4">
          <p className="mb-2">Terms and Conditions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Please arrive at the bus station 30 minutes before departure</li>
            <li>Keep this ticket safe and present it during boarding</li>
            <li>Seats are non-transferable</li>
            <li>Refund policy: 24 hours before departure</li>
          </ul>
        </div>

        {/* Footer with Logo */}
        <div className="mt-8 pt-4 border-t border-neutral-200 flex justify-between items-center">
          <img src={logo} alt="Company Logo" className="h-20 w-auto opacity-50" />
          <p className="text-sm text-neutral-500">Thank you for choosing our service!</p>
        </div>
      </div>
    </div>
  );
};

export default BusTicket; 