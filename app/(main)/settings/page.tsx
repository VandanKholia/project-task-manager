"use client";

import { Header } from "@/components/Header";
import { Save, User, Lock, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Header title="Settings" />

            <div className="max-w-4xl mx-auto px-6 py-8">

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation for Settings */}
                    <div className="w-full md:w-64 space-y-1">
                        <button className="w-full flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-indigo-600 font-medium shadow-sm mb-2">
                            <User className="h-4 w-4 mr-3" /> Profile
                        </button>
                        <button className="w-full flex items-center px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Lock className="h-4 w-4 mr-3" /> Security
                        </button>
                        <button className="w-full flex items-center px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Bell className="h-4 w-4 mr-3" /> Notifications
                        </button>
                        <button className="w-full flex items-center px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <Globe className="h-4 w-4 mr-3" /> Preferences
                        </button>
                    </div>

                    {/* Main Form */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Settings</h2>

                        <form className="space-y-6">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="h-20 w-20 rounded-full bg-indigo-100 border-4 border-slate-50 flex items-center justify-center text-2xl font-bold text-indigo-600">
                                    JD
                                </div>
                                <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                                    Change Avatar
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">First Name</label>
                                    <input type="text" defaultValue="John" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Last Name</label>
                                    <input type="text" defaultValue="Doe" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div className="col-span-full space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <input type="email" defaultValue="john@example.com" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div className="col-span-full space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Bio</label>
                                    <textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-none text-sm text-slate-600" defaultValue="Senior Project Manager handling multiple cross-functional teams."></textarea>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button type="button" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-200 flex items-center">
                                    <Save className="h-4 w-4 mr-2" />
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
