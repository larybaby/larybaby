const fs = require('fs');
const path = require('path');

// Usando o diretório onde o script está localizado como base
const siteDirectory = __dirname; // O mesmo diretório do script
const baseUrl = 'https://larybaby.github.io/'; // Substitua pelo URL público do seu site

// Função para gerar o sitemap
function generateSitemap(directory) {
    let urls = [];

    // Lê todos os arquivos no diretório
    fs.readdirSync(directory).forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Se for um diretório, chama a função recursivamente
            urls = urls.concat(generateSitemap(filePath));
        } else if (path.extname(file) === '.html') {
            // Se for um arquivo HTML, adiciona ao sitemap
            const urlPath = path.relative(siteDirectory, filePath).replace(/\\/g, '/');
            const lastModified = new Date(stat.mtime).toISOString().split('T')[0]; // Data da última modificação
            urls.push({
                loc: baseUrl + urlPath,
                lastmod: lastModified,
                changefreq: 'weekly', // Altere conforme necessário
                priority: 0.8 // Altere conforme necessário
            });
        }
    });

    return urls;
}

// Função para salvar o sitemap em um arquivo XML
function saveSitemap(urls) {
    const xmlContent = `
    <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls.map(url => `
            <url>
                <loc>${url.loc}</loc>
                <lastmod>${url.lastmod}</lastmod>
                <changefreq>${url.changefreq}</changefreq>
                <priority>${url.priority}</priority>
            </url>`).join('')}
    </urlset>`;

    fs.writeFileSync('sitemap.xml', xmlContent.trim(), 'utf8');
    console.log('Sitemap gerado: sitemap.xml');
}

// Gera e salva o sitemap
const urls = generateSitemap(siteDirectory);
saveSitemap(urls);
