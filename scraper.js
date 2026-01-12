const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');

const feeds = [
    { name: 'Reporterre', url: 'https://reporterre.net/spip.php?page=backend' },
    { name: 'Blast', url: 'https://www.blast-info.fr/rss.xml' },
    { name: 'Le Média', url: 'https://www.lemediatv.fr/rss.xml' },
    { name: 'Les Jours', url: 'https://lesjours.fr/rss.xml' }
];

async function run() {
    let allArticles = [];
    for (const feed of feeds) {
        try {
            const data = await parser.parseURL(feed.url);
            data.items.forEach(item => {
                allArticles.push({
                    source: feed.name,
                    title: item.title,
                    link: item.link,
                    date: item.pubDate || item.isoDate
                });
            });
        } catch (e) { console.error(`Error with ${feed.name}`); }
    }
    // Sort by date and keep top 20
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    fs.writeFileSync('news.json', JSON.stringify(allArticles.slice(0, 20), null, 2));
}
run();
