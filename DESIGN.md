---
name: WH40K Terrain Layout
description: Restrained visual seed for an offline tournament terrain reference tool.
---

<!-- SEED: re-run $impeccable document once there's code to capture the actual tokens and components. -->

## Overview

Use a restrained, flat composition inspired by the official Event Companion v1.1 page, physical mission cards, and a printed tournament quick-reference sheet. The interface should feel like equipment for resolving a table setup, not a themed launcher. Exact spacing and component tokens remain unresolved until the implemented UI can be documented.

## Colors

Anchor the primary action and selection state with seed red `oklch(0.563 0.223 11)`. Pair it with a distinct dark blue accent, a true-neutral near-white background, white surfaces, and dark neutral ink. Exact supporting color tokens remain unresolved until implementation; all colors must use OKLCH and meet WCAG AA contrast.

## Typography

Use one system sans-serif family throughout with a compact, functional hierarchy. Exact sizes, weights, and line heights remain unresolved until implementation.

## Elevation

Keep surfaces flat like a printed tournament reference sheet. Separate regions with restrained solid borders rather than wide shadows; exact border tokens remain unresolved until implementation.

## Components

Use native selects, buttons, and dialog controls. Selector cards should be bordered and compact, layout buttons should expose a clear selected state, and the map should remain the visual focus. Use restrained state-only motion.

## Do's and Don'ts

Do preserve official terminology, one-screen scanning, visible focus, 44px targets, and reduced-motion behavior. Don't use gradients, glass effects, decorative grids, fantasy ornament, external fonts, or generic dashboard chrome.
