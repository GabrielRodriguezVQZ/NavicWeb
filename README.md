# 🦐 NAVIC — Página Web

Página web oficial de **NAVIC**, emprendimiento de ropa para hombre en Barranquilla, Colombia.

---

## 📁 Estructura del proyecto

```
navic/
├── index.html          ← Página principal (no renombrar)
├── README.md           ← Este archivo
├── 404.html            ← Página de error personalizada
├── css/
│   └── styles.css      ← Todos los estilos de la página
├── js/
│   └── main.js         ← Búsqueda, menú móvil, animaciones
└── fotos/              ← Aquí van tus fotos de productos
    ├── hero.jpg
    ├── oversized.jpg
    ├── pantaloneta.jpg
    ├── set-negro.jpg
    ├── set-marfil.jpg
    ├── polo.jpg
    ├── camisa-botones.jpg
    └── bermuda.jpg
```

---

## 🚀 Cómo subir a GitHub Pages (gratis)

### Paso 1 — Crear cuenta y repositorio
1. Ve a [github.com](https://github.com) y crea una cuenta gratuita
2. Haz clic en **"New repository"**
3. Llámalo `navic` (en minúsculas, sin espacios)
4. Márcalo como **Public**
5. Haz clic en **"Create repository"**

### Paso 2 — Subir los archivos
1. En tu repositorio vacío, haz clic en **"uploading an existing file"**
2. Arrastra **toda la carpeta navic** (o selecciona todos los archivos)
3. Asegúrate de mantener la estructura de carpetas (`css/`, `js/`, `fotos/`)
4. Escribe un mensaje como `"Primer subida"` y haz clic en **"Commit changes"**

### Paso 3 — Activar GitHub Pages
1. Ve a **Settings** (en tu repositorio)
2. En el menú izquierdo busca **"Pages"**
3. En **"Source"** selecciona `Deploy from a branch`
4. En **"Branch"** selecciona `main` y carpeta `/root`
5. Haz clic en **"Save"**
6. Espera 1-2 minutos y tu URL quedará así:
   ```
   https://tu-usuario.github.io/navic
   ```

---

## 🖼️ Cómo agregar tus fotos

1. Guarda tus fotos con los nombres indicados en la carpeta `fotos/`
2. En `index.html`, busca el comentario de cada producto. Por ejemplo:
   ```html
   <!-- <img src="fotos/oversized.jpg" alt="Camiseta Oversized NAVIC" loading="lazy"> -->
   <div class="product-img-placeholder" aria-hidden="true">👕</div>
   ```
3. **Descomenta** la línea del `<img>` (quita los `<!--` y `-->`)
4. **Elimina** la línea del `<div class="product-img-placeholder">`
5. Sube los cambios a GitHub

### Tamaño recomendado para fotos
| Foto | Tamaño recomendado |
|------|--------------------|
| Hero (portada) | 1200 × 1600 px |
| Productos | 800 × 1067 px (relación 3:4) |
| Formato | JPG o WebP |
| Peso máximo | 500 KB por foto |

> 💡 Puedes comprimir tus fotos gratis en [squoosh.app](https://squoosh.app)

---

## ✏️ Cómo actualizar precios o productos

Abre `index.html` y busca el producto que quieres editar. Cada producto tiene esta estructura:

```html
<article class="product-card fade-up"
  data-name="nombre del producto"       ← Para la búsqueda
  data-colors="colores disponibles"     ← Para la búsqueda
  data-tags="palabras clave extra">     ← Para la búsqueda
  ...
  <div class="product-name">Nombre</div>
  <div class="product-price">$XX.000</div>
```

Solo edita el texto entre las etiquetas y guarda el archivo.

---

## 📞 Datos de contacto en la página

Si cambias de número o usuario de Instagram, búscalos en `index.html` y `js/main.js`:

- **WhatsApp:** `573147789579` (con código de país, sin espacios ni `+`)
- **Instagram:** `@navic.col`

---

## 🎨 Paleta de colores (Opción C — Neutral moderna)

| Variable | Color | Hex |
|----------|-------|-----|
| `--off-white` | Fondo principal | `#FAF8F5` |
| `--sand` | Fondo tarjetas | `#E8E4DC` |
| `--terracotta` | Acentos / etiquetas | `#C17B4A` |
| `--brown-dark` | Texto principal / botones | `#3D3935` |
| `--khaki` | Texto secundario | `#8B7355` |
| `--muted` | Texto tenue | `#7A756F` |

Para cambiar colores edita las variables en `css/styles.css` dentro de `:root { }`.

---

## 🔍 Función de búsqueda

La barra de búsqueda en el nav filtra los productos en tiempo real. Busca por:
- Nombre del producto: `"polo"`, `"camisa"`, `"bermuda"`
- Color: `"negro"`, `"azul"`, `"marfil"`, `"verde"`
- Palabras clave: `"set"`, `"combo"`, `"formal"`, `"short"`

Para agregar más palabras clave a un producto, edita `data-tags=""` en su `<article>`.

---

*Hecho con ❤️ para NAVIC · Barranquilla, Colombia*
