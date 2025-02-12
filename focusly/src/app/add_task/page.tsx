"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTask() {
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("High");
    const [deadline, setDeadline] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                task: task,
                priority: priority,
                deadline_date: deadline,
            }),
        });

        if (response.ok) {
            router.push("/");
        } else {
            alert("Error adding task");
        }
    };

    return (
        <div className="bg-gray-300 min-h-screen font-nunito">
            <header className="bg-slate-800 text-white pl-8 pt-3 pb-2">
                <h1 className="text-3xl font-bold">Focusly</h1>
            </header>

            <nav className="bg-slate-800 text-white pt-4 pl-4 pb-4">
                <ul className="flex space-x-4">
                    <li>
                        <a href="/" className="px-4 py-2 rounded-md hover:bg-slate-700 transition text-white text-center inline-block">
                            Home
                        </a>
                    </li>
                </ul>
            </nav>

            <main className="container mx-auto my-8 max-w-3xl px-8 py-6 bg-white shadow-lg rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label htmlFor="task" className="block text-base font-semibold text-gray-800">
                            Task Description
                        </label>
                        <input
                            type="text"
                            id="task"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            className="w-full mt-1 p-2 border text-black border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                            placeholder="Enter in task description"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-base font-semibold text-gray-800">
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full mt-1 p-2 border text-black border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="deadline_date" className="block text-base font-semibold text-gray-800">
                            Deadline
                        </label>
                        <input
                            type="date"
                            id="deadline_date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full mt-1 p-2 border text-black border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition">
                        Add Task
                    </button>

                </form>
            </main>
        </div>
    );
}
