import Tasks from "./Tasks";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          To-Do List
        </h1>
        {/* Form tambah tugas masih berupa tampilan */}
	<Tasks />
      </div>
    </main>
  );
}
 
