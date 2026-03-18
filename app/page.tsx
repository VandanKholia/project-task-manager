import Link from "next/link";
import { ArrowRight, CheckCircle, Kanban, Users, Clock, Shield } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const user = await getCurrentUser();

  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 shrink-0">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Kanban className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ProjectPro</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-32 lg:pt-48 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-blue-400/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
         

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Project management <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              at lightspeed.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
            Streamline your workflow, manage complex projects, and collaborate with your team—all in one place. No more switching between tabs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="group w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-xl shadow-indigo-200 hover:shadow-indigo-300 flex items-center justify-center"
            >
              Get started
            </Link>
            
          </div>

          {/* Feature Badge/Tags */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 max-w-4xl mx-auto">
             {[ 
              { icon: Users, text: "Collaboration" },
              { icon: Shield, text: "Role Security" },
              { icon: Clock, text: "Time Tracking" },
              { icon: CheckCircle, text: "Task Done" } 
             ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-2 px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                  <feature.icon className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-700">{feature.text}</span>
                </div>
             ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <Kanban className="h-5 w-5 text-indigo-600" />
            <span className="text-lg font-bold text-slate-900">ProjectPro</span>
          </div>
          <p className="text-sm text-slate-500">© 2024 ProjectPro Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
