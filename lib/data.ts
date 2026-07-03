import { PrismaClient } from "@prisma/client";
import portfolioData from "../data/portfolio.json";

// Use a global prisma client in development to prevent too many connections
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    link: string;
}

export interface Profile {
    name: string;
    role: string;
    bio: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    bookCallUrl?: string;
    whatsappUrl?: string;
    resumeUrl?: string;
    twitterUrl?: string;
    redditUrl?: string;
    facebookUrl?: string;
    image?: string;
}

export interface SiteIdentity {
    siteName: string;
    siteRole: string;
}

export interface PortfolioData {
    profile: Profile;
    siteIdentity: SiteIdentity;
    skills: Skill[];
    projects: Project[];
}

// Fallback data if DB is empty or fails
const defaultData: PortfolioData = {
    profile: {
        name: portfolioData.profile.name,
        role: portfolioData.profile.role,
        bio: portfolioData.profile.bio,
        location: portfolioData.profile.location,
        email: portfolioData.profile.email,
        github: portfolioData.profile.github,
        linkedin: portfolioData.profile.linkedin,
        bookCallUrl: portfolioData.profile.bookCallUrl,
        whatsappUrl: portfolioData.profile.whatsappUrl,
        resumeUrl: portfolioData.profile.resumeUrl,
        twitterUrl: portfolioData.profile.twitterUrl,
        redditUrl: portfolioData.profile.redditUrl,
        facebookUrl: portfolioData.profile.facebookUrl,
        image: portfolioData.profile.image,
    },
    siteIdentity: {
        siteName: portfolioData.siteIdentity.siteName,
        siteRole: portfolioData.siteIdentity.siteRole,
    },
    skills: portfolioData.skills.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        level: s.level,
    })),
    projects: portfolioData.projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        techStack: p.techStack,
        link: p.link || "",
    })),
};

export async function getPortfolioData(): Promise<PortfolioData> {
    try {
        const data = await prisma.portfolioData.findUnique({
            where: { id: "default" },
            include: {
                skills: true,
                projects: true,
            },
        });

        if (data) {
            return {
                profile: {
                    name: data.name,
                    role: data.role,
                    bio: data.bio,
                    location: data.location,
                    email: data.email,
                    github: data.github,
                    linkedin: data.linkedin,
                    twitterUrl: data.twitterUrl || undefined,
                    redditUrl: data.redditUrl || undefined,
                    facebookUrl: data.facebookUrl || undefined,
                    bookCallUrl: data.bookCallUrl || undefined,
                    whatsappUrl: data.whatsappUrl || undefined,
                    resumeUrl: data.resumeUrl || undefined,
                },
                siteIdentity: {
                    siteName: data.siteName,
                    siteRole: data.siteRole,
                },
                skills: data.skills.map(s => ({
                    id: s.id,
                    name: s.name,
                    category: s.category,
                    level: s.level
                })),
                projects: data.projects.map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    techStack: p.techStack,
                    link: p.link || "" /* Ensure string if interface requires string, schema says String? */
                })),
            };
        }
    } catch (error) {
        console.error("Failed to fetch from DB:", error);
    }
    return defaultData;
}

export async function updatePortfolioData(newData: PortfolioData) {
    const { profile, siteIdentity, skills, projects } = newData;

    await prisma.portfolioData.upsert({
        where: { id: "default" },
        update: {
            name: profile.name,
            role: profile.role,
            bio: profile.bio,
            location: profile.location,
            email: profile.email,
            github: profile.github,
            linkedin: profile.linkedin,
            twitterUrl: profile.twitterUrl,
            redditUrl: profile.redditUrl,
            facebookUrl: profile.facebookUrl,
            bookCallUrl: profile.bookCallUrl,
            whatsappUrl: profile.whatsappUrl,
            resumeUrl: profile.resumeUrl,

            siteName: siteIdentity.siteName,
            siteRole: siteIdentity.siteRole,

            skills: {
                deleteMany: {},
                create: skills.map(s => ({
                    name: s.name,
                    category: s.category,
                    level: s.level
                }))
            },
            projects: {
                deleteMany: {},
                create: projects.map(p => ({
                    title: p.title,
                    description: p.description,
                    techStack: p.techStack,
                    link: p.link
                }))
            }
        },
        create: {
            id: "default",
            name: profile.name,
            role: profile.role,
            bio: profile.bio,
            location: profile.location,
            email: profile.email,
            github: profile.github,
            linkedin: profile.linkedin,
            twitterUrl: profile.twitterUrl,
            redditUrl: profile.redditUrl,
            facebookUrl: profile.facebookUrl,
            bookCallUrl: profile.bookCallUrl,
            whatsappUrl: profile.whatsappUrl,
            resumeUrl: profile.resumeUrl,

            siteName: siteIdentity.siteName,
            siteRole: siteIdentity.siteRole,

            skills: {
                create: skills.map(s => ({
                    name: s.name,
                    category: s.category,
                    level: s.level
                }))
            },
            projects: {
                create: projects.map(p => ({
                    title: p.title,
                    description: p.description,
                    techStack: p.techStack,
                    link: p.link
                }))
            }
        }
    });
}
