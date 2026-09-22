# Author list formatter

A single-page web app that turns a spreadsheet of authors and affiliations into a formatted author list with superscript affiliation numbers. Runs entirely in the browser.

## Input
Upload CSV, TSV, XLSX, XLS or ODS, or paste rows. Recognised columns:

| Column | Notes |
|---|---|
| Name | or First name / Middle name / Last name |
| Affiliation 1, Affiliation 2, … | any number; cells can also hold several affiliations separated by `;` |
| Email | used in the correspondence footnote |
| Corresponding | yes / x / 1 |
| Equal contribution | yes / x / 1 |

No header row? Column 1 is treated as the name and the rest as affiliations.

## Output
Formatted (copies with real superscripts into Word / Google Docs), LaTeX, HTML and plain text (Unicode superscripts).

## Hosting on GitHub Pages
1. Create a repository and add `index.html` (and this README) to the root.
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Your app appears at `https://<username>.github.io/<repo>/` within a minute or two.
