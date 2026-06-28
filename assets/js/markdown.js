/* =============================================
   KnowledgeVerse — Lightweight Markdown Parser
   ============================================= */
(function (global) {
  'use strict';

  function parseMarkdown(md) {
    if (!md) return '';
    let html = md;

    /* Code blocks (must come before inline) */
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, function (_, lang, code) {
      return '<pre><code class="lang-' + (lang || 'text') + '">' + escapeHtml(code.trim()) + '</code></pre>';
    });

    /* Blockquotes */
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>');
    html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

    /* Headings */
    html = html.replace(/^#{6} (.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#{5} (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#{4} (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^#{3} (.+)$/gm, '<h3 id="$1">$1</h3>'.replace('$1', function(m) { return slugify(m); }));
    html = html.replace(/^### (.+)$/gm, function(_, t) { return '<h3 id="' + slugify(t) + '">' + t + '</h3>'; });
    html = html.replace(/^## (.+)$/gm, function(_, t) { return '<h2 id="' + slugify(t) + '">' + t + '</h2>'; });
    html = html.replace(/^# (.+)$/gm, function(_, t) { return '<h1 id="' + slugify(t) + '">' + t + '</h1>'; });

    /* Horizontal rule */
    html = html.replace(/^---$/gm, '<hr>');

    /* Unordered lists */
    html = html.replace(/^[\*\-\+] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, function(m) {
      if (m.indexOf('<ul>') === -1) return '<ul>' + m + '</ul>';
      return m;
    });
    /* Clean up consecutive li wraps */
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    /* Ordered lists */
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    /* Bold & Italic */
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    /* Strikethrough */
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    /* Inline code */
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    /* Links */
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');

    /* Images */
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

    /* Tables */
    html = html.replace(/^\|(.+)\|$/gm, function(m) {
      return m; /* handled below */
    });
    html = parseTable(html);

    /* Info boxes — custom syntax: :::info, :::warning, :::success, :::danger */
    html = html.replace(/:::info\n([\s\S]*?):::/g, '<div class="info-box info-box--info"><span class="info-box__icon">ℹ️</span><div>$1</div></div>');
    html = html.replace(/:::warning\n([\s\S]*?):::/g, '<div class="info-box info-box--warning"><span class="info-box__icon">⚠️</span><div>$1</div></div>');
    html = html.replace(/:::success\n([\s\S]*?):::/g, '<div class="info-box info-box--success"><span class="info-box__icon">✅</span><div>$1</div></div>');
    html = html.replace(/:::danger\n([\s\S]*?):::/g, '<div class="info-box info-box--danger"><span class="info-box__icon">🚨</span><div>$1</div></div>');

    /* Paragraphs */
    const lines = html.split('\n');
    const result = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (line && !line.startsWith('<') && !line.startsWith('#')) {
        result.push('<p>' + line + '</p>');
      } else {
        result.push(lines[i]);
      }
      i++;
    }
    html = result.join('\n');

    /* Clean up */
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p><(h[1-6]|ul|ol|li|pre|blockquote|div|table)>/g, '<$1>');
    html = html.replace(/<\/(h[1-6]|ul|ol|li|pre|blockquote|div|table)><\/p>/g, '</$1>');

    return html;
  }

  function parseTable(html) {
    const tableRegex = /(\|.+\|\n)+/g;
    return html.replace(tableRegex, function(table) {
      const rows = table.trim().split('\n');
      let out = '<table><thead><tr>';
      const headers = rows[0].split('|').filter(c => c.trim());
      headers.forEach(h => { out += '<th>' + h.trim() + '</th>'; });
      out += '</tr></thead><tbody>';
      for (let i = 2; i < rows.length; i++) {
        const cells = rows[i].split('|').filter(c => c.trim());
        if (!cells.length) continue;
        out += '<tr>';
        cells.forEach(c => { out += '<td>' + c.trim() + '</td>'; });
        out += '</tr>';
      }
      out += '</tbody></table>';
      return out;
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function slugify(str) {
    return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function extractTOC(md) {
    const toc = [];
    const lines = md.split('\n');
    lines.forEach(line => {
      const h2 = line.match(/^## (.+)$/);
      const h3 = line.match(/^### (.+)$/);
      if (h2) toc.push({ level: 2, text: h2[1], id: slugify(h2[1]) });
      if (h3) toc.push({ level: 3, text: h3[1], id: slugify(h3[1]) });
    });
    return toc;
  }

  function parseFrontmatter(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, content: raw };
    const meta = {};
    match[1].split('\n').forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) return;
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
      } else if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(val) && val !== '') val = Number(val);
      meta[key] = val;
    });
    return { meta, content: match[2] };
  }

  function estimateReadingTime(text) {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 230));
  }

  global.KVMarkdown = { parse: parseMarkdown, extractTOC, parseFrontmatter, estimateReadingTime, slugify };
})(window);
