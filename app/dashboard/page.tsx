'use client'
import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, Filter, LayoutDashboard, List, Plus, Search, Settings, User, Users, X, ChevronRight, AlertCircle, MessageSquare, History, Edit2, Trash2 } from 'lucide-react';

const staticData = {
  user: {
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Project Manager"
  },
  projects: [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website",
      createdBy: "John Doe",
      createdAt: "2024-01-15",
      taskCount: 12,
      completedTasks: 5
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "iOS and Android app for customer portal",
      createdBy: "Jane Smith",
      createdAt: "2024-01-20",
      taskCount: 18,
      completedTasks: 8
    },
    {
      id: 3,
      name: "Marketing Campaign Q1",
      description: "Social media and email marketing for Q1",
      createdBy: "Mike Johnson",
      createdAt: "2024-02-01",
      taskCount: 8,
      completedTasks: 6
    }
  ],
  tasks: [
    {
      id: 1,
      projectId: 1,
      title: "Design Homepage Mockup",
      description: "Create initial design concepts for the new homepage",
      priority: "High",
      status: "Pending",
      assignedTo: "Sarah Wilson",
      dueDate: "2024-02-15",
      createdAt: "2024-01-16"
    },
    {
      id: 2,
      projectId: 1,
      title: "Implement Navigation Bar",
      description: "Develop responsive navigation with dropdown menus",
      priority: "High",
      status: "In Progress",
      assignedTo: "John Doe",
      dueDate: "2024-02-10",
      createdAt: "2024-01-18"
    },
    {
      id: 3,
      projectId: 1,
      title: "Create Content Strategy",
      description: "Plan content structure and SEO optimization",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "Emily Brown",
      dueDate: "2024-02-12",
      createdAt: "2024-01-20"
    },
    {
      id: 4,
      projectId: 1,
      title: "Set up Development Environment",
      description: "Configure servers and deployment pipeline",
      priority: "High",
      status: "Completed",
      assignedTo: "John Doe",
      dueDate: "2024-01-25",
      createdAt: "2024-01-16"
    },
    {
      id: 5,
      projectId: 1,
      title: "User Testing Plan",
      description: "Create comprehensive testing scenarios",
      priority: "Medium",
      status: "Pending",
      assignedTo: "Sarah Wilson",
      dueDate: "2024-02-20",
      createdAt: "2024-01-22"
    },
    {
      id: 6,
      projectId: 1,
      title: "Database Schema Design",
      description: "Design and document database structure",
      priority: "Low",
      status: "Pending",
      assignedTo: "Mike Johnson",
      dueDate: "2024-02-18",
      createdAt: "2024-01-23"
    }
  ],
  comments: [
    {
      id: 1,
      taskId: 2,
      user: "Sarah Wilson",
      text: "Looking great! The responsive design works perfectly on mobile.",
      createdAt: "2024-02-05 10:30"
    },
    {
      id: 2,
      taskId: 2,
      user: "John Doe",
      text: "Thanks! I'll add the dropdown animations next.",
      createdAt: "2024-02-05 11:15"
    }
  ],
  history: [
    {
      id: 1,
      taskId: 2,
      changedBy: "John Doe",
      changeType: "Status changed from Pending to In Progress",
      changeTime: "2024-02-03 09:00"
    },
    {
      id: 2,
      taskId: 2,
      changedBy: "John Doe",
      changeType: "Assigned to John Doe",
      changeTime: "2024-02-03 09:05"
    }
  ]
};
export default function Dashboard() {
    const myTasks = staticData.tasks.filter(t => t.assignedTo === staticData.user.name);
    const pendingTasks = myTasks.filter(t => t.status === 'Pending');
    const inProgressTasks = myTasks.filter(t => t.status === 'In Progress');
    const completedTasks = myTasks.filter(t => t.status === 'Completed');

    return (
      <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-600 mt-1">Welcome back, {staticData.user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Tasks</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{pendingTasks.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{inProgressTasks.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <AlertCircle size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{completedTasks.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-800">My Assigned Tasks</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
              <Plus size={18} />
              New Task
            </button>
          </div>
          <div className="p-6">
            {myTasks.map(task => (
              <div
                key={task.id}
                onClick={() => {
                  // setSelectedTask(task);
                  // setCurrentView('taskdetail');
                }}
                className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg cursor-pointer transition mb-2"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 rounded ${
                    task.priority === 'High' ? 'bg-red-500' :
                    task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-slate-800">{task.title}</h4>
                    <p className="text-sm text-slate-600">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.status}
                  </span>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={16} />
                    <span className="text-sm">{task.dueDate}</span>
                  </div>
                  <ChevronRight size={20} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };