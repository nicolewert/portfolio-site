"use client"
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdDescription } from "react-icons/md";
import { useRef, useEffect, useState } from "react";


interface ProjectCardProps {
  title: string;
  description: string;
  images: string[];
  github?: string;
  live?: string;
  documentation?: string;
  tags?: string[];
  gradientClass?: string;
  large?: boolean;
}

export default function ProjectCard(props: ProjectCardProps) {
  const { title, description, images = ["#"], github, live, documentation, tags, gradientClass = "bg-gradient-to-br from-blue-500 to-purple-600", large = false } = props;
  const descRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const imageCount = images.length;
  const handleDotClick = (idx: number) => setCurrentImage(idx);
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentImage((prev) => (prev + 1) % imageCount);
    } else {
      setCurrentImage((prev) => (prev - 1 + imageCount) % imageCount);
    }
  };
  // Touch events for swipe/tap distinction
  const touchStartX = useRef<number | null>(null);
  const touchMoved = useRef<boolean>(false);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchMoved.current = false;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = Math.abs(e.touches[0].clientX - touchStartX.current);
      if (diff > 10) {
        touchMoved.current = true;
      }
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      handleSwipe(diff < 0 ? 'left' : 'right');
    }
    touchStartX.current = null;
    // No need to reset touchMoved here, will be reset on next start
  };
  // Only advance on click if not a swipe
  const handleImageClick = () => {
    if (imageCount > 1 && !touchMoved.current) {
      setCurrentImage((prev) => (prev + 1) % imageCount);
    }
  };

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
    <div className={`glass w-full rounded-2xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 ease-out ${large ? 'min-h-[400px] sm:min-h-[900px]' : 'min-h-[300px] sm:min-h-[540px]'} flex flex-col overflow-hidden`}>
      {/* Image carousel */}
      <div
        className={`w-full ${large ? 'h-48 sm:h-96' : 'h-32 sm:h-48'} relative overflow-hidden flex-shrink-0 ${gradientClass} flex items-center justify-center cursor-pointer`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleImageClick}
        title={imageCount > 1 ? 'Click or scroll to view next image' : undefined}
        style={{ userSelect: 'none' }}
      >
        {images[currentImage] !== "#" ? (
          <Image src={images[currentImage]} alt={title} fill className="object-cover transition-all duration-300" />
        ) : (
          <div className="text-white text-lg font-medium">
            {title}
          </div>
        )}
        {/* Dots for images */}
        {imageCount > 1 && (
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20 px-4 py-2 rounded-full backdrop-blur-md bg-black/40 shadow-lg items-center"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to image ${idx + 1}`}
                className={`w-3 h-3 rounded-full border-2 border-white/80 shadow-md ${currentImage === idx ? 'bg-white/90' : 'bg-white/40'} transition-all duration-200`}
                style={{ outline: 'none' }}
                onClick={e => { e.stopPropagation(); handleDotClick(idx); }}
                tabIndex={0}
              />
            ))}
          </div>
        )}
      </div>
      <div className={`p-4 sm:p-8 flex flex-col flex-grow ${large ? 'text-lg' : ''}`}>
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            {title}
          </h3>
          <div className="sm:flex-grow mb-4 relative">
            <div
              ref={descRef}
              className="max-h-20 sm:max-h-32 overflow-y-auto custom-scrollbar pr-1 description-scrollable relative"
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
              <p className="text-sm sm:text-base text-[var(--foreground)] opacity-80 leading-relaxed">
                {description}
              </p>
            </div>
            {/* Gradient fade for scrollable content, only visible if overflow */}
            <div
              ref={fadeRef}
              id={`fade-${title.replace(/\s+/g, '-')}`}
              className="pointer-events-none absolute left-0 right-0 bottom-0 h-8 sm:h-6 z-10 fade-gradient transition-opacity duration-200"
              style={{ opacity: 0 }}
            />
          </div>
          {/* Tags */}
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag: string) => (
                <span key={tag} className="bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium">
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
                className="text-xl sm:text-2xl text-[var(--foreground)] hover:text-[var(--primary)] hover:scale-125 transition-transform duration-200"
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
                className="text-xl sm:text-2xl text-[var(--foreground)] hover:text-[var(--primary)] hover:scale-125 transition-transform duration-200"
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
                className="text-xl sm:text-2xl text-[var(--foreground)] hover:text-[var(--primary)] hover:scale-125 transition-transform duration-200"
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
