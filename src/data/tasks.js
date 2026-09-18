const tasks = [
  {
    id: 1,
    title: "Merapikan Sepatu",
    category: "Pribadi",
    date: "18 September 2026",
    time: "18:00",
    completed: false,
    status: "",
  },
  {
    id: 2,
    title: "Belajar Bootcamp EXERCISE",
    category: "Bootcamp",
    date: "19 September 2026",
    time: "19:00",
    completed: true,
    status: "",
  },
];

// Contoh data baru
const newTask = {
  id: 3,
  title: "Mengerjakan tugas DSD",
  category: "Pribadi",
  date: "20 September 2026",
  time: "20:00",
  completed: false,
  status: "",
};

// Menambahkan data baru ke array
tasks.push(newTask);

// Menentukan status setiap task
for (let i = 0; i < tasks.length; i++) {
  if (tasks[i].completed === true) {
    tasks[i].status = "Selesai";
  } else {
    tasks[i].status = "Belum selesai";
  }
}

export default tasks;