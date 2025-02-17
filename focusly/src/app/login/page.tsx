"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid Credentials");
        } else {
            router.push("/");
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl text-black font-bold text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border text-black border-gray-300 rounded-lg mb-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border text-black border-gray-300 rounded-lg mb-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-slate-800  text-white p-3 rounded-lg hover:bg-slate-600 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-4 text-black">
                    No account?{" "}
                    <Link href="/register" className="text-blue-600 ">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
