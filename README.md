# Yao Fan Academic Homepage

This repository contains the GitHub Pages site for `https://yao-fan.github.io`.

The site is based on [senli1073/academic-homepage-template](https://github.com/senli1073/academic-homepage-template), a static academic homepage template that loads Markdown content from `contents/` and configuration from `contents/config.yml`.

## Site Plan

The initial job-market version uses these sections:

- **Home/About**: current position, research identity, contact links, education, and CV download.
- **Research**: areas of specialization and competence, current research themes, and dissertation.
- **Writings**: published work, papers under review, and expository notes with links to available manuscripts.
- **Talks**: selected presentations with links to available handouts.
- **Awards**: selected fellowships and scholarships.

## Editing

- Update navigation, page title, footer, background images, and section order in `contents/config.yml`.
- Edit each section in the matching Markdown file under `contents/`.
- The Simplified Chinese version uses `contents/zh/config.yml` and the matching Markdown files under `contents/zh/`. Update both languages when changing content; keep section IDs aligned.
- The top-right language switch links to `?lang=en` and `?lang=zh`, preserving the section anchor. English remains the default. Images and PDFs are shared, with paths relative to the site root (no duplicate assets). Linked PDFs remain in English.
- Replace `static/assets/img/photo.png` with a headshot when one is available.
- The English CV currently uses `static/assets/Yao-Fan-CV-en.pdf`; `static/assets/Yao-Fan-CV.pdf` remains the Chinese version's download while English updates are reviewed first.
- The English research overview links to the full statement at `static/assets/Yao-Fan-Research-Statement.pdf`.
- The English teaching section links to `static/assets/Yao-Fan-Teaching-Portfolio.pdf`. Teaching will be added to the Chinese version after the English review.

## Local Preview

Because the site fetches local Markdown files, preview it through a local web server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Open `http://localhost:8000/?lang=zh` for Chinese. Run the checks with `node --test tests/*.test.js`.

## License

The original template is copyright Sen Li, 2023-2026, and licensed under the MIT License. This site keeps the template's `LICENSE` file.
