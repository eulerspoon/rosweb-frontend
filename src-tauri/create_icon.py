from PIL import Image, ImageDraw, ImageFont
import os

# Создаем папку для иконок если её нет
os.makedirs('icons', exist_ok=True)

# Создаем изображение 512x512 с альфа-каналом (RGBA)
img = Image.new('RGBA', (512, 512), (52, 152, 219, 255))  # RGBA синий цвет

# Создаем объект для рисования
draw = ImageDraw.Draw(img)

# Пытаемся использовать красивый шрифт, если доступен
try:
    # Попробуй разные пути к шрифтам
    font_paths = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
    ]
    
    font = None
    for font_path in font_paths:
        if os.path.exists(font_path):
            font = ImageFont.truetype(font_path, 200)
            break
    
    if font is None:
        # Используем стандартный шрифт
        font = ImageFont.load_default()
        # Для load_default увеличим размер
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 200)
        
except Exception as e:
    print(f"Font error: {e}")
    # Запасной вариант
    font = ImageFont.load_default()

# Рисуем букву R в центре
text = "R"
# Получаем размер текста
try:
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
except:
    # Для старых версий PIL
    text_width, text_height = draw.textsize(text, font=font)

# Вычисляем позицию для центрирования
x = (512 - text_width) // 2
y = (512 - text_height) // 2

# Рисуем текст белым цветом
draw.text((x, y), text, font=font, fill=(255, 255, 255, 255))

# Сохраняем в разных форматах
img.save('icons/icon.png')
img.save('icons/icon_512x512.png')

# Создаем уменьшенные версии
sizes = [32, 128, 256]
for size in sizes:
    small_img = img.resize((size, size), Image.Resampling.LANCZOS)
    small_img.save(f'icons/icon_{size}x{size}.png')

print("Иконки успешно созданы!")
print("Проверяем формат созданного файла...")
with Image.open('icons/icon.png') as test_img:
    print(f"Формат: {test_img.mode}")
    print(f"Размер: {test_img.size}")