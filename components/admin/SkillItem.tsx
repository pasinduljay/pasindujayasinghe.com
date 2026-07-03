import React from "react";
import { useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { PortfolioData } from "@/lib/data";

interface SkillItemProps {
    index: number;
    removeSkill: (i: number) => void;
}

const SkillItem: React.FC<SkillItemProps> = React.memo(({ index, removeSkill }) => {
    const { register } = useFormContext<PortfolioData>();
    return (
        <div className="group flex gap-4 items-center bg-black/20 p-3 rounded-2xl hover:bg-black/40 transition-colors border border-transparent hover:border-white/5">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-gray-500 group-hover:text-cyber-green group-hover:bg-cyber-green/10">
                {index + 1}
            </div>
            <input {...register(`skills.${index}.name`)} className="bg-transparent border-none text-white font-medium focus:ring-0 flex-1 placeholder-gray-600" placeholder="Skill Name" />
            <input {...register(`skills.${index}.category`)} className="bg-white/5 border-none text-gray-300 text-sm rounded-lg px-3 py-1 w-32 focus:ring-0 placeholder-gray-600 text-center" placeholder="Category" />
            <div className="flex items-center gap-2">
                <input {...register(`skills.${index}.level`, { valueAsNumber: true })} type="number" className="bg-transparent border-none text-cyber-green font-bold text-right w-12 focus:ring-0" />
                <span className="text-gray-600 text-xs">%</span>
            </div>
            <button type="button" onClick={() => removeSkill(index)} className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:scale-110" title="Remove Capability">
                <Trash2 size={16} />
            </button>
        </div>
    );
});

SkillItem.displayName = "SkillItem";

export default SkillItem;
