"use client";

import { CreateTaskModal } from "@/components/CreateTaskModal";

import { Header } from "@/components/Header";
import {
    Calendar,
    CheckSquare,
    Clock,
    MoreHorizontal,
    Paperclip,
    Plus,
    MessageSquare,
    Users
} from "lucide-react";
import { use, useState } from "react";

// Mock Data
const columns = [
    { id: "pending", title: "To Do", count: 4, color: "bg-slate-100 border-slate-200" },
    { id: "in-progress", title: "In Progress", count: 2, color: "bg-blue-50 border-blue-100" },
    { id: "completed", title: "Completed", count: 5, color: "bg-emerald-50 border-emerald-100" },
];

const initialTasks = [
    { id: 101, title: "Competitor Analysis", description: "Review top 3 competitors features.", priority: "Low", status: "pending", members: ["JD"], comments: 2, attach: 0, due: "Jan 20" },
    { id: 102, title: "Homepage Hero Design", description: "Create 3 variations for the hero section.", priority: "High", status: "pending", members: ["AS", "MJ"], comments: 5, attach: 2, due: "Jan 12" },
    { id: 103, title: "Setup Project Repo", description: "Initialize git and basic structure.", priority: "Medium", status: "pending", members: ["JD"], comments: 0, attach: 0, due: "Today" },
    { id: 104, title: "Client Meeting Prep", description: "Prepare slides for kickoff.", priority: "High", status: "pending", members: ["RK"], comments: 1, attach: 1, due: "Tomorrow" },
    { id: 201, title: "Authentication Flow", description: "Implement JWT auth with refresh tokens.", priority: "High", status: "in-progress", members: ["JD", "RK"], comments: 8, attach: 0, due: "Jan 15" },
    { id: 202, title: "Database Schema", description: "Finalize relationships and indexes.", priority: "Medium", status: "in-progress", members: ["JD"], comments: 3, attach: 1, due: "Jan 14" },
    { id: 301, title: "Project Kickoff", description: "", priority: "Low", status: "completed", members: ["All"], comments: 0, attach: 0, due: "Jan 01" },
];

export default function ProjectBoard({ params }: { params: Promise<{ id: string }> }) {
    // Unwrapping params for Next.js 15+
    const { id } = use(params);

    // Simple state for demonstration (no actual drag-n-drop logic implemented, just visual)
    const [tasks, setTasks] = useState(initialTasks);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    return (
        <div className="h-screen flex flex-col bg-slate-50 overscroll-none">
            <Header title={`Project Board #${id}`} />

            {/* Project Toolbar */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                        {["JD", "AS", "MJ", "RK"].map((u, i) => (
                            <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                                {u}
                            </div>
                        ))}
                        <button className="h-8 w-8 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-400 transition-colors">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="h-6 w-px bg-slate-300 mx-2"></div>
                    <span className="text-sm font-medium text-slate-500">Last updated: 2h ago</span>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-lg text-sm font-medium transition-colors">
                        List View
                    </button>
                    <button className="bg-indigo-50 text-indigo-700 p-2 rounded-lg text-sm font-medium flex items-center">
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Board View
                    </button>
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-1.5" />
                        New Task
                    </button>
                </div>
            </div>

            {/* Kanban Board Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex h-full space-x-6 min-w-max">

                    {columns.map((col) => (
                        <div key={col.id} className="w-80 flex flex-col h-full rounded-xl bg-slate-100/50 border border-slate-200/60 max-h-full">

                            {/* Column Header */}
                            <div className="p-4 flex justify-between items-center bg-transparent">
                                <div className="flex items-center space-x-2">
                                    <span className={`h-2.5 w-2.5 rounded-full ${col.id === "pending" ? "bg-slate-400" :
                                        col.id === "in-progress" ? "bg-blue-500" : "bg-emerald-500"
                                        }`}></span>
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{col.title}</h3>
                                    <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{initialTasks.filter(t => t.status === col.id).length}</span>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Tasks List */}
                            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3 custom-scrollbar">
                                {tasks.filter(t => t.status === col.id).map((task) => (
                                    <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase
                        ${task.priority === "High" ? "bg-red-50 text-red-600" :
                                                    task.priority === "Medium" ? "bg-amber-50 text-amber-600" :
                                                        "bg-blue-50 text-blue-600"}`}>
                                                {task.priority}
                                            </span>
                                            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <h4 className="text-sm font-semibold text-slate-800 mb-1 leading-tight">{task.title}</h4>
                                        {task.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>}

                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                            <div className="flex -space-x-1.5">
                                                {task.members.map((m, idx) => (
                                                    <div key={idx} className="h-6 w-6 rounded-full bg-slate-100 text-[9px] border border-white flex items-center justify-center font-bold text-slate-500">
                                                        {m}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex items-center space-x-3 text-slate-400">
                                                {task.comments > 0 && (
                                                    <div className="flex items-center text-xs">
                                                        <MessageSquare className="h-3 w-3 mr-1" />
                                                        {task.comments}
                                                    </div>
                                                )}
                                                {task.attach > 0 && (
                                                    <div className="flex items-center text-xs">
                                                        <Paperclip className="h-3 w-3 mr-1" />
                                                        {task.attach}
                                                    </div>
                                                )}
                                                <div className={`flex items-center text-xs ${task.due === 'Today' ? 'text-red-500 font-medium' : ''}`}>
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {task.due}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Button per column */}
                                <button
                                    onClick={() => setIsTaskModalOpen(true)}
                                    className="w-full py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center"
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Task
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add Column Button */}
                    <div className="min-w-[300px] h-full">
                        <button className="w-full bg-slate-200/50 border border-transparent hover:border-slate-300 text-slate-500 font-medium p-3 rounded-xl flex items-center justify-center transition-all h-12">
                            <Plus className="h-5 w-5 mr-2" /> Add Section
                        </button>
                    </div>

                </div>
            </div>

            <CreateTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
        </div>
    );
}
