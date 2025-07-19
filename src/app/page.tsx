import Navbar from '../components/Navbar'
import ProjectCard from '../components/ProjectCard'
import ResumeSection from '../components/ResumeSection'
import ContactForm from '../components/ContactForm'
import Head from 'next/head'
import { SiLeetcode, SiGithub, SiLinkedin } from 'react-icons/si'
import projectsData from '../data/projects.json'
import Image from 'next/image'

const projects = projectsData

export default function Home() {
  return (
    <>
      <Head>
        <title>Nicole Wert | Portfolio</title>
        <meta name="description" content="Nicole Wert's portfolio website" />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)] w-full">
        <div className="container max-w-7xl xl:max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[var(--background)] via-[var(--background)] to-[var(--background)]/80">
            <div className="glass w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)] animate-fade-in">
                Nicole Wert
                <span className="text-xl sm:text-2xl lg:text-3xl font-medium block mt-4 text-[var(--secondary)]">
                  Software Engineer · AI Enthusiast · Problem Solver
                </span>
              </h1>
              <Image
                src="/profile_picture.png"
                alt="Nicole Wert"
                width={128}
                height={128}
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mt-4 sm:mt-6 rounded-full border-2 border-[var(--foreground)]/10 shadow-xl dark:shadow-[var(--foreground)]/5 hover:scale-105 transition-transform duration-300 ease-in-out"
                priority
              />
              <p className="mt-4 sm:mt-8 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto">
                <span className="text-[var(--foreground)] font-bold">
                  Welcome
                </span>
                <span className="text-[var(--secondary)]">
                  {' '}
                  to my portfolio.
                </span>
              </p>
              {/* Social Links */}
              <div className="mt-4 sm:mt-8 flex justify-center gap-4 sm:gap-6">
                <a
                  href="https://www.linkedin.com/in/nicole-wert-205981187/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="LinkedIn Profile"
                >
                  <SiLinkedin className="w-7 h-7 social-icon" />
                </a>
                <a
                  href="https://github.com/nicolewert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="GitHub Profile"
                >
                  <SiGithub className="w-7 h-7 social-icon" />
                </a>
                <a
                  href="https://leetcode.com/u/nicalexxandra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label="LeetCode Profile"
                >
                  <SiLeetcode className="w-7 h-7 social-icon" />
                </a>
              </div>
            </div>
            {/* Scroll Indicator */}
            <a
              href="#projects"
              className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none"
              aria-label="Scroll to projects section"
            >
              <span className="text-[var(--secondary)]/60 dark:text-[var(--secondary)]/50 text-[10px] sm:text-sm mb-1 sm:mb-2 font-medium">
                Scroll
              </span>
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
            </a>
          </section>

          {/* Projects Section */}
          <section id="projects" className="py-24">
            <div className="px-4 sm:px-10 py-20 max-w-7xl xl:max-w-[120rem] mx-auto rounded-3xl">
              <h2 className="text-5xl lg:text-6xl font-bold text-center text-[var(--foreground)] mb-20">
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12 mb-20">
                {projects.slice(0, 3).map((project) => (
                  <ProjectCard key={project.title} {...project} large />
                ))}
              </div>
              <div className="text-center">
                <p className="text-xl font-medium text-[var(--foreground)]">
                  Want to see more?{' '}
                  <a
                    href="https://github.com/nicolewert"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 rounded"
                  >
                    GitHub
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </a>
                </p>
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
  )
}
