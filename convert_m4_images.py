"""
Script para convertir imágenes HEIC del M4 a JPG
"""
from PIL import Image
import pillow_heif
import os

# Registrar el plugin HEIF
pillow_heif.register_heif_opener()

# Directorio de imágenes M4
m4_dir = r"c:\Users\Stabiloboss\.gemini\antigravity\scratch\edplit-espana\images\products\M4_"

# Lista de imágenes HEIC a convertir
heic_files = [
    "IMG_5162.HEIC",
    "IMG_5163.HEIC",
    "IMG_5166.HEIC"
]

# Nombres de salida
output_names = [
    "m4-1.jpg",
    "m4-2.jpg",
    "m4-3.jpg"
]

for heic_file, output_name in zip(heic_files, output_names):
    input_path = os.path.join(m4_dir, heic_file)
    output_path = os.path.join(m4_dir, output_name)
    
    try:
        # Abrir imagen HEIC
        img = Image.open(input_path)
        
        # Convertir a RGB si es necesario
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Guardar como JPG con calidad alta
        img.save(output_path, 'JPEG', quality=90, optimize=True)
        print(f"✓ Convertido: {heic_file} -> {output_name}")
        
    except Exception as e:
        print(f"✗ Error al convertir {heic_file}: {e}")

print("\n¡Conversión completada!")
