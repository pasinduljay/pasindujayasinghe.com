const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Seed Admin User
    const adminPassword = await bcrypt.hash('admin', 10);
    const user = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: adminPassword,
        },
    });
    console.log(`👤 Admin user seeded: ${user.username}`);

    // 2. Seed Portfolio Data
    const portfolioPath = path.join(process.cwd(), 'data', 'portfolio.json');
    if (fs.existsSync(portfolioPath)) {
        const rawData = fs.readFileSync(portfolioPath, 'utf8');
        const existingData = JSON.parse(rawData);

        // Transform existing data to match schema
        // Note: Assuming existingData matches the PortfolioData interface structure roughly

        // Clean up existing data to avoid conflicts if needed, or just upsert
        // For simplicity in this structure, we'll try to upsert the 'default' id

        await prisma.portfolioData.upsert({
            where: { id: 'default' },
            update: {
                name: existingData.profile.name,
                role: existingData.profile.role,
                bio: existingData.profile.bio,
                location: existingData.profile.location,
                email: existingData.profile.email,
                github: existingData.profile.github,
                linkedin: existingData.profile.linkedin,
                twitterUrl: existingData.profile?.twitterUrl,
                redditUrl: existingData.profile?.redditUrl,
                facebookUrl: existingData.profile?.facebookUrl,
                bookCallUrl: existingData.profile?.bookCallUrl,
                whatsappUrl: existingData.profile?.whatsappUrl,
                resumeUrl: existingData.profile?.resumeUrl,

                siteName: existingData.siteIdentity.siteName,
                siteRole: existingData.siteIdentity.siteRole,

                // Re-create relations
                skills: {
                    deleteMany: {},
                    create: existingData.skills.map((s: any) => ({
                        name: s.name,
                        category: s.category,
                        level: s.level
                    }))
                },
                projects: {
                    deleteMany: {},
                    create: existingData.projects.map((p: any) => ({
                        title: p.title,
                        description: p.description,
                        techStack: p.techStack,
                        link: p.link
                    }))
                }
            },
            create: {
                id: 'default',
                name: existingData.profile.name,
                role: existingData.profile.role,
                bio: existingData.profile.bio,
                location: existingData.profile.location,
                email: existingData.profile.email,
                github: existingData.profile.github,
                linkedin: existingData.profile.linkedin,
                twitterUrl: existingData.profile?.twitterUrl,
                redditUrl: existingData.profile?.redditUrl,
                facebookUrl: existingData.profile?.facebookUrl,
                bookCallUrl: existingData.profile?.bookCallUrl,
                whatsappUrl: existingData.profile?.whatsappUrl,
                resumeUrl: existingData.profile?.resumeUrl,

                siteName: existingData.siteIdentity.siteName,
                siteRole: existingData.siteIdentity.siteRole,

                skills: {
                    create: existingData.skills.map((s: any) => ({
                        name: s.name,
                        category: s.category,
                        level: s.level
                    }))
                },
                projects: {
                    create: existingData.projects.map((p: any) => ({
                        title: p.title,
                        description: p.description,
                        techStack: p.techStack,
                        link: p.link
                    }))
                }
            },
        });
        console.log('📄 Portfolio data seeded from existing JSON.');
    } else {
        console.log('⚠️ No existing portfolio.json found. Skipping data seed.');
    }

    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
