import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ResumeSection from "../components/ResumeSection";
import ContactForm from "../components/ContactForm";
import Head from "next/head";
import Link from "next/link";

const projects = [
	{
		title: "Project 1",
		description: "A project description.",
		image: "#",
		link: "#",
		gradientClass: "bg-gradient-to-br from-gray-700 to-gray-500",
	},
	{
		title: "Project 2",
		description: "A project description.",
		image: "/portfolio.jpg",
		link: "#",
		gradientClass: "bg-gradient-to-br from-gray-700 to-gray-500",
	},
	{
		title: "Project 3",
		description: "A project description.",
		image: "/portfolio.jpg",
		link: "#",
		gradientClass: "bg-gradient-to-br from-gray-700 to-gray-500",
	},
];

export default function Home() {
	return (
		<>
			<Head>
				<title>Nicole Wert | Portfolio</title>
				<meta name="description" content="Nicole Wert's portfolio website" />
			</Head>
			<Navbar />
			<main className="min-h-screen bg-[var(--background)] w-full">
				<div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Hero Section */}
					<section className="flex flex-col items-center justify-center py-24 lg:py-32">
						<div className="glass w-full max-w-4xl mx-auto px-6 py-16 text-center rounded-2xl">
							<h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)]">
								Nicole Wert
							</h1>
							<p className="mt-8 text-xl lg:text-2xl leading-relaxed text-[var(--foreground)] max-w-2xl mx-auto">
								Welcome to my portfolio.
							</p>
						</div>
					</section>

					{/* Projects Section */}
					<section id="projects" className="py-20">
						<div className="glass px-6 py-16 max-w-6xl mx-auto rounded-2xl">
							<h2 className="text-4xl lg:text-5xl font-bold text-center text-[var(--foreground)] mb-16">
								Featured Projects
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
								{projects.slice(0, 3).map((project) => (
									<ProjectCard key={project.title} {...project} />
								))}
							</div>
							<div className="text-center">
								<Link
									href="/projects"
									className="icy-button inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-[var(--foreground)] shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
								>
									See All Projects
								</Link>
							</div>
						</div>
					</section>

					{/* Resume Section */}
					<section className="py-20">
						<ResumeSection />
					</section>

					{/* Contact Section */}
					<section className="py-20">
						<ContactForm />
					</section>
				</div>
			</main>
		</>
	);
}
