"use client";

import { Header } from "@/components/Header";
import { Calendar, Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";

const projects = [
    {
        id: 1,
        name: "Website Redesign",
        description: "Revamp the corporate website with new branding guidelines.",
        status: "In Progress",
        progress: 65,
        dueDate: "Feb 15, 2026",
        members: ["JD", "AS", "MJ"],
        color: "bg-blue-600"
    },
    {
        id: 2,
        name: "Mobile App Launch",
        description: "Launch the iOS and Android applications to the stores.",
        status: "Planning",
        progress: 25,
        dueDate: "Mar 01, 2026",
        members: ["JD", "RK"],
        color: "bg-purple-600"
    },
    {
        id: 3,
        name: "Internal CRM",
        description: "Develop a custom CRM for the sales team.",
        status: "Completed",
        progress: 100,
        dueDate: "Jan 05, 2026",
        members: ["AS", "MJ", "RK", "JD"],
        color: "bg-emerald-600"
    },
    {
        id: 4,
        name: "Q1 Marketing Campaign",
        description: "Execute the social media strategy for Jan-March.",
        status: "In Progress",
        progress: 40,
        dueDate: "Mar 30, 2026",
        members: ["MJ", "RK"],
        color: "bg-amber-600"
    },
    {
        id: 5,
        name: "Server Migration",
        description: "Move legacy infrastructure to AWS cloud.",
        status: "On Hold",
        progress: 10,
        dueDate: "TBD",
        members: ["JD"],
        color: "bg-slate-600"
    }
];

export default function ProjectsPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <Header title="Projects" />

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 w-full md:w-64"
                            />
                        </div>
                        <button className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 bg-white shadow-sm flex items-center">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </button>
                    </div>

                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg shadow-indigo-200/50 transition-all w-full md:w-auto justify-center">
                        <Plus className="h-5 w-5 mr-2" />
                        New Project
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link href={`/projects/${project.id}`} key={project.id} className="block group">
                            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md ${project.color}`}>
                                        {project.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                                <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-grow">{project.description}</p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                      ${project.status === "In Progress" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                                project.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                    project.status === "Planning" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                                                        "bg-slate-100 text-slate-600 border border-slate-200"
                                            }`}>
                                            {project.status}
                                        </span>
                                        <span className="flex items-center text-slate-400 text-xs">
                                            <Calendar className="h-3.5 w-3.5 mr-1" />
                                            {project.dueDate}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${project.progress === 100 ? "bg-emerald-500" : "bg-indigo-500"
                                                }`}
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-xs font-medium text-slate-500">{project.progress}% Complete</span>

                                        <div className="flex -space-x-2">
                                            {project.members.map((mem, i) => (
                                                <div key={i} className="h-7 w-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                    {mem}
                                                </div>
                                            ))}
                                            {project.members.length > 3 && (
                                                <div className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    +2
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Add New Project Card (Placeholder) */}
                    <button className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-slate-50 transition-all group h-full min-h-[280px]">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                            <Plus className="h-6 w-6" />
                        </div>
                        <span className="font-semibold">Create New Project</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
