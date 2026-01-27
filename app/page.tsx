
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 text-center bg-white">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="space-y-4">
            <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
              <span className="block">Connect. Learn.</span>
              <span className="block text-indigo-600">Grow Together.</span>
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Atria is the premier peer-to-peer platform for high school students.
              Find tutors, offer your expertise, and discover exciting extracurricular activities.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/auth"
              className="px-8 py-3 text-base font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Join the Community
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-3">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-bold text-gray-900">Find a Tutor</h3>
              <p className="mt-2 text-gray-500">
                Freshmen and Sophomores can request help in any subject.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-lg font-bold text-gray-900">Become a Tutor</h3>
              <p className="mt-2 text-gray-500">
                Juniors and Seniors can share their knowledge and earn hours.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🌟</div>
              <h3 className="text-lg font-bold text-gray-900">Extracurriculars</h3>
              <p className="mt-2 text-gray-500">
                Discover and participate in local activities and clubs.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
