# TRMNL Doomsday Clock

An unofficial, open-source [TRMNL](https://usetrmnl.com/) recipe that shows the current Doomsday Clock setting on an e-ink display.

The display combines a custom analog clock face, the exact number of seconds remaining before midnight, the corresponding clock time, and a compact recent-history graphic. Full-screen, half-horizontal, half-vertical, and quadrant layouts are included.

## Features

- High-contrast design optimized for e-ink
- Four responsive TRMNL layouts
- Automatically refreshed Doomsday Clock data
- No external chart or JavaScript dependency in the rendered recipe
- Licensed for sharing and adaptation under CC BY 4.0

## How it works

The recipe polls [`doomsday.json`](./doomsday.json), which is generated from the [Doomsday Clock timeline on Wikipedia](https://en.wikipedia.org/wiki/Doomsday_Clock). A scheduled GitHub Actions workflow runs daily at 06:15 UTC and commits the file only when the data changes.

The clock itself is a symbol created and maintained by the [Bulletin of the Atomic Scientists](https://thebulletin.org/doomsday-clock/). This repository is an independent community project and is not affiliated with or endorsed by the Bulletin, Wikipedia, or TRMNL.

## Repository structure

```text
src/
  shared.liquid          Shared calculations, SVG, and styles
  full.liquid            Full-screen layout
  half_horizontal.liquid Horizontal half-screen layout
  half_vertical.liquid   Vertical half-screen layout
  quadrant.liquid        Quadrant layout
  settings.yml           TRMNL recipe configuration
scripts/
  doomsday.js            Data extraction and JSON generation
doomsday.json             Generated data consumed by the recipe
```

## Development

The data generator requires Node.js 20 or newer and has no third-party package dependencies:

```bash
node scripts/doomsday.js
```

For recipe changes, edit the Liquid templates in `src/` and preview each layout in TRMNL before merging. E-ink rendering is less forgiving than a normal browser: prioritize strong contrast, clear spacing, and readable type sizes.

## Contributing

Bug reports and focused improvements are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License and attribution

The original visual design, data parsing logic, markup, and other original content in this repository are licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](./LICENSE).

When sharing or adapting the recipe, credit Michael Kurath, link to this repository and the CC BY 4.0 license, and indicate whether changes were made.

The license applies only to this project's original content. Third-party names, trademarks, source material, and data remain the property of their respective owners.
