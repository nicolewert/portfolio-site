import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ResumeSection from "../components/ResumeSection";
import ContactForm from "../components/ContactForm";
import Head from "next/head";
import Link from "next/link";
import { SiLeetcode } from "react-icons/si";
import projectsData from "../data/projects.json";

const projects = projectsData;

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
					<section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[var(--background)] via-[var(--background)] to-[var(--background)]/80">
						<div className="glass w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg">
						<h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)] animate-fade-in">
							Nicole Wert
							<span className="text-xl sm:text-2xl lg:text-3xl font-medium block mt-4 text-[var(--secondary)]">Software Engineer · AI Enthusiast · Problem Solver</span>
						</h1>
							<img
								src="/profile_picture.png"
								alt="Nicole Wert"
								className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mt-4 sm:mt-6 rounded-full border-2 border-[var(--foreground)]/10 shadow-xl dark:shadow-[var(--foreground)]/5 hover:scale-105 transition-transform duration-300 ease-in-out"
							/>
							<p className="mt-4 sm:mt-8 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto">
								<span className="text-[var(--foreground)] font-bold">Welcome</span>
								<span className="text-[var(--secondary)]"> to my portfolio.</span>
							</p>
							{/* Social Links */}
							<div className="mt-4 sm:mt-8 flex justify-center gap-4 sm:gap-6">
								<a
									href="https://www.linkedin.com/in/nicole-wert-205981187/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										stroke="currentColor"
										strokeWidth="0.5"
										viewBox="0 0 24 24"
										className="w-7 h-7 hover:scale-110 transition-transform duration-300"
									>
										<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.064-1.867-3.064-1.868 0-2.156 1.459-2.156 2.967v5.701h-3v-10h2.888v1.367h.041c.403-.764 1.388-1.567 2.857-1.567 3.053 0 3.617 2.01 3.617 4.623v5.577z" />
									</svg>
								</a>
								<a
									href="https://github.com/nicolewert"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										stroke="currentColor"
										strokeWidth="0.5"
										viewBox="0 0 24 24"
										className="w-7 h-7 hover:scale-110 transition-transform duration-300"
									>
										<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.11.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.042.138 3.003.404 2.292-1.552 3.3-1.23 3.3-1.23.653 1.653.242 2.873.118 3.176.77.84 1.236 1.911 1.236 3.221 0 4.61-2.803 5.625-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.594 24 12.297 24 5.373 18.63.297 12 .297z" />
									</svg>
								</a>
								<a
									href="https://leetcode.com/u/nicalexxandra/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300"
								>
									<SiLeetcode className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--foreground)] hover:scale-110 transition-transform duration-300" />
								</a>
							</div>
						</div>
						{/* Scroll Indicator */}
						<div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
							<span className="text-[var(--secondary)]/60 dark:text-[var(--secondary)]/50 text-[10px] sm:text-sm mb-1 sm:mb-2 font-medium">Scroll</span>
							<svg
								className="w-4 h-4 sm:w-6 sm:h-6 text-[var(--secondary)]/60 dark:text-[var(--secondary)]/50"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
							</svg>
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
								<a
									href="https://github.com/nicolewert"
									target="_blank"
									rel="noopener noreferrer"
									className="icy-button inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-[var(--foreground)] shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
								>
									See My GitHub
								</a>
							</div>
						</div>
					</section>

				   {/* Resume Section */}
				   <section id="resume" className="py-20">
					   <ResumeSection />
				   </section>

				   {/* Contact Section */}
				   <section id="contact" className="py-20">
					   <ContactForm />
				   </section>
				</div>
			</main>
		</>
	);
}
