"use client"
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdDescription } from "react-icons/md";
import { useRef, useEffect } from "react";


interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  github?: string;
  live?: string;
  documentation?: string;
  tags?: string[];
  gradientClass?: string;
}

export default function ProjectCard(props: ProjectCardProps) {
  const { title, description, image, github, live, documentation, tags, gradientClass = "bg-gradient-to-br from-blue-500 to-purple-600" } = props;
  const descRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desc = descRef.current;
    const fade = fadeRef.current;
    if (!desc || !fade) return;
    // Show fade if content is overflowing
    if (desc.scrollHeight > desc.clientHeight) {
      fade.style.opacity = '1';
    } else {
      fade.style.opacity = '0';
    }
  }, [description]);

  return (
    <div className="glass w-full rounded-2xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 ease-out min-h-[540px] flex flex-col overflow-hidden">
      <div className={`w-full h-48 relative overflow-hidden flex-shrink-0 ${gradientClass} flex items-center justify-center`}>
        {image !== "#" && <Image src={image} alt={title} fill className="object-cover" />}
        {image === "#" && (
          <div className="text-white text-lg font-medium">
            {title}
          </div>
        )}
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            {title}
          </h3>
          <div className="flex-grow mb-4 relative">
            <div
              ref={descRef}
              className="max-h-32 overflow-y-auto custom-scrollbar pr-1 description-scrollable relative"
              id={`desc-scroll-${title.replace(/\s+/g, '-')}`}
              onScroll={e => {
                const el = e.currentTarget;
                const fade = fadeRef.current;
                if (!fade) return;
                if (el.scrollHeight - el.scrollTop === el.clientHeight) {
                  fade.style.opacity = '0';
                } else {
                  fade.style.opacity = '1';
                }
              }}
            >
              <p className="text-base text-[var(--foreground)] opacity-80 leading-relaxed">
                {description}
              </p>
            </div>
            {/* Gradient fade for scrollable content, only visible if overflow */}
            <div
              ref={fadeRef}
              id={`fade-${title.replace(/\s+/g, '-')}`}
              className="pointer-events-none absolute left-0 right-0 bottom-0 h-6 z-10 fade-gradient transition-opacity duration-200"
              style={{ opacity: 0 }}
            />
          </div>
          {/* Tags */}
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag: string) => (
                <span key={tag} className="bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {/* Links as React Icons */}
          <div className="mt-auto flex flex-row gap-4 items-center justify-end">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Repository"
                className="text-2xl text-[var(--foreground)] hover:text-[var(--primary)] hover:scale-125 transition-transform duration-200"
              >
                <FaGithub />
              </a>
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                title="Live Demo"
                className="text-2xl text-[var(--foreground)] hover:text-[var(--primary)] hover:scale-125 transition-transform duration-200"
              >
                <HiOutlineExternalLink />
              </a>
            )}
            {documentation && (
              <a
                href={documentation}
                target="_blank"
                rel="noopener noreferrer"
                title="Documentation"
                className="text-2xl text-[var(--foreground)] hover:text-[var(--primary)] hover:scale-125 transition-transform duration-200"
              >
                <MdDescription />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
