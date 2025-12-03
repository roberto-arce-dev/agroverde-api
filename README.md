# AgroVerde API

## Descripción

Similar a SaborLocal, productos agrícolas

API RESTful construida con NestJS, MongoDB y arquitectura DDD (Domain-Driven Design) que separa la autenticación (User) del dominio de negocio (Profiles).

## Tecnologías

- **Framework:** NestJS
- **Base de datos:** MongoDB con Mongoose
- **Autenticación:** JWT (JSON Web Tokens)
- **Validación:** class-validator, class-transformer
- **Documentación:** Swagger/OpenAPI
- **Rate Limiting:** @nestjs/throttler
- **Upload de archivos:** Multer + Sharp (thumbnails)

## Arquitectura

### Patrón DDD (Domain-Driven Design)

**Separación de dominios:**
- **Dominio de Autenticación:** `User` (email, password, role)
- **Dominio de Negocio:** `Profiles` (datos específicos de cada rol)

**Factory Pattern:** El servicio de autenticación crea automáticamente el Profile correspondiente según el rol del usuario durante el registro.

### Roles del Sistema

- **CLIENTE**
- **PRODUCTOR**
- **ADMIN**

### Profiles

- **ClienteProfile** (rol: CLIENTE)
- **ProductorProfile** (rol: PRODUCTOR)

### Entidades de Negocio

- ProductoAgricola
- Pedido
- RutaEntrega

---

## Instalación

### Requisitos Previos

- Node.js 18+
- npm o yarn
- MongoDB 4.4+

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd agroverde-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del proyecto:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/agroverde_db

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Puerto
PORT=3011

# Node Environment
NODE_ENV=development
```

Para producción, crear `.env.production`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/agroverde_db
JWT_SECRET=otro_secreto_diferente_para_produccion
JWT_EXPIRES_IN=7d
PORT=3011
NODE_ENV=production
```

4. **Compilar el proyecto**
```bash
npm run build
```

---

## Ejecución

### Modo Desarrollo
```bash
npm run start:dev
```

### Modo Producción
```bash
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3011`

---

## Documentación API (Swagger)

Una vez iniciado el servidor, accede a la documentación interactiva:

**URL:** `http://localhost:3011/api`

Swagger proporciona:
- Lista completa de endpoints
- Modelos de datos
- Posibilidad de probar endpoints directamente
- Ejemplos de requests y responses

---

## Endpoints Principales

### Autenticación

#### Registrar Usuario
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "role": "CLIENTE",
  "nombre": "Juan Pérez",
  "telefono": "+51 987654321",
  "direccion": "Av. Principal 123"
}
```

**Respuesta exitosa:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "CLIENTE",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Roles disponibles para registro:**
- `CLIENTE`
- `PRODUCTOR`

#### Iniciar Sesión
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (User + Profile merged):**

**🔹 IMPORTANTE:** El endpoint de login ahora devuelve los datos del User combinados con los datos del Profile correspondiente.

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "CLIENTE",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    
    "nombre": "Juan Pérez",
    "telefono": "+51 987654321",
    "direccion": "Av. Principal 123",
    "preferencias": ["organico", "local"],
    
    "profileId": "507f1f77bcf86cd799439012",
    "profileCreatedAt": "2024-01-01T00:00:00.000Z",
    "profileUpdatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Nota:** Los campos específicos del profile varían según el rol:
- **CLIENTE:** nombre, telefono, direccion, preferencias, ubicacion
- **PRODUCTOR:** nombreNegocio, nombreContacto, telefono, direccion, descripcion, certificaciones, categorias

#### Obtener Información del Usuario Autenticado
```bash
GET /api/auth/profile
Authorization: Bearer {access_token}
```

**Respuesta exitosa (User + Profile merged):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "usuario@example.com",
  "role": "CLIENTE",
  "isActive": true,
  "emailVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  
  "nombre": "Juan Pérez",
  "telefono": "+51 987654321",
  "direccion": "Av. Principal 123",
  "preferencias": ["organico", "local"],
  
  "profileId": "507f1f77bcf86cd799439012",
  "profileCreatedAt": "2024-01-01T00:00:00.000Z",
  "profileUpdatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Profiles

### ClienteProfile

**Rol asociado:** `CLIENTE`

**Endpoints disponibles:**

#### Obtener mi perfil
```bash
GET /api/cliente-profile/me
Authorization: Bearer {token}
```

**🔹 NOTA:** Este endpoint usa `findOrCreateByUserId()`, lo que significa que si el usuario no tiene un profile creado, se creará automáticamente con valores por defecto.

**Respuesta:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",
  "nombre": "Juan Pérez",
  "telefono": "+51 987654321",
  "direccion": "Av. Principal 123",
  "preferencias": ["organico"],
  "ubicacion": {
    "type": "Point",
    "coordinates": [-77.0428, -12.0464]
  },
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Actualizar mi perfil
```bash
PUT /api/cliente-profile/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Juan Pérez Actualizado",
  "telefono": "+51 999888777",
  "direccion": "Nueva dirección",
  "preferencias": ["organico", "local"]
}
```

#### Listar todos los perfiles (Admin)
```bash
GET /api/cliente-profile
Authorization: Bearer {token_admin}
```

#### Obtener perfil por userId (Admin)
```bash
GET /api/cliente-profile/{userId}
Authorization: Bearer {token_admin}
```


### ProductorProfile

**Rol asociado:** `PRODUCTOR`

**Endpoints disponibles:**

#### Obtener mi perfil
```bash
GET /api/productor-profile/me
Authorization: Bearer {token}
```

**🔹 NOTA:** Este endpoint usa `findOrCreateByUserId()`, lo que significa que si el usuario no tiene un profile creado, se creará automáticamente con valores por defecto.

**Respuesta:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",
  "nombreNegocio": "Frutas del Valle",
  "nombreContacto": "María García",
  "telefono": "+51 987654321",
  "direccion": "Fundo La Esperanza",
  "descripcion": "Productores de frutas orgánicas",
  "certificaciones": ["organico", "comercio-justo"],
  "categorias": ["frutas", "verduras"],
  "ubicacion": {
    "type": "Point",
    "coordinates": [-77.0428, -12.0464]
  },
  "isActive": true,
  "isVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Actualizar mi perfil
```bash
PUT /api/productor-profile/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombreNegocio": "Frutas del Valle S.A.",
  "nombreContacto": "María García",
  "telefono": "+51 999888777",
  "descripcion": "Productores certificados de frutas orgánicas"
}
```

#### Listar todos los perfiles (Admin)
```bash
GET /api/productor-profile
Authorization: Bearer {token_admin}
```

#### Obtener perfil por userId (Admin)
```bash
GET /api/productor-profile/{userId}
Authorization: Bearer {token_admin}
```


---

