/* =========================================================
   Resources Data
   -----------------------------------------------------
   To add a new resource post:
   1. Create the post page in /resources/ (copy
      /resources/_post-template.html and edit it).
   2. Add a new object to the TOP of the array below.
   3. Save. The homepage (latest 3) and the Resources
      archive page (resources.html) update automatically.

   Fields:
   - slug:    unique id, matches the post's filename (no .html)
   - badge:   short category label shown on the card
   - title:   post title
   - excerpt: 1-2 sentence summary shown on the card
   - date:    "YYYY-MM-DD", used for display only
   - url:     path to the post page, relative to the
              project root (works from index.html and
              resources.html)
   ========================================================= */

const RESOURCES_DATA = [
  {
    slug: "top-business-analyst-interview-questions",
    badge: "Business Analyst",
    title: "Top Business Analyst Interview Questions",
    excerpt: "Requirement gathering, stakeholder management, and case-study style questions for BA interviews.",
    date: "2026-06-13",
    url: "resources/top-business-analyst-interview-questions.html"
  },
  {
    slug: "top-sap-mm-interview-questions",
    badge: "SAP MM",
    title: "Top SAP MM Interview Questions",
    excerpt: "Procurement cycles, master data, goods receipt, and invoice verification concepts.",
    date: "2026-06-12",
    url: "resources/top-sap-mm-interview-questions.html"
  },
  {
    slug: "top-sql-interview-questions",
    badge: "SQL",
    title: "Top SQL Interview Questions",
    excerpt: "Joins, grouping, subqueries, window functions, and normalization basics.",
    date: "2026-06-11",
    url: "resources/top-sql-interview-questions.html"
  },
  {
    slug: "top-selenium-interview-questions",
    badge: "Selenium",
    title: "Top Selenium Interview Questions",
    excerpt: "Locators, waits, dynamic elements, and handling common automation exceptions.",
    date: "2026-06-10",
    url: "resources/top-selenium-interview-questions.html"
  },
  {
    slug: "top-sdet-interview-questions",
    badge: "SDET",
    title: "Top SDET Interview Questions",
    excerpt: "Framework design, the test pyramid, CI/CD integration, and handling flaky tests.",
    date: "2026-06-09",
    url: "resources/top-sdet-interview-questions.html"
  },
  {
    slug: "top-qa-interview-questions",
    badge: "QA",
    title: "Top QA Interview Questions",
    excerpt: "Core concepts every QA professional should be ready to explain clearly in an interview.",
    date: "2026-06-08",
    url: "resources/top-qa-interview-questions.html"
  }
];
