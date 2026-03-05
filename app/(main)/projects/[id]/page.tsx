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
    Users,
    X,
    Loader2,
    AlertCircle,
    UserPlus,
} from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskStatus = "Pending" | "InProgress" | "Completed";

interface KanbanTask {
    id: number;
    title: string;
    description: string | null;
    priority: "Low" | "Medium" | "High";
    status: TaskStatus;
    dueDate: string | null;
    assignedTo: { id: number; username: string; initials: string } | null;
}

interface ProjectMember {
    id: number;
    name: string;
    email: string;
    role: string;
    initials: string;
    memberId: number;
}

interface AllUser {
    id: number;
    username: string;
    email: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLUMNS: { id: TaskStatus; title: string; dotColor: string }[] = [
    { id: "Pending", title: "To Do", dotColor: "bg-slate-400" },
    { id: "InProgress", title: "In Progress", dotColor: "bg-blue-500" },
    { id: "Completed", title: "Completed", dotColor: "bg-emerald-500" },
];

function formatDue(dateStr: string | null): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isOverdue(dateStr: string | null, status: TaskStatus): boolean {
    if (!dateStr || status === "Completed") return false;
    return new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));
}

// ─── Add Member Modal ─────────────────────────────────────────────────────────

function AddMemberModal({
    projectId,
    currentMembers,
    isOpen,
    onClose,
    onMemberAdded,
}: {
    projectId: string;
    currentMembers: ProjectMember[];
    isOpen: boolean;
    onClose: () => void;
    onMemberAdded: () => void;
}) {
    const [allUsers, setAllUsers] = useState<AllUser[]>([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [role, setRole] = useState("Member");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetch("/api/users/list")
                .then((r) => r.json())
                .then(setAllUsers)
                .catch(() => { });
            setSelectedUserId("");
            setRole("Member");
            setError("");
        }
    }, [isOpen]);

    const currentMemberIds = new Set(currentMembers.map((m) => m.id));
    const availableUsers = allUsers.filter((u) => !currentMemberIds.has(u.id));

    const handleAdd = async () => {
        if (!selectedUserId) {
            setError("Please select a user.");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/projects/${projectId}/members`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: Number(selectedUserId), role }),
            });
            if (res.ok) {
                onMemberAdded();
                onClose();
            } else {
                const d = await res.json();
                setError(d.error || "Failed to add member.");
            }
        } catch {
            setError("Could not connect to server.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Add Team Member</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Select User</label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">Choose a user...</option>
                            {availableUsers.map((u) => (
                                <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                            ))}
                        </select>
                        {availableUsers.length === 0 && (
                            <p className="text-xs text-slate-400 mt-1">All users are already members of this project.</p>
                        )}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                        >
                            <option value="Member">Member</option>
                            <option value="Lead">Lead</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
                <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors">Cancel</button>
                    <button
                        onClick={handleAdd}
                        disabled={isLoading || !selectedUserId}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Adding..." : "Add Member"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectBoard({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);
    const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
    const [projectName, setProjectName] = useState<string>(`Project #${id}`);

    const fetchTasks = useCallback(async () => {
        setIsLoadingTasks(true);
        try {
            const res = await fetch(`/api/projects/${id}/tasks`);
            if (res.ok) setTasks(await res.json());
        } catch { }
        finally { setIsLoadingTasks(false); }
    }, [id]);

    const fetchMembers = useCallback(async () => {
        setIsLoadingMembers(true);
        try {
            const res = await fetch(`/api/projects/${id}/members`);
            if (res.ok) setMembers(await res.json());
        } catch { }
        finally { setIsLoadingMembers(false); }
    }, [id]);

    // Fetch project name
    useEffect(() => {
        fetch("/api/projects")
            .then((r) => r.json())
            .then((projects: any[]) => {
                const p = projects.find((x) => x.id === Number(id));
                if (p) setProjectName(p.projectName);
            })
            .catch(() => { });
    }, [id]);

    useEffect(() => {
        fetchTasks();
        fetchMembers();
    }, [fetchTasks, fetchMembers]);

    // ── Drag & drop status update ──────────────────────────────────────────

    const handleDragStart = (taskId: number) => {
        setDraggedTaskId(taskId);
    };

    const handleDrop = async (targetStatus: TaskStatus) => {
        if (draggedTaskId === null) return;
        const task = tasks.find((t) => t.id === draggedTaskId);
        if (!task || task.status === targetStatus) {
            setDraggedTaskId(null);
            return;
        }
        // Optimistic
        setTasks((prev) => prev.map((t) => (t.id === draggedTaskId ? { ...t, status: targetStatus } : t)));
        setDraggedTaskId(null);

        try {
            await fetch(`/api/tasks/${draggedTaskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: targetStatus }),
            });
        } catch {
            fetchTasks();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overscroll-none">
            <Header title={projectName} />

            {/* Project Toolbar */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {/* Project members avatar strip */}
                    <div className="flex -space-x-2">
                        {isLoadingMembers ? (
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                            </div>
                        ) : members.length === 0 ? (
                            <span className="text-xs text-slate-400 italic">No members yet</span>
                        ) : (
                            members.slice(0, 6).map((m) => (
                                <div
                                    key={m.id}
                                    title={`${m.name} (${m.role})`}
                                    className="h-8 w-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700 cursor-pointer hover:z-10 hover:scale-110 transition-transform"
                                >
                                    {m.initials}
                                </div>
                            ))
                        )}
                        {members.length > 6 && (
                            <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                                +{members.length - 6}
                            </div>
                        )}
                        <button
                            onClick={() => setIsAddMemberOpen(true)}
                            title="Add member"
                            className="h-8 w-8 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-400 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="h-6 w-px bg-slate-300 mx-2" />
                    <span className="text-sm font-medium text-slate-500">
                        {members.length} member{members.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="flex items-center space-x-3">
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

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex h-full space-x-6 min-w-max">
                    {COLUMNS.map((col) => {
                        const colTasks = tasks.filter((t) => t.status === col.id);
                        return (
                            <div
                                key={col.id}
                                className="w-80 flex flex-col h-full rounded-xl bg-slate-100/50 border border-slate-200/60 max-h-full"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(col.id)}
                            >
                                {/* Column Header */}
                                <div className="p-4 flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{col.title}</h3>
                                        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                            {colTasks.length}
                                        </span>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Tasks */}
                                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
                                    {isLoadingTasks ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                                        </div>
                                    ) : colTasks.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                            <p className="text-xs text-center">No tasks here yet.</p>
                                        </div>
                                    ) : (
                                        colTasks.map((task) => {
                                            const overdue = isOverdue(task.dueDate, task.status);
                                            const dueLabel = formatDue(task.dueDate);
                                            return (
                                                <div
                                                    key={task.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(task.id)}
                                                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 cursor-grab active:cursor-grabbing transition-all group"
                                                >
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
                                                    {task.description && (
                                                        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                                                    )}

                                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                                        <div className="flex -space-x-1.5">
                                                            {task.assignedTo ? (
                                                                <div
                                                                    title={task.assignedTo.username}
                                                                    className="h-6 w-6 rounded-full bg-indigo-100 text-[9px] border border-white flex items-center justify-center font-bold text-indigo-700"
                                                                >
                                                                    {task.assignedTo.initials}
                                                                </div>
                                                            ) : (
                                                                <div className="h-6 w-6 rounded-full bg-slate-100 text-[9px] border border-white flex items-center justify-center font-bold text-slate-400">
                                                                    ?
                                                                </div>
                                                            )}
                                                        </div>

                                                        {dueLabel && (
                                                            <div className={`flex items-center text-xs ${overdue ? "text-red-500 font-medium" : dueLabel === "Today" ? "text-amber-500 font-medium" : "text-slate-400"}`}>
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                {dueLabel}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    {/* Add Task button per column */}
                                    <button
                                        onClick={() => setIsTaskModalOpen(true)}
                                        className="w-full py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center"
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Add Task
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add Column placeholder */}
                    <div className="min-w-[300px] h-full">
                        <button className="w-full bg-slate-200/50 border border-transparent hover:border-slate-300 text-slate-500 font-medium p-3 rounded-xl flex items-center justify-center transition-all h-12">
                            <Plus className="h-5 w-5 mr-2" /> Add Section
                        </button>
                    </div>
                </div>
            </div>

            {/* Members sidebar section below board */}
            {members.length > 0 && (
                <div className="bg-white border-t border-slate-200 px-6 py-3">
                    <div className="flex items-center gap-4 overflow-x-auto">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" /> Team
                        </span>
                        {members.map((m) => (
                            <div key={m.id} className="flex items-center gap-2 flex-shrink-0 bg-slate-50 border border-slate-200 rounded-full pl-1 pr-3 py-1">
                                <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                                    {m.initials}
                                </div>
                                <span className="text-xs font-medium text-slate-700">{m.name}</span>
                                <span className="text-[10px] text-slate-400">{m.role}</span>
                            </div>
                        ))}
                        <button
                            onClick={() => setIsAddMemberOpen(true)}
                            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex-shrink-0"
                        >
                            <UserPlus className="h-3.5 w-3.5" /> Add
                        </button>
                    </div>
                </div>
            )}

            <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onTaskCreated={fetchTasks}
            />

            <AddMemberModal
                projectId={id}
                currentMembers={members}
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                onMemberAdded={fetchMembers}
            />
        </div>
    );
}
