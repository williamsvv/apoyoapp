# ApoyoApp / PsicoAyudaVzla

Base Next.js para centralizar apoyo psicologico en Venezuela: guardias activas, directorio de voluntarios, grupos de apoyo, guias psicoeducativas y acceso de voluntarios.

Este proyecto ahora usa como base la estructura de `RicardoMicale/PsicoAyudaVzla` y conserva el objetivo original de ApoyoApp.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Git.
- Opcional: proyecto Firebase con Auth y Firestore.

## Instalacion

```bash
git clone https://github.com/williamsvv/apoyoapp.git
cd apoyoapp
npm install
npm run dev
```

Abre:

```text
http://localhost:3000
```

## Variables de entorno

Copia `.env.example` a `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

Completa:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Si no configuras Firebase, la app usa datos mock/locales para voluntarios y grupos.

## Firebase

Para usar Firebase real:

1. Crea un proyecto en Firebase.
2. Activa Authentication con Email/Password.
3. Crea Firestore Database.
4. Completa `.env.local`.
5. Reinicia `npm run dev`.

Colecciones usadas por la base actual:

- `voluntarios`: profesionales/voluntarios con perfil, telefono, WhatsApp, guardia activa y autorizacion.
- `grupos`: grupos de apoyo.

## Comandos

```bash
npm run dev
```

Levanta el servidor local.

```bash
npm run lint
```

Ejecuta ESLint.

```bash
npm run build
```

Compila para produccion.

```bash
npm run start
```

Ejecuta la version compilada.

## Que trae esta base

- Navegacion por secciones con sidebar desktop y navegacion mobile.
- Guardias activas con llamada y WhatsApp.
- Directorio filtrable de voluntarios.
- Registro/login de voluntarios.
- Panel modal para cambiar estado de guardia y editar perfil.
- Grupos de apoyo.
- Guia de diagnostico/autoregulacion.
- Reacciones ante sismo.
- Alertas criticas y protocolo.
- Duelo y habitos saludables.
- Contenido centralizado en `app/data/content.json`.

## Que falta para completar la idea original

- Formulario publico para que una persona describa sintomas y solicite ayuda.
- Cola de solicitudes entrantes para profesionales logueados.
- Asignacion de una solicitud a un profesional.
- Estado de solicitud: pendiente, atendida, cerrada.
- Notificaciones a profesionales en guardia.
- Persistencia completa en Firestore de solicitudes de ayuda.
- Reglas de seguridad por rol en Firestore.
- Verificacion real de credenciales profesionales.
- Consentimiento informado y politica de privacidad.
- Registro/auditoria de atenciones.
