# Lilly Liu's portfolio

A static, five-page portfolio for GitHub Pages. It preserves the existing HTML,
CSS, and JavaScript stack; no build step or framework is required.

## Preview locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Serve the repository root so that the page and asset
paths work the same way as the lilly-liu.github.io deployment.

## Editing

- `index.html`: Home and selected work.
- `work/index.html`: project cards, filters, and case studies.
- `about/index.html`: biography, portrait, values, and timeline.
- `now/index.html`: interests and current updates.
- `contact/index.html`: contact links and the email draft form.
- `styles/portfolio.css`: design tokens, layouts, and responsive styles.
- `js/portfolio.js`: shared navigation/footer, command menu, filtering, case-study
  links, and contact form behavior.

Navigation and footer are shared through JavaScript. Page content is static HTML;
a basic navigation fallback is available without JavaScript. The old hobby pages,
their styles, and their scripts are retained. Legacy Home section anchors redirect
to the corresponding new page.

## Design and content sources

The design follows the v0 exports in `v0_ss/` and their live reference at
https://vantage-ten-kappa.vercel.app/. The Fraunces and Inter font files and the
portrait/system illustration in `images/portfolio/` were recovered from that
reference. They are served locally.

Career details and metrics come from the existing `resume.pdf` and original
homepage. Contact details use the existing site's email, GitHub, and LinkedIn.
Internal projects do not pretend to have public source repositories.

The Now page explicitly labels unconfirmed learning, thoughts, and experiments as
draft mockup content. Replace these with personal updates before publication.
The contact form opens a prefilled email draft; it does not send messages or store
submissions on a server.

## Visual validation

Compare each page with the v0 reference at desktop and mobile sizes. Check project
filters, case-study anchors, mobile navigation, Cmd/Ctrl+K search, keyboard focus,
form constraints, local asset links, and reduced-motion behavior after changes.
