"use client";

import { Bell, Search, UserCircle } from "lucide-react";

export function Header({ title }: { title: string }) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm/50">
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>

            <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm w-64 transition-all"
                    />
                </div>

                <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                </button>

                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold border border-indigo-200 cursor-pointer hover:bg-indigo-200 transition-colors">
                    JD
                </div>
            </div>
        </header>
    );
}
