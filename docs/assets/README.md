# Workbench image provenance

All PNGs in this directory were captured on 19 September 2026 from Chrome running `examples/workbench.html` through a local HTTP server after `yarn build`. The source UI is at commit `0fa5438`; the checkout at capture time was `8614da2` for the initial and updated views and `7da790a` for the social preview. The documentation-only changes between those commits did not change the built demo. No external API, sample account or published package was involved.

| File | Source and state | Dimensions | SHA-256 |
| --- | --- | --- | --- |
| `workbench-initial.png` | Unaltered full-page browser capture after reload, with the three built-in tasks | 1280 × 1231 | `56ce30f8193815bb4cb626aa53142a3d55f08ae34f679c2e24aa59415d7ee0e2` |
| `workbench-updated.png` | Unaltered full-page browser capture after adding `Ship the release notes` and completing a task | 1280 × 1255 | `1da84f1ff10142e9da4905314ac0bd77b389893aa0b48780cfb95f83dd6a0e74` |
| `workbench-mobile.png` | Unaltered full-page browser capture of the initial state at 390 px width | 390 × 1927 | `f7e8e4547e2abce636613be58b9281cfdb9af2de59771cf06c82963fd5192321` |
| `social-preview.png` | 1280 × 640 cover rendered from `social-preview.html`; its framed workbench image is `workbench-initial.png` | 1280 × 640 | `43dd61e2bde52809f34fa09a66c5e7f775a09d9205b3ba829a1fe52bcc6ad831` |

`social-preview.html` is the editable source of the cover. Its copy describes the existing demo and its inset is a crop of the real screenshot, not a product mockup. The cover is prepared for GitHub repository metadata; its existence in this folder does not mean the repository's social preview setting has been updated.
