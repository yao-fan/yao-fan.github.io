# Yao Fan Academic Homepage

This repository contains the GitHub Pages site for `https://yao-fan.github.io`.

The site is based on [senli1073/academic-homepage-template](https://github.com/senli1073/academic-homepage-template), a static academic homepage template that loads Markdown content from `contents/` and configuration from `contents/config.yml`.

## Site Plan

The initial job-market version uses these sections:

- **Home/About**: current position, research identity, contact links, education, and CV download.
- **Research**: areas of specialization and competence, current research themes, and dissertation.
- **Publications**: under-review and published work with publisher/preprint links.
- **Teaching**: teaching areas, experience, and guest teaching.
- **Talks**: selected talks from the CV.
- **Awards**: selected fellowships and scholarships.
- **Service**: reviewing, graduate service, and relevant research roles.
- **Outreach**: public philosophy and guest lectures.
- **CV**: direct link to the downloadable PDF.

## Editing

- Update navigation, page title, footer, background images, and section order in `contents/config.yml`.
- Edit each section in the matching Markdown file under `contents/`.
- Replace `static/assets/img/photo.png` with a headshot when one is available.
- Replace `static/assets/Yao-Fan-CV.pdf` whenever the CV changes.

## Local Preview

Because the site fetches local Markdown files, preview it through a local web server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## License

The original template is copyright Sen Li, 2023-2026, and licensed under the MIT License. This site keeps the template's `LICENSE` file.
