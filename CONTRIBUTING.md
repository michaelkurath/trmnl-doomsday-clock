# Contributing

Thanks for helping improve the TRMNL Doomsday Clock recipe.

## Before opening a pull request

1. Keep changes focused and explain the problem they solve.
2. Run `node scripts/doomsday.js` if you modify the data generator.
3. Preview every affected layout in TRMNL: full, half-horizontal, half-vertical, and quadrant.
4. Check that the result remains readable on a monochrome e-ink display.
5. Do not commit generated screenshots, credentials, or personal TRMNL configuration.

## Design guidelines

- Prefer black and white with strong contrast.
- Avoid small, thin, or low-contrast text and lines.
- Keep external browser dependencies out of the rendered recipe.
- Put shared calculations and styles in `src/shared.liquid` instead of duplicating them.
- Preserve the source attribution and independent-project disclaimer.

## Reporting problems

Open a GitHub issue with the affected layout, TRMNL device or resolution, a screenshot if possible, and clear reproduction steps.

By contributing, you agree that your contribution may be distributed under the project's MIT License.
