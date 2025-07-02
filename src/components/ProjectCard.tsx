import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  link?: string;
  gradientClass?: string;
}

export default function ProjectCard({ title, description, image, link, gradientClass = "bg-gradient-to-br from-blue-500 to-purple-600" }: ProjectCardProps) {
  return (
    <div className="glass w-full rounded-2xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 ease-out h-[460px] flex flex-col overflow-hidden">
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
          <div className="flex-grow overflow-y-auto mb-6 custom-scrollbar">
            <p className="text-base text-[var(--foreground)] opacity-80 leading-relaxed">
              {description}
            </p>
          </div>
          {link && (
            <div className="mt-auto">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="icy-button inline-block w-full px-6 py-3 rounded-xl font-medium text-[var(--foreground)] shadow-lg hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 text-center"
              >
                View Project
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
