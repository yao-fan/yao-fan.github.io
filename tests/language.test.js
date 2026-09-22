const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const yaml = require('../static/js/js-yaml.min.js');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function loadLanguage(search) {
    const elements = new Map();
    const element = key => {
        if (!elements.has(key)) elements.set(key, {
            attributes: {},
            setAttribute(key, value) { this.attributes[key] = value; },
            removeAttribute(key) { delete this.attributes[key]; },
        });
        return elements.get(key);
    };
    const links = ['en', 'zh'].map(language => Object.assign(element(language), { dataset: { language } }));
    const events = {};
    const context = {
        URL, URLSearchParams, console,
        window: {
            location: { search, href: 'https://example.com/site/' + search + '#research' },
            addEventListener(name, callback) { events[name] = callback; },
        },
        document: {
            documentElement: {},
            getElementById: element,
            querySelector: element,
            querySelectorAll(selector) { return selector === '[data-language]' ? links : [element(selector)]; },
        },
    };
    vm.createContext(context);
    vm.runInContext(read('static/js/scripts.js'), context);
    context.initLanguage();
    return { context, elements, links, events };
}

test('explicit Chinese link selects translated content and metadata', () => {
    const { context, elements, links, events } = loadLanguage('?lang=zh');
    assert.equal(context.document.documentElement.lang, 'zh-Hans');
    assert.equal(vm.runInContext('content_dir', context), 'contents/zh/');
    assert.equal(links[1].attributes['aria-current'], 'true');
    assert.equal(links[0].attributes['aria-current'], undefined);
    assert.equal(elements.get('menu-label').textContent, '菜单');
    assert.equal(elements.get('link[rel="canonical"]').href, 'https://yao-fan.github.io/?lang=zh');
    assert.equal(links[0].href, 'https://example.com/site/?lang=en#research');
    context.window.location.href = 'https://example.com/site/?lang=zh#talks';
    events.hashchange();
    assert.equal(links[0].href, 'https://example.com/site/?lang=en#talks');
});

test('English is default and unsupported language values cannot alter content paths', () => {
    for (const search of ['', '?lang=en', '?lang=fr', '?lang=../../secret']) {
        const { context, links } = loadLanguage(search);
        assert.equal(context.document.documentElement.lang, 'en');
        assert.equal(vm.runInContext('content_dir', context), 'contents/');
        assert.equal(links[0].attributes['aria-current'], 'true');
    }
});

test('language switch preserves deployment path, other parameters, and section', () => {
    const { context } = loadLanguage('');
    assert.equal(context.languageUrl('https://example.com/site/?ref=cv#awards', 'zh'), 'https://example.com/site/?ref=cv&lang=zh#awards');
});

test('every section is translated and retains its references and assets', () => {
    const english = yaml.load(read('contents/config.yml'));
    const chinese = yaml.load(read('contents/zh/config.yml'));
    assert.deepEqual(chinese.sections.map(s => s.id), english.sections.map(s => s.id));
    const references = text => [...text.replace(/<!--[\s\S]*?-->/g, '').matchAll(/(?:href|src)="([^"]+)"|\]\(([^)]+)\)/g)].map(m => m[1] || m[2]).sort();
    for (const { id } of english.sections) {
        const original = read(`contents/${id}.md`);
        const translated = read(`contents/zh/${id}.md`);
        assert.match(translated, /[\u4e00-\u9fff]/u);
        assert.deepEqual(references(translated), references(original), `${id}: preserve references`);
        assert.equal((translated.match(/<details\b/g) || []).length, (original.match(/<details\b/g) || []).length);
        for (const reference of [...references(original), ...references(translated)]) {
            if (!/^[a-z]+:|^#/i.test(reference)) assert.ok(fs.existsSync(path.join(root, reference)), reference);
        }
    }
});

test('HTTP failures are rejected instead of rendering error pages as content', async () => {
    const { context } = loadLanguage('?lang=zh');
    context.fetch = async () => ({ ok: false, status: 404 });
    await assert.rejects(context.fetchText('contents/zh/home.md'), /404/);
    context.fetch = async () => ({ ok: true, text: async () => '中文内容' });
    assert.equal(await context.fetchText('contents/zh/home.md'), '中文内容');
});
