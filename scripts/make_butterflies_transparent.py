#!/usr/bin/env python3
"""Make white/near-white pixels transparent in butterfly PNGs. Requires: pip install Pillow"""

from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow first: pip install Pillow")
    raise

IMAGES_DIR = Path(__file__).resolve().parent.parent / "images"
FILES = ["butterfly-pink.png", "butterfly-orange.png"]
WHITE_THRESHOLD = 245  # pixels with R,G,B all above this become transparent


def main():
    for name in FILES:
        path = IMAGES_DIR / name
        if not path.exists():
            print(f"Skip (not found): {path}")
            continue
        img = Image.open(path).convert("RGBA")
        data = list(img.getdata())
        new_data = []
        for item in data:
            r, g, b, a = item
            if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        img.save(path, "PNG")
        print(f"Updated: {path}")


if __name__ == "__main__":
    main()
