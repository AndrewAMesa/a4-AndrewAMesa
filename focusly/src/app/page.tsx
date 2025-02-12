"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

const priorityOrder: Record<string, number> = {
  High: 1,
  Medium: 2,
  Low: 3,
};

interface Task {
  _id: string;
  task: string;
  priority: string;
  deadline_date: string;
  planned_duration: number;
}

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch(`api/tasks`);
    const data = await response.json();
    data.sort((a: { priority: string }, b: { priority: string }) =>
        priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    setTasks(data);
  };

  const deleteTask = async (id: any) => {
    await fetch(`api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      timeZone: 'UTC'
    });
  };

  return (
      <div className="bg-gray-300 font-nunito min-h-screen">
        <Head>
          <title>To-Do List</title>
        </Head>

        <header className="bg-slate-800 text-white pl-8 pt-3 pb-2">
          <h1 className="text-3xl font-bold">Focusly: Welcome</h1>
        </header>

        <nav className="bg-slate-800 text-white pt-4 pl-4 pb-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/add_task" className="px-4 py-2 rounded-md hover:bg-slate-700 transition text-white text-center inline-block">
                Add Task
              </Link>
            </li>
          </ul>
        </nav>

        <main className="container mx-auto my-6 pl-6 pr-6">
          <h1 className="text-3xl text-slate-800 font-extrabold text-center pb-2">To-Do List</h1>
          <div className="overflow-x-auto">
            <table className="table-fixed w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-center">Task</th>
                  <th className="px-6 py-3 text-center">Priority</th>
                  <th className="px-6 py-3 text-center">Deadline</th>
                  <th className="px-6 py-3 text-center">Duration</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 text-center">
                {tasks.map((task: Task) => (
                    <tr key={task._id}>
                      <td className="px-6 py-3 text-black">{task.task}</td>
                      <td className="px-6 py-3 text-black">{task.priority}</td>
                      <td className="px-6 py-3 text-black">{formatDate(task.deadline_date)}</td>
                      <td className="px-6 py-3 text-black">{task.planned_duration}</td>
                      <td className="px-6 py-3 text-black flex justify-center space-x-2">
                        <Link
                            href={`/update_task?taskId=${task._id}`}
                            className="bg-green-500 text-white px-4 py-3 w-28 text-center rounded-md shadow-md transition hover:bg-green-600 hover:shadow-lg flex items-center justify-center"
                        >
                          Update
                        </Link>
                        <button
                            onClick={() => deleteTask(task._id)}
                            className="bg-red-500 text-white px-4 py-3 w-28 text-center rounded-md shadow-md transition hover:bg-red-600 hover:shadow-lg flex items-center justify-center"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
          </div>
        </main>
      </div>
);
}