# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

Change categories are:

* `Added` for new features.
* `Changed` for changes in existing functionality.
* `Deprecated` for once-stable features removed in upcoming releases.
* `Removed` for deprecated features removed in this release.
* `Fixed` for any bug fixes.
* `Security` to invite users to upgrade in case of vulnerabilities.

## [Unreleased]

(Nothing yet)

## [3.0.0] - 2021-10-10

### Changed

This change reverts the earlier syntax change, back to the original syntax.

* BREAKING CHANGE: Revert syntax change in 2.0.0

## [2.0.1] - 2021-09-30

### Fixed

- If the package.json has `type: module` than the `module` needs to point to a file ending
  in `.js` and the `main` to one ending in `.cjs`.

## [2.0.0] - 2021-09-28

### Changed

* BREAKING CHANGE: Changed syntax from `---!name#id[metadata]` to `---[[name#id|metadata]]` in
  order make some additional planned features more consistent.
* BREAKING CHANGE: Dropped support for NodeJS pre-12, added tests for 12, 14, and 16.
* Dropped `zora` in favor of `uvu` for better diff printouts.

## [1.2.2] - 2021-09-06

### Fixed

* Some minor language issues.

## [1.2.0] and [1.2.1] - 2020-07-21

### Added

* Added support for multi-line metadata. 🎉

## [1.1.1] - 2020-06-01

### Fixed

* Properly compiled before publishing.

## [1.1.0] - 2020-06-01

### Added

* Warning objects now include the line number as `index`, to make it
  clearer where the warning originated.

## [1.0.2] - 2020-04-04

### Fixed

- Update dev dependencies, and clean up the README file a bit.

## [1.0.1] - 2020-04-04

### Fixed

- File naming is more consistent. Files specified more carefully in `package.json` and available at `dist/*` in CommonJS and ES syntax, for easier consumption.

## [1.0.0] - 2020-04-04

- Initial project release. 🎉

[Unreleased]: https://github.com/saibotsivad/blockdown/compare/master...develop
[3.0.0]: https://github.com/saibotsivad/blockdown/compare/v2.0.1...v3.0.0
[2.0.1]: https://github.com/saibotsivad/blockdown/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/saibotsivad/blockdown/compare/v1.2.2...v2.0.0
[1.2.2]: https://github.com/saibotsivad/blockdown/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/saibotsivad/blockdown/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/saibotsivad/blockdown/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/saibotsivad/blockdown/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/saibotsivad/blockdown/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/saibotsivad/blockdown/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/saibotsivad/blockdown/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/saibotsivad/blockdown/tree/v1.0.0
