import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if(!user) {
        redirect("/login");
    }
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 md:pl-64 h-screen overflow-y-auto w-full transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
