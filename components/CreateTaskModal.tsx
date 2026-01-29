"use client";

import { X, Calendar, User, Flag, List } from "lucide-react";
import { useState, useEffect } from "react";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskCreated?: () => void;
}

export function CreateTaskModal({ isOpen, onClose, onTaskCreated }: CreateTaskModalProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        projectId: "",
        status: "Pending", // Default status
        priority: "Medium",
        dueDate: "",
        assignedToId: "",
        description: ""
    });

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            fetchData();
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const [projectsRes, usersRes] = await Promise.all([
                fetch("/api/projects"),
                fetch("/api/users/list")
            ]);

            if (projectsRes.ok) setProjects(await projectsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onClose();
                // Optionally trigger a refresh here if you have a context or refresher
                setFormData({
                    title: "",
                    projectId: "",
                    status: "Pending",
                    priority: "Medium",
                    dueDate: "",
                    assignedToId: "",
                    description: ""
                });
                if (onTaskCreated) onTaskCreated();
            } else {
                alert("Failed to create task");
            }
        } catch (error) {
            console.error("Error creating task", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen && !isAnimating) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Create New Task</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Title Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full text-xl font-semibold placeholder:text-slate-400 border-none focus:ring-0 p-0 text-slate-800"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Project Selection */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
                                <List className="h-3.5 w-3.5 mr-1.5" /> Project
                            </label>
                            <select
                                value={formData.projectId}
                                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">Select Project...</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.projectName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Priority Selection */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
                                <Flag className="h-3.5 w-3.5 mr-1.5" /> Priority
                            </label>
                            <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
                                {["Low", "Medium", "High"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setFormData({ ...formData, priority: p })}
                                        className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all 
                                            ${formData.priority === p ? "bg-white shadow-sm text-indigo-600" : "text-slate-600 hover:bg-white/50"}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1.5" /> Due Date
                            </label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Assignees */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
                                <User className="h-3.5 w-3.5 mr-1.5" /> Assign To
                            </label>
                            <select
                                value={formData.assignedToId}
                                onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">Unassigned</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>{u.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add more details about this task..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating..." : "Create Task"}
                    </button>
                </div>

            </div>
        </div>
    );
}
