import { Skill } from "@/lib/data";
import Container from "@/components/ui/Container";

export default function Skills({ skills }: { skills: Skill[] }) {
    return (
        <section id="skills" className="py-20">
            <Container>
                <h2 className="text-3xl font-bold mb-12 flex items-center">
                    <span className="text-cyber-green mr-4">01.</span>
                    Technical Protocol
                    <span className="h-px bg-cyber-gray-light flex-grow ml-4"></span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill) => (
                        <div
                            key={skill.id}
                            className="bg-cyber-gray-light/50 border border-cyber-gray-light p-6 hover:border-cyber-cyan transition-colors group"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-200 group-hover:text-cyber-cyan transition-colors">
                                    {skill.name}
                                </h3>
                                <span className="text-xs px-2 py-1 bg-cyber-black rounded text-gray-500">
                                    {skill.category}
                                </span>
                            </div>

                            <div className="h-2 bg-cyber-black rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cyber-green group-hover:bg-cyber-cyan transition-all duration-1000 ease-out"
                                    style={{ width: `${skill.level}%` }}
                                />
                            </div>
                            <div className="text-right mt-2 text-xs text-gray-500 font-mono">
                                {skill.level}% CAPABILITY
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
