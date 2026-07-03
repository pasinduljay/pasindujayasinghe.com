import React from "react";
import { useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { PortfolioData } from "@/lib/data";

interface ProjectItemProps {
    index: number;
    removeProject: (i: number) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = React.memo(({ index, removeProject }) => {
    const { register } = useFormContext<PortfolioData>();
    return (
        <div className="relative bg-gradient-to-br from-black/60 to-black/20 p-6 rounded-3xl border border-white/5 hover:border-cyber-green/30 transition-all group">
            <button
                type="button"
                onClick={() => removeProject(index)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 z-10"
            >
                <Trash2 size={18} />
            </button>
            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Project Title</label>
                    <input {...register(`projects.${index}.title`)} className="w-full bg-transparent border-b border-white/10 text-base font-bold text-white p-1 focus:border-cyber-green focus:ring-0 transition-all outline-none placeholder-gray-700" placeholder="System Name" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea {...register(`projects.${index}.description`)} className="w-full bg-white/5 border-none text-gray-300 p-3 rounded-lg focus:ring-1 focus:ring-cyber-green h-16 resize-none placeholder-gray-600 text-xs" placeholder="System Architecture & Logic..." />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Deployment URL</label>
                    <input {...register(`projects.${index}.link`)} className="w-full bg-black/20 border border-white/10 text-cyber-cyan p-2 rounded-lg focus:border-cyber-cyan focus:ring-0 outline-none font-mono text-xs" placeholder="https://" />
                </div>
            </div>
        </div>
    );
});

ProjectItem.displayName = "ProjectItem";

export default ProjectItem;
