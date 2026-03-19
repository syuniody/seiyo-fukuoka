/**
 * ブログ記事ビルドスクリプト
 * blog/posts/*.md → blog/article-*.html + blog/index.html を自動生成
 */
const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'blog', 'posts');
const BLOG_DIR = path.join(__dirname, 'blog');
const TEMPLATE_PATH = path.join(__dirname, 'blog', '_template.html');

// === テンプレート読み込み ===
if (!fs.existsSync(TEMPLATE_PATH)) {
  console.log('No _template.html found, skipping blog build.');
  process.exit(0);
}
const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// === Markdownファイル一覧取得 ===
if (!fs.existsSync(POSTS_DIR)) {
  console.log('No posts directory found, skipping.');
  process.exit(0);
}

const mdFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
if (mdFiles.length === 0) {
  console.log('No markdown posts found, skipping.');
  process.exit(0);
}

// === 各記事をHTMLに変換 ===
const articles = [];

mdFiles.forEach(file => {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
  const { attributes, body } = fm(raw);

  const slug = file.replace('.md', '');
  const htmlBody = marked(body);
  const rawDate = attributes.date || '2026-01-01';
  const date = (rawDate instanceof Date) ? rawDate.toISOString().split('T')[0] : String(rawDate);
  const title = attributes.title || 'タイトル未設定';
  const category = attributes.category || '教室ニュース';
  const description = attributes.description || '';
  const thumbnail = attributes.thumbnail || '../images/blog-thumb-01.svg';

  // テンプレートに流し込み
  let html = template
    .replace(/\{\{title\}\}/g, title)
    .replace(/\{\{date\}\}/g, date)
    .replace(/\{\{category\}\}/g, category)
    .replace(/\{\{description\}\}/g, description)
    .replace(/\{\{thumbnail\}\}/g, thumbnail)
    .replace(/\{\{body\}\}/g, htmlBody)
    .replace(/\{\{slug\}\}/g, slug);

  const outPath = path.join(BLOG_DIR, `${slug}.html`);
  fs.writeFileSync(outPath, html, 'utf-8');
  console.log(`✅ Built: blog/${slug}.html`);

  articles.push({ slug, title, date, category, description, thumbnail });
});

// === 日付の新しい順にソート ===
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

// === ブログ一覧ページの記事カード部分を更新 ===
const INDEX_PATH = path.join(BLOG_DIR, 'index.html');
if (fs.existsSync(INDEX_PATH)) {
  let indexHtml = fs.readFileSync(INDEX_PATH, 'utf-8');

  // 記事カードのHTMLを生成
  const cardsHtml = articles.map(a => `
          <article class="card blog-card">
            <a href="${a.slug}.html" class="card__link">
              <div class="card__image">
                <img src="${a.thumbnail}" alt="${a.title}" loading="lazy">
              </div>
              <div class="card__body">
                <span class="card__tag">${a.category}</span>
                <time class="card__date" datetime="${a.date}">${a.date.replace(/-/g, '.')}</time>
                <h3 class="card__title">${a.title}</h3>
                <p class="card__text">${a.description}</p>
              </div>
            </a>
          </article>`).join('\n');

  // <!-- BLOG_LIST_START --> と <!-- BLOG_LIST_END --> の間を置換
  const listRegex = /<!-- BLOG_LIST_START -->[\s\S]*?<!-- BLOG_LIST_END -->/;
  if (listRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(listRegex,
      `<!-- BLOG_LIST_START -->\n${cardsHtml}\n          <!-- BLOG_LIST_END -->`
    );
    fs.writeFileSync(INDEX_PATH, indexHtml, 'utf-8');
    console.log(`✅ Updated: blog/index.html (${articles.length} articles)`);
  } else {
    console.log('⚠️  blog/index.html にBLOG_LIST マーカーがありません。手動で追加してください。');
  }
}

console.log(`\n🎉 ビルド完了！${articles.length}件の記事を生成しました。`);
