"use client";

import { X, Calendar, User, Flag, List } from "lucide-react";
import { useState, useEffect } from "react";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

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
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                                <option>Select Project...</option>
                                <option>Website Redesign</option>
                                <option>Mobile App Launch</option>
                                <option>Internal CRM</option>
                            </select>
                        </div>

                        {/* Status Selection */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
                                <Flag className="h-3.5 w-3.5 mr-1.5" /> Priority
                            </label>
                            <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
                                {["Low", "Medium", "High"].map((p) => (
                                    <button key={p} className="flex-1 text-xs font-medium py-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-600 focus:bg-white focus:shadow-sm focus:text-indigo-600">
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Assignees */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
                                <User className="h-3.5 w-3.5 mr-1.5" /> Assign To
                            </label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                                <option>Unassigned</option>
                                <option>John Doe</option>
                                <option>Alice Smith</option>
                                <option>Mike Johnson</option>
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
                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-200 transition-all transform active:scale-95">
                        Create Task
                    </button>
                </div>

            </div>
        </div>
    );
}
