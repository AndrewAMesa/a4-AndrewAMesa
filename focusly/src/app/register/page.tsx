"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            router.push(`/login?email=${encodeURIComponent(email)}`);
        } else {
            setError("Registration failed");
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4 text-black">Register</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 text-black rounded-lg mb-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 text-black rounded-lg mb-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-700 transition"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center mt-4 text-black">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
