# ApoyoApp

MVP en Next.js + Firebase para centralizar solicitudes de apoyo psicologico y psiquiatrico.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Git.
- Opcional para modo produccion: un proyecto de Firebase con Authentication y Firestore.

## Funcionalidad incluida

- Registro de sintomas, duracion, urgencia, riesgo y metodo de contacto.
- Registro/login de profesionales con Firebase Auth.
- Panel privado de profesionales con alertas en tiempo real desde Firestore.
- Opcion para tomar una solicitud, cerrarla y abrir contacto por WhatsApp.
- Directorio inicial de profesionales en guardia.
- Seccion de grupos de apoyo.
- Modo demo local compartido por el servidor de desarrollo cuando Firebase no esta configurado.

## Instalacion rapida

1. Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd apoyoapp
```

2. Instala dependencias:

```bash
npm install
```

3. Inicia la app en modo demo local:

```bash
npm run dev
```

4. Abre:

```text
http://localhost:3000
```

En este modo no necesitas Firebase. Las solicitudes y profesionales demo se guardan en `.demo-store.json`, un archivo local ignorado por Git.

## Cargar datos demo

Para iniciar con datos de ejemplo:

```bash
copy data\demo-store.example.json .demo-store.json
```

En PowerShell tambien puedes usar:

```powershell
Copy-Item data\demo-store.example.json .demo-store.json
```

Luego reinicia:

```bash
npm run dev
```

## Configuracion con Firebase

1. Crea un proyecto en Firebase.

2. Activa Authentication:

- Ve a Firebase Console.
- Entra en Authentication.
- Activa el proveedor Email/Password.

3. Crea una base Firestore:

- Entra en Firestore Database.
- Crea la base en modo produccion o prueba.
- Publica reglas equivalentes a `firestore.rules`.

4. Copia `.env.example` a `.env.local`:

```bash
copy .env.example .env.local
```

5. Completa las credenciales web de Firebase en `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

6. Reinicia el servidor:

```bash
npm run dev
```

## Comandos disponibles

```bash
npm run dev
```

Levanta el servidor local en `http://localhost:3000`.

```bash
npm run build
```

Compila la app para produccion.

```bash
npm run start
```

Ejecuta la version compilada.

```bash
npm run lint
```

Corre ESLint.

## Base de datos

La app soporta dos fuentes de datos:

- Produccion o desarrollo real: Firebase Auth + Firestore.
- Demo local sin Firebase: archivo `.demo-store.json` en la raiz del proyecto, consumido por las rutas `/api/demo/*`.

El archivo `.demo-store.json` no se sube al repositorio. El ejemplo importable esta en `data/demo-store.example.json`.

## Firebase Auth

Para usar registro/login real de profesionales, activa Email/Password en Firebase Authentication.
Sin Firebase configurado, la app usa endpoints locales de Next para compartir solicitudes entre navegadores mientras el servidor `npm run dev` esta activo. La sesion del profesional demo se recuerda por navegador.

## Coleccion principal de Firestore

La app usa `helpRequests` para solicitudes de ayuda:

```ts
{
  name: string;
  age?: string;
  contactMethod: "whatsapp" | "phone" | "in_app";
  phone?: string;
  symptoms: string;
  duration: string;
  urgency: "low" | "medium" | "high" | "critical";
  safetyRisk: boolean;
  preferredSupport: "psychologist" | "psychiatrist" | "either";
  status: "pending" | "accepted" | "closed";
  assignedTo?: string;
  assignedProfessionalId?: string;
  createdAt: Timestamp;
}
```

Tambien usa `professionals/{uid}` para perfiles de profesionales autenticados:

```ts
{
  name: string;
  role: "Psicologo" | "Psiquiatra";
  specialty: string;
  license?: string;
  whatsapp?: string;
  availability: "En guardia" | "Disponible hoy" | "No disponible";
  createdAt: Timestamp;
}
```

## Pendientes antes de produccion

- Verificacion real de matriculas o credenciales profesionales.
- Reglas de Firestore por rol y permisos granulares.
- Consentimiento informado y politica de privacidad.
- Protocolo de crisis para solicitudes con `safetyRisk=true`.
- Notificaciones push o email para profesionales en guardia.
- Chat interno y auditoria de cambios de estado.
