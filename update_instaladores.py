#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
update_instaladores.py
======================
Lee un CSV con los instaladores oficiales de EDPLIT, geocodifica las
direcciones con Nominatim (OpenStreetMap, gratuito, sin API key) y
actualiza automáticamente el array INSTALADORES en index.html.

USO:
    python update_instaladores.py                        # usa instaladores_template.csv
    python update_instaladores.py mis_instaladores.csv   # usa otro CSV

COLUMNAS REQUERIDAS EN EL CSV:
    nombre    - Nombre de la empresa
    tipo      - instalador | arquitecto | distribuidor
    ciudad    - Ciudad
    provincia - Provincia
    telefono  - Teléfono de contacto
    web       - URL de la web (o # si no tiene)
    direccion - Dirección completa para geocodificar (ej: "Calle Mayor 1, Madrid")
"""

import csv
import json
import re
import sys
import time
import urllib.request
import urllib.parse
from pathlib import Path

# ─── Configuración ────────────────────────────────────────────────────────────
HTML_FILE    = Path(__file__).parent / "index.html"
DEFAULT_CSV  = Path(__file__).parent / "instaladores_template.csv"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
DELAY_SEC    = 1.2   # Espera entre llamadas para respetar el rate limit de Nominatim

# ─── Colores por tipo (para validación) ───────────────────────────────────────
TIPOS_VALIDOS = {"instalador", "arquitecto", "distribuidor"}


def geocode(direccion: str) -> tuple[float, float] | None:
    """Convierte una dirección en (lat, lng) usando Nominatim."""
    params = urllib.parse.urlencode({
        "q": direccion,
        "format": "json",
        "limit": 1,
        "countrycodes": "es"
    })
    url = f"{NOMINATIM_URL}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "edplit-instaladores/1.0"})

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            if data:
                return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"   ⚠️  Error geocodificando '{direccion}': {e}")

    return None


def leer_csv(csv_path: Path) -> list[dict]:
    """Lee el CSV y devuelve lista de registros."""
    instaladores = []
    with open(csv_path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)

        # Verificar columnas requeridas
        requeridas = {"nombre", "tipo", "ciudad", "provincia", "telefono", "web", "direccion"}
        faltantes = requeridas - set(reader.fieldnames or [])
        if faltantes:
            print(f"❌ El CSV no tiene las columnas: {', '.join(faltantes)}")
            print(f"   Columnas encontradas: {', '.join(reader.fieldnames or [])}")
            sys.exit(1)

        for i, row in enumerate(reader, start=2):
            nombre = row["nombre"].strip()
            tipo   = row["tipo"].strip().lower()

            if not nombre:
                print(f"   ⚠️  Fila {i}: nombre vacío, se omite")
                continue

            if tipo not in TIPOS_VALIDOS:
                print(f"   ⚠️  Fila {i} ({nombre}): tipo '{tipo}' no válido. Usa: {', '.join(TIPOS_VALIDOS)}. Se marca como 'instalador'.")
                tipo = "instalador"

            instaladores.append({
                "id":        i - 1,
                "nombre":    nombre,
                "tipo":      tipo,
                "ciudad":    row["ciudad"].strip(),
                "provincia": row["provincia"].strip(),
                "telefono":  row["telefono"].strip(),
                "web":       row["web"].strip() or "#",
                "direccion": row["direccion"].strip(),
                "lat":       None,
                "lng":       None,
            })

    return instaladores


def geocodificar_todos(instaladores: list[dict]) -> list[dict]:
    """Geocodifica todos los instaladores."""
    total = len(instaladores)
    for idx, inst in enumerate(instaladores, start=1):
        direccion = inst["direccion"]
        print(f"  [{idx}/{total}] Geocodificando: {inst['nombre']} — {direccion}")
        coords = geocode(direccion)
        if coords:
            inst["lat"], inst["lng"] = round(coords[0], 6), round(coords[1], 6)
            print(f"         ✅ {inst['lat']}, {inst['lng']}")
        else:
            # Fallback: intentar solo ciudad + provincia
            fallback = f"{inst['ciudad']}, {inst['provincia']}, España"
            print(f"         ↩️  Reintentando con: {fallback}")
            time.sleep(DELAY_SEC)
            coords = geocode(fallback)
            if coords:
                inst["lat"], inst["lng"] = round(coords[0], 6), round(coords[1], 6)
                print(f"         ✅ {inst['lat']}, {inst['lng']}")
            else:
                print(f"         ❌ No se pudo geocodificar. Se usará coordenada (0,0). Edítala manualmente.")
                inst["lat"], inst["lng"] = 0.0, 0.0

        time.sleep(DELAY_SEC)

    return instaladores


def generar_js_array(instaladores: list[dict]) -> str:
    """Genera el bloque JavaScript del array INSTALADORES."""
    lines = ["      const INSTALADORES = ["]
    for inst in instaladores:
        web_str = inst["web"] if inst["web"] else "#"
        line = (
            f'        {{ id:{inst["id"]}, '
            f'nombre:"{inst["nombre"]}", '
            f'tipo:"{inst["tipo"]}", '
            f'ciudad:"{inst["ciudad"]}", '
            f'provincia:"{inst["provincia"]}", '
            f'telefono:"{inst["telefono"]}", '
            f'web:"{web_str}", '
            f'lat:{inst["lat"]}, '
            f'lng:{inst["lng"]} }}'
        )
        if inst is not instaladores[-1]:
            line += ","
        lines.append(line)
    lines.append("      ];")
    return "\n".join(lines)


def actualizar_html(html_path: Path, nuevo_array: str) -> bool:
    """Reemplaza el bloque INSTALADORES en el HTML."""
    content = html_path.read_text(encoding="utf-8")

    # Busca el array entre "const INSTALADORES = [" y "];"
    pattern = r"(\s*const INSTALADORES = \[)[\s\S]*?(\s*\];)"
    nuevo = "\n" + nuevo_array + "\n"

    nuevo_content, count = re.subn(pattern, nuevo, content, count=1)

    if count == 0:
        print("❌ No se encontró el bloque 'const INSTALADORES' en index.html")
        print("   Asegúrate de que el script de instaladores está en el HTML.")
        return False

    html_path.write_text(nuevo_content, encoding="utf-8")
    return True


def main():
    # Fix Windows console encoding
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

    # Determinar archivo CSV
    if len(sys.argv) > 1:
        csv_path = Path(sys.argv[1])
        if not csv_path.is_absolute():
            csv_path = Path(__file__).parent / csv_path
    else:
        csv_path = DEFAULT_CSV

    if not csv_path.exists():
        print(f"[ERROR] No se encontro el CSV: {csv_path}")
        print(f"   Crea tu CSV basandote en: instaladores_template.csv")
        sys.exit(1)

    print(f"\n[MAPA] EDPLIT -- Actualizador de Instaladores en el Mapa")
    print(f"{'='*55}")
    print(f"[CSV]  {csv_path.name}")
    print(f"[HTML] {HTML_FILE.name}")
    print()

    # 1. Leer CSV
    print("[1/4] Leyendo CSV...")
    instaladores = leer_csv(csv_path)
    print(f"   OK: {len(instaladores)} instaladores encontrados\n")

    if not instaladores:
        print("[ERROR] El CSV esta vacio o no tiene filas validas.")
        sys.exit(1)

    # 2. Geocodificar
    print("[2/4] Geocodificando direcciones (Nominatim/OpenStreetMap)...")
    print("   (Esto puede tardar ~1s por instalador...)\n")
    instaladores = geocodificar_todos(instaladores)

    # 3. Generar JS
    print("\n[3/4] Generando nuevo array JavaScript...")
    nuevo_array = generar_js_array(instaladores)

    # 4. Actualizar HTML
    print("[4/4] Actualizando index.html...")
    if actualizar_html(HTML_FILE, nuevo_array):
        print("   OK: index.html actualizado correctamente\n")
    else:
        sys.exit(1)

    # 5. Resumen
    sin_coords = [i for i in instaladores if i["lat"] == 0.0 and i["lng"] == 0.0]
    print("-" * 55)
    print(f"[LISTO] {len(instaladores)} instaladores anyadidos al mapa")
    if sin_coords:
        print(f"\n[AVISO] {len(sin_coords)} instaladores sin coordenadas:")
        for i in sin_coords:
            print(f"   - {i['nombre']} ({i['direccion']})")
    print()
    print("Proximos pasos:")
    print("   1. git add index.html")
    print("   2. git commit -m \"actualizar instaladores\"")
    print("   3. git push origin main")
    print()


if __name__ == "__main__":
    main()
