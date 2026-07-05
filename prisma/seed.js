const { PrismaClient } = require('./client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Seed Admin User
    // Upsert is fine here because we want to ensure admin exists. 
    // If password changed, we DON'T want to reset it (update: {}).
    const adminPassword = await bcrypt.hash('admin', 10);
    const user = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {}, // Do NOT update password if user exists
        create: {
            username: 'admin',
            password: adminPassword,
        },
    });
    console.log(`👤 Admin user check: ${user.username}`);

    // 2. Seed Portfolio Data
    // We only want to seed if the data is MISSING. 
    // If we upsert every time, we overwrite user changes on every restart.

    const existingPortfolio = await prisma.portfolioData.findUnique({
        where: { id: 'default' }
    });

    if (existingPortfolio) {
        console.log('✅ Portfolio data already exists. Skipping seed to preserve changes.');
        return;
    }

    const portfolioPath = path.join(process.cwd(), 'data', 'portfolio.json');
    if (fs.existsSync(portfolioPath)) {
        const rawData = fs.readFileSync(portfolioPath, 'utf8');
        const existingData = JSON.parse(rawData);

        // Create fresh
        await prisma.portfolioData.create({
            data: {
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
                    create: existingData.skills.map(s => ({
                        name: s.name,
                        category: s.category,
                        level: s.level
                    }))
                },
                projects: {
                    create: existingData.projects.map(p => ({
                        title: p.title,
                        description: p.description,
                        techStack: p.techStack,
                        link: p.link
                    }))
                }
            }
        });
        console.log('📄 Initial portfolio data seeded from JSON.');
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
