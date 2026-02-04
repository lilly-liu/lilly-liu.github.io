#!/usr/bin/env python3
"""Make cream/off-white/beige background pixels transparent in plant PNGs. Requires: pip install Pillow"""

from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow first: pip install Pillow")
    raise

IMAGES_DIR = Path(__file__).resolve().parent.parent / "images"
FILES = [
    "pixel-plant.png",
    "pixel-plant-2.png",
    "pixel-plant-3.png",
    "pixel-plant-4.png",
    "pixel-plant-5.png",
]
# How close (in RGB) a pixel must be to the sampled background to become transparent
TOLERANCE = 35


def get_background_color(img):
    """Sample corners and top edge; return the most common light color (assumed background)."""
    w, h = img.size
    pixels = img.load()
    corners = [
        pixels[0, 0][:3],
        pixels[w - 1, 0][:3],
        pixels[0, h - 1][:3],
        pixels[w - 1, h - 1][:3],
    ]
    # Use top-left as reference; if corners differ, use the lightest (likely background)
    r = sum(p[0] for p in corners) // 4
    g = sum(p[1] for p in corners) // 4
    b = sum(p[2] for p in corners) // 4
    return (r, g, b)


def color_distance(c1, c2):
    return max(abs(c1[i] - c2[i]) for i in range(3))


def main():
    for name in FILES:
        path = IMAGES_DIR / name
        if not path.exists():
            print(f"Skip (not found): {path}")
            continue
        img = Image.open(path).convert("RGBA")
        bg = get_background_color(img)
        data = list(img.getdata())
        new_data = []
        for item in data:
            r, g, b, a = item
            if color_distance((r, g, b), bg) <= TOLERANCE:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        img.save(path, "PNG")
        print(f"Updated: {path} (bg sample: {bg})")


if __name__ == "__main__":
    main()
