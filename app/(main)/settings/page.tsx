"use client";

import { Header } from "@/components/Header";
import { Save, User, Lock, Bell, Globe, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await fetch("/api/user");
            if (res.ok) {
                const data = await res.json();
                setUsername(data.username || "");
                setEmail(data.email || "");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email }),
            });

            if (res.ok) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
            } else {
                const errorData = await res.json();
                setMessage({ type: "error", text: errorData.error || "Failed to update profile." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Header title="Settings" />

            <div className="max-w-2xl mx-auto px-6 py-8">

                <div className="flex flex-col md:flex-row gap-">

                    {/* Main Form */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Settings</h2>

                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                                message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-6">
                        

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Username</label>
                                    <input 
                                        type="text" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none" 
                                        placeholder="Enter username"
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none" 
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
