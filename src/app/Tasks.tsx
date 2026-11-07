'use client';
import { useEffect, useState } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const json = localStorage.getItem('tasks');
    if (json) {
      setTasks(JSON.parse(json));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loaded]);
  
  const createTask = () => {
    const lastId = tasks.reduce((maxId, task: any) => task.id > maxId ? task.id : maxId, 0)

    const date = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
    
    const newTask = {
      id: lastId + 1,
      title,
      category: "Pribadi",
      date,
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      completed: false,
      status: "Belum Selesai"
    };
    
    setTasks(ts => [...ts, newTask]);
  };
  
  return (
    <div>
      {/* MODUL 2: Menampilkan setiap object di array tasks dengan .map() */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Mau ngerjain apa hari ini?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
	  onChange={e => setTitle(e.target.value)}
        />

        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
	  onClick={() => createTask()}
        >
          Tambah
        </button>
      </div>
      <ul className="space-y-3">
        {tasks.map((task) => {
	  return <Task
		   key={task.id}
		   task={task}
		   deleter={() => setTasks(ts => ts.filter(t => t.id != task.id))} />;
	})}
      </ul>
    </div>
  );
}

function Task(props: any) {
  const task = props.task;
  const deleteOwnTask = props.deleter;
  
  return (
    <li
      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100"
    >
      {/* MODUL 2: Mengakses property object dengan dot notation */}
      <div>
        <p className="text-gray-700 font-medium">
          {task.title}
        </p>
	      
        <p className="text-sm text-gray-500">
          Kategori: {task.category}
        </p>
	      
        <p className="text-sm text-gray-500">
          {task.date} | {task.time}
        </p>

        <p className="text-sm text-gray-500">
          Status: {task.status}
        </p>
      </div>

      <button
        type="button"
        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
        aria-label="Hapus tugas"
	onClick={deleteOwnTask}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  );
}
