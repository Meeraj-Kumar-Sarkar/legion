export default function FindYourBuses() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4facfe] to-[#1f7378] font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full animate-fade-in">
        <h1 className="text-center text-gray-800 text-2xl mb-2">🚌 Find Your Buses</h1>
        <h2 className="text-center text-gray-500 text-base mb-6 font-normal">Plan your trip easily</h2>

        {/* Trip Search */}
        <label htmlFor="from" className="font-semibold block mb-2 text-gray-700">From (location)</label>
        <input
          type="text"
          id="from"
          placeholder="Enter starting point"
          className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 mb-4"
        />

        <label htmlFor="to" className="font-semibold block mb-2 text-gray-700">To (location)</label>
        <input
          type="text"
          id="to"
          placeholder="Enter destination"
          className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 mb-4"
        />

        <button
          type="button"
          className="mt-4 w-full py-3 bg-gradient-to-br from-[#2a6aa3] to-[#5a84bf] text-white font-bold rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition"
        >
          Find buses
        </button>

        <div className="relative my-6">
          <div className="border-t border-gray-300"></div>
          <span className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-white px-2 text-gray-500 text-sm">OR</span>
        </div>

        {/* Bus No Search */}
        <label htmlFor="busNo" className="font-semibold block mb-2 text-gray-700">Find buses by bus no.</label>
        <input
          type="text"
          id="busNo"
          placeholder="Enter bus number"
          className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 mb-4"
        />

        <button
          type="button"
          className="mt-4 w-full py-3 bg-gradient-to-br from-[#2a6aa3] to-[#5a84bf] text-white font-bold rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition"
        >
          Find buses
        </button>
      </div>
    </div>
  );
}
