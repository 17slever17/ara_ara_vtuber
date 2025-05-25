import os
from PIL import Image

# Создаем подпапку для сохранения
output_dir = 'converted'
os.makedirs(output_dir, exist_ok=True)

# Проходимся по всем файлам в текущей директории
for filename in os.listdir('.'):
    if not (filename.endswith('.png') or filename.endswith('.gif')):
        continue

    # Имя без расширения
    name, ext = os.path.splitext(filename)
    try:
        with Image.open(filename) as img:
            # Если это GIF — берём первый кадр
            if ext.lower() == '.gif':
                img = img.convert('RGBA')  # иногда GIF в 'P' формате
                img = img.copy()  # важно для GIF
            else:
                img = img.convert('RGBA')

            # Проверка размера и ресайз при необходимости
            if img.width > 70 or img.height > 70:
                img = img.resize((52, 52), Image.LANCZOS)

            # Сохраняем как PNG в новую папку
            output_path = os.path.join(output_dir, f'{name}.png')
            img.save(output_path, 'PNG')

            print(f'✔️ {filename} -> {output_path}')
    except Exception as e:
        print(f'❌ Ошибка обработки {filename}: {e}')
