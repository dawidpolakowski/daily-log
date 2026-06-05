# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Open-source project files: `LICENSE` (MIT), `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, `SECURITY.md`, issue and pull-request templates.
- Light / dark theme toggle with persistence, OS-preference detection, and a
  `?theme=` URL override.
- Tag support: a `## Tags` section is parsed into `logs.json` and rendered as
  clickable, filterable tag chips.
- Card previews (excerpts) generated from each log's first body line.
- Skeleton loading state for the timeline.
- Zero-dependency local dev server (`npm run serve`).
- Repository hygiene: `.gitattributes`, `.editorconfig`, `CHANGELOG.md`.

### Changed

- Redesigned the site with an Apache Kafka-inspired theme (black top nav,
  node-graph logo, monochrome accent).
- Replaced the Bash + `jq` log generator with a cross-platform Node generator.
- The deploy workflow now regenerates `logs.json` on every push, so the index
  can never drift from the Markdown files.

### Removed

- `newlog.sh` and the stray `dl.zip` artifact.

## [1.0.0] - 2026-03-04

### Added

- Initial release: Markdown daily logs, timeline UI, Markdown reader, and
  GitHub Pages deployment.
