import Sidebar from "@/components/Sidebar";
import { Construction } from "lucide-react";

export default function PlaceholderPage({
  role,
  title,
}: {
  role: "petani" | "admin";
  title: string;
}) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f5]">
      <Sidebar role={role} />
      <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
        <div className="card p-10 flex flex-col items-center text-center max-w-md">
          <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center mb-4">
            <Construction size={22} className="text-brand-700" />
          </div>
          <h1 className="text-lg font-semibold text-ink-900 mb-1">{title}</h1>
          <p className="text-sm text-ink-900/50">
            Halaman ini sedang dalam pengembangan. Gunakan menu Dashboard untuk kembali.
          </p>
        </div>
      </main>
    </div>
  );
}
