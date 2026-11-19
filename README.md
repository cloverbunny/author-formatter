# This repo has moved to [https://github.com/Common-Longitudinal-ICU-data-Format/superscript-sudoku](https://github.com/Common-Longitudinal-ICU-data-Format/superscript-sudoku)



# Author list formatter

A single-page web app that turns a spreadsheet of authors and affiliations into a formatted author list with superscript affiliation numbers. Runs entirely in the browser.

Inspired by the awesome authorship tool built by Dema Therese Maria Palathingal for the CLIF Consortium! 

Visit here: [https://cloverbunny.github.io/author-formatter/](https://cloverbunny.github.io/author-formatter/)

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



## Example rosters and reproducing the manuscript results
The `examples/` folder holds five synthetic author rosters (all names and institutions are made up). Each tests a common real-world problem:

| File | What it tests |
|---|---|
| `01_messy_affiliations` | The same institution spelled several ways, a missing affiliation, a duplicate author |
| `02_first_last_names` | Separate first, middle and last name columns |
| `03_semicolon_cells` | Several affiliations in one cell, separated by `;` |
| `04_no_header` | No header row |
| `05_large_consortium` | A 40-author consortium roster with scattered typos |

Rosters 1, 2 and 5 are provided as both `.xlsx` (to try the Excel upload; each has a "What this shows" tab) and `.csv` with identical data.

To reproduce Tables 1 and 2 of the manuscript, run the following with Node 18 or later (no packages needed):

```
node examples/reproduce.js
```

The script runs the parsing and numbering code taken directly from `index.html` on the CSV rosters, so its output always reflects the current version of the tool.
