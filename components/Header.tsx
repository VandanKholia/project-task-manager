"use client";

import { Bell, Search, UserCircle } from "lucide-react";

export function Header({ title }: { title: string }) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm/50">
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        </header>
    );
}
