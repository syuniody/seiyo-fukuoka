const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'blog', 'posts');
const BLOG_DIR = path.join(__dirname, 'blog');

function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

function fileToSlug(filename) {
  return filename.replace(/\.md$/, '');
}

function buildCardHTML(post, slug) {
  return `
        <a href="/blog/${slug}.html" class="card blog-card">
          <div class="card__body">
            <span class="card__tag">${post.category || '教室ニュース'}</span>
            <time class="card__date">${formatDate(post.date)}</time>
            <h3 class="card__title">${post.title}</h3>
            ${post.description ? `<p class="card__text">${post.description}</p>` : ''}
          </div>
        </a>`;
}

function buildArticleHTML(post, content) {
  const htmlContent = marked(content);
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title}｜正陽ゼミナール</title>
  <meta name="description" content="${post.description || post.title}">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/reset.css">
  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/components.css">
  <link rel="stylesheet" href="../css/header.css">
  <link rel="stylesheet" href="../css/footer.css">
  <link rel="stylesheet" href="../css/cta-bar.css">
  <link rel="stylesheet" href="../css/pages/blog.css">
</head>
<body class="has-header has-cta-bar">
  <header class="header">
    <div class="header__inner">
      <div class="header__logo"><a href="../"><img src="../images/logo-original.svg" alt="正陽ゼミナール" width="200" height="50"></a></div>
      <nav class="header__nav" aria-label="メインナビゲーション">
        <a href="../" class="header__nav-link">ホーム</a><a href="../#promise" class="header__nav-link">5つの特徴</a><a href="../courses/" class="header__nav-link">コース・料金</a>
        <a href="../teachers/" class="header__nav-link">講師紹介</a><a href="../access/" class="header__nav-link">教室案内</a>
        <a href="../blog/" class="header__nav-link">ブログ</a><a href="../contact/" class="header__nav-link">お問い合わせ</a>
      </nav>
      <div class="header__actions">
        <a href="tel:092-576-9350" class="header__phone"><span class="header__phone-icon">&#9742;</span>092-576-9350</a>
        <a href="../contact/" class="btn btn--primary header__cta">体験授業はこちら</a>
      </div>
      <button class="hamburger" aria-label="メニューを開く" aria-expanded="false">
        <span class="hamburger__line"></span><span class="hamburger__line"></span><span class="hamburger__line"></span>
      </button>
    </div>
  </header>
  <nav class="mobile-menu" aria-label="モバイルナビゲーション">
    <a href="../" class="mobile-menu__link">ホーム</a><a href="../#promise" class="mobile-menu__link">5つの特徴</a><a href="../courses/" class="mobile-menu__link">コース・料金</a>
    <a href="../teachers/" class="mobile-menu__link">講師紹介</a><a href="../access/" class="mobile-menu__link">教室案内</a>
    <a href="../blog/" class="mobile-menu__link">ブログ</a><a href="../contact/" class="mobile-menu__link">お問い合わせ</a>
    <a href="tel:092-576-9350" class="mobile-menu__phone"><span>&#9742;</span> 092-576-9350</a>
    <a href="../contact/" class="btn btn--primary btn--block mobile-menu__cta">体験授業を申し込む</a>
  </nav>
  <main>
    <div class="page-header">
      <div class="container">
        <p class="page-header__breadcrumb"><a href="../">ホーム</a> &gt; <a href="./">塾長ブログ</a> &gt; ${post.title}</p>
        <h1 class="page-header__title">${post.title}</h1>
      </div>
    </div>
    <article class="article section">
      <div class="container">
        <div class="article__header">
          <span class="card__tag">${post.category || '教室ニュース'}</span>
          <time class="article__date">${formatDate(post.date)}</time>
        </div>
        <div class="article__body">
          ${htmlContent}
        </div>
      </div>
    </article>
    <section class="contact-cta">
      <div class="container">
        <h2 class="contact-cta__title">無料体験授業 受付中！</h2>
        <p class="contact-cta__text">お子さまの可能性を一緒に広げませんか？まずはお気軽にお問い合わせください。</p>
        <div class="contact-cta__actions">
          <a href="../contact/" class="btn btn--primary btn--lg">体験授業を申し込む</a>
          <a href="tel:092-576-9350" class="contact-cta__phone">
            <span class="contact-cta__phone-icon">&#9742;</span>
            <span class="contact-cta__phone-number">092-576-9350</span>
            <span class="contact-cta__phone-time">受付：平日 15:00〜22:00</span>
          </a>
        </div>
      </div>
    </section>
  </main>
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__brand">
          <div class="footer__logo"><img src="../images/logo-original.svg" alt="正陽ゼミナール" width="180" height="45"></div>
          <p class="footer__catchcopy">わかるから、できる。できるから、楽しい。</p>
        </div>
        <nav class="footer__nav">
          <a href="../">ホーム</a><a href="../#promise">5つの特徴</a><a href="../courses/">コース・料金</a>
          <a href="../teachers/">講師紹介</a><a href="../access/">教室案内</a>
          <a href="../blog/">ブログ</a><a href="../contact/">お問い合わせ</a>
        </nav>
        <div class="footer__info">
          <p>〒812-0882 福岡県福岡市博多区麦野5丁目6-32</p>
          <p>TEL: <a href="tel:092-576-9350">092-576-9350</a>（平日 15:00〜22:00）</p>
        </div>
      </div>
      <p class="footer__copyright">&copy; 2018 正陽ゼミナール</p>
    </div>
  </footer>
  <div class="cta-bar">
    <a href="tel:092-576-9350" class="cta-bar__phone">
      <span class="cta-bar__phone-icon">&#9742;</span>
      <span class="cta-bar__phone-number">092-576-9350</span>
      <span class="cta-bar__phone-time">平日 15:00〜22:00</span>
    </a>
    <a href="../contact/" class="cta-bar__button">体験授業はこちら</a>
  </div>
  <script src="../js/main.js"></script>
</body>
</html>`;
}

function build() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('No posts directory found.');
    return;
  }
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  console.log('Found ' + files.length + ' blog posts');
  const posts = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const slug = fileToSlug(file);
    posts.push({ ...data, slug, content });
    const html = buildArticleHTML(data, content);
    fs.writeFileSync(path.join(BLOG_DIR, slug + '.html'), html, 'utf8');
    console.log('  Built: blog/' + slug + '.html');
  }
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const blogIndex = path.join(BLOG_DIR, 'index.html');
  if (fs.existsSync(blogIndex)) {
    let indexHTML = fs.readFileSync(blogIndex, 'utf8');
    const cmsCards = posts.map(p => buildCardHTML(p, p.slug)).join('\n');
    if (indexHTML.includes('<!-- CMS_POSTS -->')) {
      indexHTML = indexHTML.replace(/<!-- CMS_POSTS -->[\s\S]*?<!-- \/CMS_POSTS -->/,
        '<!-- CMS_POSTS -->\n' + cmsCards + '\n        <!-- /CMS_POSTS -->');
    } else {
      indexHTML = indexHTML.replace(/<div class="blog-list">/,
        '<div class="blog-list">\n        <!-- CMS_POSTS -->\n' + cmsCards + '\n        <!-- /CMS_POSTS -->');
    }
    fs.writeFileSync(blogIndex, indexHTML, 'utf8');
    console.log('  Updated: blog/index.html');
  }
  console.log('Build complete!');
}

build();
