"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Settings,
    LogOut,
    Kanban
} from "lucide-react";

export function Sidebar() {
    const router = useRouter();
    const handelLogout = ()=> {
        fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        })
        .then(res => {
            if (res.ok) {
                router.push("/login");
            }
        })
    }
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Projects", href: "/projects", icon: FolderKanban },
        { name: "My Tasks", href: "/tasks", icon: CheckSquare },
        { name: "Team", href: "/users", icon: Users },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col border-r border-slate-800 hidden md:flex fixed left-0 top-0 bottom-0 z-50">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <Kanban className="h-8 w-8 text-indigo-500 mr-2" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                    ProjectPro
                </span>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon className={`h-5 w-5 mr-3 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors" onClick={handelLogout}>
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
