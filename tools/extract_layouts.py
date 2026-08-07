from pathlib import Path

import pypdfium2 as pdfium


ROOT = Path(__file__).resolve().parents[1]
SOURCE_NAME = "eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf"
SOURCE = ROOT / SOURCE_NAME
if not SOURCE.exists() and ROOT.parent.name == ".worktrees":
    SOURCE = ROOT.parents[1] / SOURCE_NAME
OUTPUT = ROOT / "app" / "assets" / "layouts"
KEY_OUTPUT = ROOT / "app" / "assets" / "key"
DISPOSITION_OUTPUT = ROOT / "app" / "assets" / "dispositions"
SCALE = 2
CROP_POINTS = (82, 245, 513, 765)
KEY_PAGE = 8
ICON_CROPS = {
    "take-and-hold": (160, 76, 208, 124),
    "purge-the-foe": (384, 76, 432, 124),
    "disruption": (384, 76, 432, 124),
    "reconnaissance": (384, 76, 432, 124),
    "priority-assets": (384, 76, 432, 124),
}
ICON_PAGES = {
    "take-and-hold": 9,
    "purge-the-foe": 12,
    "disruption": 15,
    "reconnaissance": 18,
    "priority-assets": 21,
}
GROUPS = [
    (9, "take-and-hold--take-and-hold"),
    (12, "take-and-hold--purge-the-foe"),
    (15, "take-and-hold--disruption"),
    (18, "take-and-hold--reconnaissance"),
    (21, "take-and-hold--priority-assets"),
    (24, "purge-the-foe--purge-the-foe"),
    (27, "purge-the-foe--disruption"),
    (30, "purge-the-foe--reconnaissance"),
    (33, "purge-the-foe--priority-assets"),
    (36, "disruption--disruption"),
    (39, "disruption--reconnaissance"),
    (42, "disruption--priority-assets"),
    (45, "reconnaissance--reconnaissance"),
    (48, "reconnaissance--priority-assets"),
    (51, "priority-assets--priority-assets"),
]


def main():
    if not SOURCE.exists():
        raise SystemExit(f"Missing source PDF: {SOURCE}")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    KEY_OUTPUT.mkdir(parents=True, exist_ok=True)
    DISPOSITION_OUTPUT.mkdir(parents=True, exist_ok=True)
    crop = tuple(point * SCALE for point in CROP_POINTS)

    with pdfium.PdfDocument(SOURCE) as document:
        for first_page, slug in GROUPS:
            for offset, layout in enumerate("abc"):
                image = document[first_page - 1 + offset].render(scale=SCALE).to_pil().convert("RGB")
                image.crop(crop).save(OUTPUT / f"{slug}-{layout}.webp", "WEBP", lossless=True, method=6)

        key = document[KEY_PAGE - 1].render(scale=SCALE).to_pil().convert("RGB")
        key.save(KEY_OUTPUT / "layouts-key.webp", "WEBP", lossless=True, method=6)

        for slug, page_no in ICON_PAGES.items():
            page = document[page_no - 1].render(scale=SCALE).to_pil().convert("RGBA")
            icon_crop = tuple(point * SCALE for point in ICON_CROPS[slug])
            icon = page.crop(icon_crop)
            pixels = icon.load()
            for y in range(icon.height):
                for x in range(icon.width):
                    r, g, b, a = pixels[x, y]
                    if a and r > 215 and g > 215 and b > 215:
                        pixels[x, y] = (255, 255, 255, 0)
            icon.save(DISPOSITION_OUTPUT / f"{slug}.webp", "WEBP", lossless=True, method=6)

    for old in OUTPUT.glob("*.png"):
        old.unlink()

    print(f"Created 45 layout maps in {OUTPUT.relative_to(ROOT)}")
    print(f"Created 5 disposition icons in {DISPOSITION_OUTPUT.relative_to(ROOT)}")
    print(f"Created layout key in {KEY_OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
