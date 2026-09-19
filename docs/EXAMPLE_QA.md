# Browser example QA

Local verification on 19 September 2026 with a build of this worktree, served over HTTP from the repository root. These checks concern the local browser examples; they do not prove a hosted demo or a package release.

| Check | Observed result |
| --- | --- |
| Todo hostile text | Entering `<b>Ship Fluxus</b>` produced literal label text; the label had zero child elements. Add, checkbox toggle, and remove updated the visible count. |
| Cart | Adding a product changed total from `$0.00` to `$10.00`; removal and clearing restored zero. Enter on the focused product and Clear buttons performed the same actions as clicks. |
| Session example | A display name started and ended a local session. The name was inserted as text with zero child elements; there was no password field. The page explicitly states that it does not authenticate or grant access. |
| Counter | Increase changed the visible count from 0 to 1 after dispatch. |
| Styles and console | The pages loaded `./styles.css` locally. A fresh Todo tab showed no browser warnings or errors; the four example sources contain no Tailwind CDN, `innerHTML`, inline `onclick`/`onchange`, or password field. |
| Layout | Desktop views were inspected for all four examples. At a 390 × 844 viewport, Todo and Cart both had `document.documentElement.scrollWidth === innerWidth === 390`; their primary controls remained visible and usable. |

The responsive checks cover two representative recipe pages, not every device or assistive technology. The later main workbench has a separate [visual and accessibility record](ACCESSIBILITY_QA.md); public hosting is tracked in the [roadmap](../ROADMAP.md).
