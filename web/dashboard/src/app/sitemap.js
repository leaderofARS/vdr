export default function sitemap() {
    const blogs = [
        'why-document-authenticity-matters',
        'solana-for-document-registry',
        'how-vdr-works-technically',
        'cli-workflow-guide',
        'use-cases-legal-finance',
        'devnet-to-mainnet'
    ];

    const currentDate = new Date();

    const posts = blogs.map((slug) => ({
        url: `https://sipheron.com/blog/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [
        {
            url: 'https://sipheron.com',
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://sipheron.com/pricing',
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://sipheron.com/about',
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://sipheron.com/docs',
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://sipheron.com/blog',
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...posts,
    ];
}
