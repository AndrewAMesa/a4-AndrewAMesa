"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams} from "next/navigation";

export default function UpdateTask() {
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("");
    const [deadline, setDeadline] = useState("");
    const router = useRouter();

    const searchParams = useSearchParams();
    const taskId = searchParams.get("taskId");

    useEffect(() => {
        const fetchTaskDetails = async () => {
            if (!taskId) return;
            const response = await fetch("api/tasks", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const tasks = await response.json();
            const taskData = tasks.find((t: { _id: string }) => t._id === taskId);

            if (taskData) {
                setTask(taskData.task);
                setDeadline(new Date(taskData.deadline_date).toISOString().split("T")[0]);
                setPriority(taskData.priority);
            }
        };
        fetchTaskDetails();
    }, [taskId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let response = await fetch(`api/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: task, priority: priority, deadline_date: deadline })
        });

        if (response.ok) {
            router.push("/");
        } else {
            alert("Error adding task");
        }
    };

    return (
        <div className="bg-gray-300 min-h-screen font-nunito">

        <header id="main-header" className="bg-slate-800 text-white pl-8 pt-3 pd-2">
            <h1 id="welcome-text" className="text-3xl font-bold">Focusly</h1>
        </header>

        <nav className="bg-slate-800 text-white pt-4 pl-4 pb-4">
            <ul className="flex space-x-4">
                <li>
                    <a href="/"
                       className="px-4 py-2 rounded-md hover:bg-slate-700 transition text-white text-center inline-block">Home</a>
                </li>
            </ul>
        </nav>

        <main className="container mx-auto my-8 max-w-3xl px-6 py-6 bg-white shadow-md rounded-md">
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label htmlFor="task" className="block text-base font-semibold text-gray-800">New Task
                        Description</label>
                    <input type="text"
                           id="task"
                           value={task}
                           onChange={(e) => setTask(e.target.value)}
                           className="w-full mt-1 p-2 border text-black border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                           placeholder="Enter new task description"
                           required/>
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
                    <label htmlFor="deadline_date" className="block text-base font-semibold text-gray-800">New Task
                        Deadline</label>
                    <input type="date"
                           id="deadline_date"
                           value={deadline}
                           onChange={(e) => setDeadline(e.target.value)}
                           className="w-full mt-1 p-2 border text-black border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                           required/>
                </div>

                <button type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
                    Update Task
                </button>
            </form>
        </main>
        </div>
    );
}
