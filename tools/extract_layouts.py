from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_NAME = "eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf"
SOURCE = ROOT / SOURCE_NAME
if not SOURCE.exists() and ROOT.parent.name == ".worktrees":
    SOURCE = ROOT.parents[1] / SOURCE_NAME
OUTPUT = ROOT / "app" / "assets" / "layouts"
KEY_OUTPUT = ROOT / "app" / "assets" / "key"
DISPOSITION_OUTPUT = ROOT / "app" / "assets" / "dispositions"
BACKGROUND_OUTPUT = ROOT / "app" / "assets" / "backgrounds"
SCALE = 2
CROP_POINTS = (82, 245, 513, 765)
KEY_PAGE = 8
KEY_CROP_POINTS = (94, 42, 502, 778)
TERRAIN_RULES_PAGE = 7
TERRAIN_RULES_CROP_POINTS = (24, 29, 362, 659)
PAPER_PAGE = 9
PAPER_OBJECT_COUNT = 2
PAPER_TILES = 3
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
    BACKGROUND_OUTPUT.mkdir(parents=True, exist_ok=True)
    crop = tuple(point * SCALE for point in CROP_POINTS)
    key_crop = tuple(point * SCALE for point in KEY_CROP_POINTS)
    terrain_rules_crop = tuple(point * SCALE for point in TERRAIN_RULES_CROP_POINTS)

    with pdfium.PdfDocument(SOURCE) as document:
        for first_page, slug in GROUPS:
            for offset, layout in enumerate("abc"):
                image = document[first_page - 1 + offset].render(scale=SCALE).to_pil().convert("RGB")
                image.crop(crop).save(OUTPUT / f"{slug}-{layout}.webp", "WEBP", lossless=True, method=6)

        key = document[KEY_PAGE - 1].render(scale=SCALE).to_pil().convert("RGB")
        key.crop(key_crop).save(KEY_OUTPUT / "layouts-key.webp", "WEBP", lossless=True, method=6)

        terrain_rules = document[TERRAIN_RULES_PAGE - 1].render(scale=SCALE).to_pil().convert("RGB")
        terrain_rules.crop(terrain_rules_crop).save(KEY_OUTPUT / "terrain-rules.webp", "WEBP", lossless=True, method=6)

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

        paper_page = document[PAPER_PAGE - 1]
        paper_objects = list(paper_page.get_objects())
        if len(paper_objects) < PAPER_OBJECT_COUNT:
            raise SystemExit("Event Companion paper objects are missing")

        page_width, page_height = paper_page.get_size()
        for object_ in paper_objects[:PAPER_OBJECT_COUNT]:
            left, bottom, right, top = object_.get_bounds()
            if left > 0 or bottom > 0 or right < page_width or top < page_height:
                raise SystemExit("Event Companion paper object no longer covers the full page")

        for object_ in paper_objects[PAPER_OBJECT_COUNT:]:
            paper_page.remove_obj(object_)

        paper_tile = paper_page.render(scale=SCALE).to_pil().convert("RGB")
        for object_ in paper_objects:
            object_.close()
        if paper_tile.size != (1191, 1684):
            raise SystemExit(f"Unexpected Event Companion paper render size: expected (1191, 1684), got {paper_tile.size}")
        paper_tile = paper_tile.crop((0, 0, 1190, 1684))
        paper_width, paper_height = paper_tile.size
        paper = Image.new("RGB", (paper_width * PAPER_TILES, paper_height * PAPER_TILES))
        for row in range(PAPER_TILES):
            for column in range(PAPER_TILES):
                tile = paper_tile
                if column != 1:
                    tile = ImageOps.mirror(tile)
                if row != 1:
                    tile = ImageOps.flip(tile)
                paper.paste(tile, (column * paper_width, row * paper_height))

        paper.save(
            BACKGROUND_OUTPUT / "event-companion-paper.webp",
            "WEBP",
            lossless=True,
            method=6,
        )

    for old in OUTPUT.glob("*.png"):
        old.unlink()

    print(f"Created 45 layout maps in {OUTPUT.relative_to(ROOT)}")
    print(f"Created 5 disposition icons in {DISPOSITION_OUTPUT.relative_to(ROOT)}")
    print(f"Created layout key in {KEY_OUTPUT.relative_to(ROOT)}")
    print(f"Created terrain rules in {KEY_OUTPUT.relative_to(ROOT)}")
    print(f"Created Event Companion paper in {BACKGROUND_OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
