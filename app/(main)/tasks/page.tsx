"use client";

import { CreateTaskModal } from "@/components/CreateTaskModal";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import {
    Calendar,
    CheckCircle2,
    ChevronDown,
    Clock,
    Filter,
    MoreVertical,
    Search,
    AlertCircle,
    Loader2,
} from "lucide-react";

interface Task {
    id: number;
    title: string;
    description: string | null;
    priority: "Low" | "Medium" | "High";
    status: "Pending" | "InProgress" | "Completed";
    dueDate: string | null;
    project: string;
    assignedTo: { username: string; email: string } | null;
}

function formatDueDate(dateStr: string | null): string {
    if (!dateStr) return "No due date";
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const due = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffMs = due.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isOverdue(dateStr: string | null): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

export default function MyTasksPage() {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "InProgress" | "Completed">("All");
    const [onlyMine, setOnlyMine] = useState(false);

    const fetchTasks = async (assignedToMe: boolean = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = assignedToMe ? "/api/tasks?assignedToMe=true" : "/api/tasks";
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            } else {
                setError("Failed to load tasks.");
            }
        } catch (err) {
            setError("Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks(onlyMine);
    }, [onlyMine]);

    const toggleTaskStatus = async (task: Task) => {
        const newStatus = task.status === "Completed" ? "Pending" : "Completed";
        // Optimistic update
        setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
        );
        try {
            await fetch(`/api/tasks/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch {
            // Revert on error
            fetchTasks(onlyMine);
        }
    };

    const filteredTasks = tasks.filter((t) => {
        const matchesSearch =
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.project.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const counts = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "Pending").length,
        inProgress: tasks.filter((t) => t.status === "InProgress").length,
        completed: tasks.filter((t) => t.status === "Completed").length,
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Header title="My Tasks" />

            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Total", value: counts.total, color: "text-slate-700", bg: "bg-white" },
                        { label: "Pending", value: counts.pending, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "In Progress", value: counts.inProgress, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Completed", value: counts.completed, color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} rounded-xl border border-slate-200 px-5 py-4 shadow-sm`}>
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                            <div className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Actions bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 w-56 text-sm shadow-sm"
                            />
                        </div>
                        <div className="flex bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                            {(["All", "Pending", "InProgress", "Completed"] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-3 py-2 text-xs font-medium transition-colors ${statusFilter === s
                                        ? "bg-indigo-600 text-white"
                                        : "text-slate-500 hover:bg-slate-50"
                                        }`}
                                >
                                    {s === "InProgress" ? "In Progress" : s}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setOnlyMine(!onlyMine)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${onlyMine
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            My Tasks Only
                        </button>
                    </div>
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md shadow-indigo-200 transition-colors text-sm font-medium"
                    >
                        + Create Task
                    </button>
                </div>

                {/* Task List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">
                            {statusFilter === "All" ? "All Tasks" : statusFilter === "InProgress" ? "In Progress" : statusFilter} ({filteredTasks.length})
                        </h3>
                        <span className="text-xs text-slate-500">Sorted by: Due Date</span>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin mb-3" />
                            <span className="text-sm">Loading your tasks...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-red-400">
                            <AlertCircle className="h-8 w-8 mb-3" />
                            <span className="text-sm">{error}</span>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <CheckCircle2 className="h-10 w-10 mb-3 text-slate-300" />
                            <p className="font-semibold text-slate-600">No tasks found</p>
                            <p className="text-sm mt-1">
                                {tasks.length === 0
                                    ? "You have no tasks assigned to you yet."
                                    : "No tasks match your current filter."}
                            </p>
                            {tasks.length === 0 && (
                                <button
                                    onClick={() => setIsTaskModalOpen(true)}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Create your first task
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredTasks.map((task) => {
                                const overdue = task.status !== "Completed" && isOverdue(task.dueDate);
                                const dueLabel = formatDueDate(task.dueDate);
                                return (
                                    <div
                                        key={task.id}
                                        className="p-4 hover:bg-slate-50 flex items-center justify-between group transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <button
                                                onClick={() => toggleTaskStatus(task)}
                                                className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors flex-shrink-0
                                                    ${task.status === "Completed"
                                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                                        : "border-slate-300 text-transparent hover:border-indigo-500 hover:text-indigo-500"
                                                    }`}
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                            </button>
                                            <div className="flex flex-col min-w-0">
                                                <span className={`font-semibold text-sm ${task.status === "Completed" ? "text-slate-400 line-through" : "text-slate-800"}`}>
                                                    {task.title}
                                                </span>
                                                <span className="text-xs text-slate-500 flex items-center mt-1 gap-2">
                                                    <span className="font-medium text-slate-600">{task.project}</span>
                                                    {task.status !== "Completed" && task.dueDate && (
                                                        <span className={`flex items-center ${overdue ? "text-red-500 font-bold" : dueLabel === "Today" ? "text-amber-500 font-bold" : ""}`}>
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {dueLabel}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full
                                                ${task.priority === "High" ? "bg-red-50 text-red-700 border border-red-100" :
                                                    task.priority === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                                        "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                                                {task.priority}
                                            </span>
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full min-w-[90px] text-center
                                                ${task.status === "InProgress" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                                                    task.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                        "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                                                {task.status === "InProgress" ? "In Progress" : task.status}
                                            </span>
                                            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200/50 transition-colors">
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={() => fetchTasks(onlyMine)}
            />
        </div>
    );
}
