# Workbench visual and accessibility QA

Local Chrome checks on 19 September 2026 used the built demo served from the repository over HTTP. The page was visually inspected at the default 1280 px desktop viewport and at 390 × 844 and 320 × 768 px. At both phone widths, `document.documentElement.scrollWidth` equaled `innerWidth`; task, filter, progress and observer controls remained visible. CSS uses local assets and includes a reduced-motion rule.

A read-only automated DOM check found one `main`, one `h1`, no duplicate IDs, no broken ARIA ID references, no unnamed buttons or inputs, and a label for every input in the initial and filtered states. The accessibility tree exposed the task labels, pressed filter states, progress indicator, observer status, form feedback and expanded state disclosure. No external asset URL was loaded.

Representative rendered text contrast ratios, computed from foreground and solid background colors, were: hero copy **4.92:1**, section kicker on card **6.15:1**, task labels **5.59:1**, primary button **4.95:1**, observer top line **12.25:1**, and selected filter **14.78:1**. The primary button had measured **4.48:1** before its background was darkened; the input border and placeholder were darkened as well. These are sampled color pairs, not a full WCAG conformance claim.

Manual keyboard checks: Tab moved from the task field through Add, All, Open, Done, then the first checkbox; Enter submitted a task; Space toggled a task and retained checkbox focus. When a completed task left the active Open filter, focus moved to that filter. Removing a task and Reset returned focus to the task field. The empty Done view displayed its message; whitespace-only submission displayed a live status message and did not change counts. The state disclosure expanded in the accessibility tree.

The browser console showed no warnings or errors during the main add/filter/toggle/remove/pause/resume/reset route. These local checks cover one browser and selected viewport sizes. They do not substitute for assistive-technology testing across browsers or for a hosted demo check.
