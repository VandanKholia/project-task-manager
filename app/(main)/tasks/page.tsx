"use client";

import { CreateTaskModal } from "@/components/CreateTaskModal";
import { useState } from "react";

import { Header } from "@/components/Header";
import {
    Calendar,
    CheckCircle2,
    ChevronDown,
    Circle,
    Clock,
    Filter,
    MoreVertical,
    Search
} from "lucide-react";

const myTasks = [
    { id: 1, title: "Review Q1 Financials", project: "Finance Reports", due: "Today", status: "Pending", priority: "High" },
    { id: 2, title: "Update Component Library", project: "Design System", due: "Tomorrow", status: "In Progress", priority: "Medium" },
    { id: 3, title: "Fix Navigation Bug", project: "Mobile App", due: "Jan 12", status: "Pending", priority: "Low" },
    { id: 4, title: "Write Release Notes", project: "Version 2.0", due: "Jan 15", status: "Pending", priority: "Medium" },
    { id: 5, title: "interview Frontend Candidates", project: "Hiring", due: "Jan 18", status: "Completed", priority: "High" },
    { id: 6, title: "Update AWS Credentials", project: "DevOps", due: "Jan 20", status: "Pending", priority: "High" },
];

export default function MyTasksPage() {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Header title="My Tasks" />

            <div className="max-w-5xl mx-auto px-6 py-8">

                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md shadow-indigo-200 transition-colors text-sm font-medium"
                    >
                        + Create Task
                    </button>
                </div>

                {/* Filters */}
                {/* Filters */}
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 w-64 text-sm"
                            />
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <button className="flex items-center text-slate-600 hover:text-indigo-600 text-sm font-medium">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter by
                            <ChevronDown className="h-3 w-3 ml-1" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-200">All Status</span>
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-500 cursor-pointer hover:border-indigo-300">Due Soon</span>
                        </div>
                    </div>

                    <button className="text-sm font-medium text-slate-500 hover:text-indigo-600">
                        Clear Filters
                    </button>
                </div>

                {/* Task List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">All Tasks ({myTasks.length})</h3>
                        <span className="text-xs text-slate-500">Sorted by: Due Date</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {myTasks.map((task) => (
                            <div key={task.id} className="p-4 hover:bg-slate-50 flex items-center justify-between group transition-colors cursor-pointer">
                                <div className="flex items-center gap-4 flex-1">
                                    <button className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors 
                                ${task.status === "Completed" ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-indigo-500 hover:text-indigo-500"}`}>
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="flex flex-col">
                                        <span className={`font-semibold text-sm ${task.status === "Completed" ? "text-slate-400 line-through" : "text-slate-800"}`}>
                                            {task.title}
                                        </span>
                                        <span className="text-xs text-slate-500 flex items-center mt-1">
                                            <span className="font-medium text-slate-600 mr-2">{task.project}</span>
                                            {task.status !== "Completed" && (
                                                <span className={`flex items-center ${task.due === 'Today' ? 'text-amber-500 font-bold' : ''}`}>
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {task.due}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full 
                                ${task.priority === "High" ? "bg-red-50 text-red-700 border border-red-100" :
                                            task.priority === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                                "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                                        {task.priority}
                                    </span>
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full min-w-[90px] text-center
                                ${task.status === "In Progress" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                                            task.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                                        {task.status}
                                    </span>

                                    <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200/50 transition-colors">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 text-center">
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">Load More Tasks</button>
                    </div>
                </div>
            </div>

            <CreateTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
        </div>
    );
}
