# Operación Volantín 🪁 (versión Netlify, sin login)

Calendario temático tipo when2meet para que la coordinación marque qué días puede juntarse antes del verano.
No pide iniciar sesión: cada navegador recuerda a su persona, y si alguien cambia de computador o celular, toca su nombre en "¿Ya votaste desde otro…?" para retomar su volantín.

## Dónde viven los datos

En **Netlify Blobs**, el almacenamiento que viene incluido en Netlify. No hay que crear ninguna base de datos aparte.
Una pequeña Netlify Function (`netlify/functions/votos.mjs`) lee y guarda los votos en `/api/votos`.
Cada persona se guarda como un registro separado, así que dos personas votando al mismo tiempo no se pisan.

```
operacion-volantin/
├── site/index.html              ← la página
├── netlify/functions/votos.mjs  ← la "base de datos" (GET/POST /api/votos)
├── netlify.toml                 ← le dice a Netlify qué publicar
└── package.json                 ← dependencia @netlify/blobs
```

> Ojo: **Netlify Drop** (arrastrar una carpeta) no publica funciones, así que no sirve para esto. Usa una de las dos opciones de abajo.

## Opción A: desde GitHub (recomendada)

1. Crea un repo nuevo en GitHub (puede ser privado) y sube esta carpeta tal cual.
2. En Netlify: **Add new site → Import an existing project → GitHub**, y elige el repo.
3. Netlify lee `netlify.toml` solo. No hay que tocar nada: dale **Deploy**.
4. Listo. Abre el link `https://<nombre>.netlify.app` y prueba votar.
   Si quieres un nombre más bonito: **Site configuration → Change site name** (por ejemplo, `operacion-volantin`).

## Opción B: desde la terminal

```bash
npm install -g netlify-cli
cd operacion-volantin
npm install
netlify login
netlify deploy --prod   # la primera vez te pregunta si crear un sitio nuevo: dile que sí
```

## Probar en tu computador antes de publicar

```bash
npm install
netlify dev   # abre http://localhost:8888
```

## Cosas útiles

- **Borrar los votos de prueba:** en Netlify, **Blobs → store "volantin"**, y borra los registros que quieras.
- **Cambiar fechas o feriados:** en `site/index.html` están arriba del script: `FERIADOS` (días bloqueados), `TAGS` (días con etiqueta pero votables) y `SUMMER` (inicio del verano). El rango de días está en el `for` que arma `days`.
- **Seguridad:** no hay login a propósito. Cualquiera con el link puede votar y escribir cualquier nombre. La función acepta máximo 40 volantines para que nadie llene la base por error.
