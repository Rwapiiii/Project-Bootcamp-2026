export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          To-Do List
        </h1>

        {/* Form Tambah Tugas (Tampilan saja) */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Mau ngerjain apa hari ini?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Tambah
          </button>
        </div>

        {/* Daftar Tugas (Data statis sementara) */}
        <ul className="space-y-3">
          
          {/* Item Tugas 1 */}
          <li className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-gray-700">Merapikan kamar</span>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
              aria-label="Hapus tugas"
            >
              {/* Ikon Tempat Sampah (SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </li>

          {/* Item Tugas 2 */}
          <li className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-gray-700">Belajar Next.js dan Tailwind</span>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
              aria-label="Hapus tugas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </li>

        </ul>
      </div>
    </main>
  );
}