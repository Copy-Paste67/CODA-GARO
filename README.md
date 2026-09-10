# CODA-GARO
Plataforma web dedicada a la adopción responsable de mascotas, diseñada para conectar perros y gatos rescatados con sus hogares definitivos de forma intuitiva, segura y cercana

## Uso de pnpm

Se recomienda usar pnpm como gestor de paquetes. Opciones de instalación y uso:

- Instalar y activar `pnpm` (recomendado vía Corepack si usas Node.js reciente):

```
corepack enable
corepack prepare pnpm@latest --activate
```

- Alternativamente, instalar globalmente (requiere permisos):

```
npm i -g pnpm
```

- Instalar dependencias del proyecto:

```
pnpm install
```

- Ejecutar scripts definidos en package.json:

```
pnpm run dev
```

Los archivos de configuración añadidos son: [package.json](package.json), [.npmrc](.npmrc), y [pnpm-workspace.yaml](pnpm-workspace.yaml).
