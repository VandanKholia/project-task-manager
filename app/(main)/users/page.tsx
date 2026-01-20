"use client";

import { Header } from "@/components/Header";
import { Mail, MoreVertical, Plus, Shield, Trash2, UserCog } from "lucide-react";

export default function UsersPage() {
    const users = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", initials: "JD" },
        { id: 2, name: "Alice Smith", email: "alice@example.com", role: "Manager", status: "Active", initials: "AS" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Developer", status: "Active", initials: "MJ" },
        { id: 4, name: "Robert Key", email: "rob@example.com", role: "Developer", status: "Offline", initials: "RK" },
        { id: 5, name: "Sarah Connor", email: "sarah@example.com", role: "Viewer", status: "Active", initials: "SC" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Header title="Team Members" />

            <div className="max-w-6xl mx-auto px-6 py-8">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Organization Users</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage access and roles for your team projects.</p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg shadow-indigo-200/50 transition-all">
                        <Plus className="h-5 w-5 mr-2" />
                        Add User
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-sm text-slate-600">User</th>
                                <th className="px-6 py-4 font-semibold text-sm text-slate-600">Role</th>
                                <th className="px-6 py-4 font-semibold text-sm text-slate-600">Status</th>
                                <th className="px-6 py-4 font-semibold text-sm text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-4 text-sm">
                                                {user.initials}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-800">{user.name}</div>
                                                <div className="text-xs text-slate-500 flex items-center mt-0.5">
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <Shield className="h-4 w-4 mr-2 text-slate-400" />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full 
                                    ${user.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit Role">
                                                <UserCog className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove User">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
