from pathlib import Path

import pypdfium2 as pdfium


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf"
OUTPUT = ROOT / "app" / "assets" / "layouts"
SCALE = 2
CROP_POINTS = (82, 245, 513, 765)
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
    crop = tuple(point * SCALE for point in CROP_POINTS)

    with pdfium.PdfDocument(SOURCE) as document:
        for first_page, slug in GROUPS:
            for offset, layout in enumerate("abc"):
                image = document[first_page - 1 + offset].render(scale=SCALE).to_pil().convert("RGB")
                image.crop(crop).save(OUTPUT / f"{slug}-{layout}.png", optimize=True)

    print(f"Created 45 layout images in {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
