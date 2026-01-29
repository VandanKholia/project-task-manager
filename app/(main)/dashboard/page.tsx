"use client";

import { CreateTaskModal } from "@/components/CreateTaskModal";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Folder,
  MoreVertical,
  Plus,
  TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Data State
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch User (if not already valid, but we need strictly for filtering)
      const userRes = await fetch("/api/user");
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);

        // 2. Fetch Projects and Tasks in parallel
        const [projectsRes, tasksRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/tasks")
        ]);

        if (projectsRes.ok) {
          setProjects(await projectsRes.json());
        }

        if (tasksRes.ok) {
          const allTasks = await tasksRes.json();
          setTasks(allTasks);

          // Filter my tasks
          const mine = allTasks.filter((t: any) => t.assignedTo?.username === userData.username);
          setMyTasks(mine);
        }

      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Dashboard load failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  // Compute Stats
  const totalProjects = projects.length;
  // Count tasks by status from ALL tasks (org view)
  const pendingTasks = tasks.filter((t: any) => t.status === "Pending" || t.status === "InProgress").length;
  const completedTasks = tasks.filter((t: any) => t.status === "Completed").length;
  // Simple "productivity" metric: Completed / Total * 100
  const totalTasks = tasks.length;
  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: "Total Projects", value: totalProjects.toString(), icon: Folder, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Tasks Pending", value: pendingTasks.toString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Completed", value: completedTasks.toString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Productivity", value: `${productivity}%`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100" },
  ];

  // Limit recent tasks to 5
  const recentTasksDisplay = myTasks.slice(0, 5);

  const activities = [
    { id: 1, user: "Alice Johnson", action: "completed task", target: "Homepage Hero Section", time: "2h ago" },
    { id: 2, user: "Bob Smith", action: "commented on", target: "Database Schema", time: "4h ago" },
    { id: 3, user: "Charlie Davis", action: "added a new project", target: "Q1 Roadmap", time: "Yesterday" },
  ];

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <Header title="Dashboard" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Welcome Section */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user?.username}</h2>
            <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
          </div>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md shadow-indigo-200 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Task
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Tasks */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">My Priority Tasks</h3>
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All</button>
            </div>

            <div className="space-y-4">
              {recentTasksDisplay.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No tasks assigned to you yet.
                </div>
              ) : (
                recentTasksDisplay.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors group">
                    <div className="flex items-start gap-4">
                      <button className={`mt-1 h-5 w-5 rounded border flex items-center justify-center ${task.status === "Completed" ? "bg-green-500 border-green-500 text-white" : "border-slate-300 bg-white hover:border-indigo-500"}`}>
                        {task.status === "Completed" && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </button>
                      <div>
                        <h4 className={`font-semibold text-slate-800 ${task.status === "Completed" ? "line-through text-slate-400" : ""}`}>{task.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          <span className="font-medium text-slate-600">{task.project}</span> • Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full 
                        ${task.priority === "High" ? "bg-red-100 text-red-700" :
                          task.priority === "Medium" ? "bg-amber-100 text-amber-700" :
                            "bg-blue-100 text-blue-700"}`}>
                        {task.priority}
                      </span>
                      <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
            </div>

            <div className="relative pl-4 border-l border-slate-200 space-y-8">
              {activities.map((activity, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-300 border-2 border-white ring-2 ring-slate-100"></div>
                  <p className="text-sm text-slate-600">
                    <span className="font-bold text-slate-800">{activity.user}</span> {activity.action} <span className="font-medium text-slate-800">{activity.target}</span>
                  </p>
                  <span className="text-xs text-slate-400 mt-1 block">{activity.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Team Workload</h4>
              <div className="space-y-4">
                {[
                  { name: "Dev Team", progress: 75, color: "bg-indigo-500" },
                  { name: "Design", progress: 45, color: "bg-pink-500" },
                  { name: "Marketing", progress: 60, color: "bg-cyan-500" }
                ].map((dept, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">{dept.name}</span>
                      <span className="text-slate-500">{dept.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${dept.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={fetchDashboardData}
      />
    </div>
  );
}