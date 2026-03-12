"use client";

import { X, User } from "lucide-react";
import { useState, useEffect } from "react";

interface EditRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRoleUpdated: () => void;
    user: any | null;
}

export function EditRoleModal({ isOpen, onClose, onRoleUpdated, user }: EditRoleModalProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            fetchRoles();
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const fetchRoles = async () => {
        try {
            const res = await fetch("/api/roles");
            if (res.ok) {
                const data = await res.json();
                setRoles(data);
                if (user && user.role) {
                    const matchedRole = data.find((r: any) => user.role.includes(r.roleName));
                    if (matchedRole) {
                        setSelectedRoleId(matchedRole.id.toString());
                    } else if (data.length > 0) {
                        setSelectedRoleId(data[0].id.toString());
                    }
                } else if (data.length > 0) {
                    setSelectedRoleId(data[0].id.toString());
                }
            }
        } catch (error) {
            console.error("Failed to fetch roles", error);
        }
    };

    const handleSubmit = async () => {
        if (!user || !selectedRoleId) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/users/${user.id}/role`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roleId: selectedRoleId }),
            });

            if (res.ok) {
                onRoleUpdated();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to update role");
            }
        } catch (error) {
            console.error("Error updating role", error);
            alert("An error occurred");
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
            <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Edit User Role</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 mb-4">
                        Change role for <span className="font-semibold text-slate-800">{user?.name}</span>
                    </p>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
                            <User className="h-3.5 w-3.5 mr-1.5" /> Role
                        </label>
                        <select
                            value={selectedRoleId}
                            onChange={(e) => setSelectedRoleId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.roleName}</option>
                            ))}
                        </select>
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
                        {isLoading ? "Saving..." : "Save Role"}
                    </button>
                </div>

            </div>
        </div>
    );
}
