import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import Head from "next/head";

const projects = [
  {
    title: "Apple-Inspired UI",
    description: "A modern, glassmorphic React UI inspired by Apple.com.",
    image: "#",
    link: "#",
  },
  {
    title: "Portfolio Website",
    description: "This site! Built with Next.js, TypeScript, and Tailwind CSS.",
    image: "/portfolio.jpg",
    link: "#",
  },
  // Add more projects as needed
];

export default function Projects() {
  return (
    <>
      <Head>
        <title>All Projects | Nicole Wert</title>
        <meta name="description" content="Nicole Wert's full project list" />
      </Head>
      <Navbar />
      <main className="pt-32 pb-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center">
        <section className="max-w-5xl w-full">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">All Projects</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
