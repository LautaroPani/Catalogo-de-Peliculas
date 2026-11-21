# API REST – Catálogo de películas

Trabajo práctico integrador (Bootcamp 5.0, módulo Node.js). API REST para gestionar un catálogo de películas, con registro y login de usuarios mediante Bcrypt y JWT.

## Tecnologías

- Node.js, Express y TypeScript
- MongoDB Atlas con Mongoose
- Bcrypt (hash de contraseñas) y jsonwebtoken (JWT)
- dotenv (variables de entorno)

## Instalación y ejecución

1. Clonar el repositorio e instalar las dependencias:

```bash
git clone <https://github.com/LautaroPani/Catalogo-de-Peliculas.git>
cd API REST - Catalogo Peliculas
npm install
```

2. Crear un archivo `.env` en la raíz a partir de `.env.example` y completar los valores:

```
PORT=3000
MONGO_URI="mongodb+srv://lautaropani_db_user:Tr4ekMHeEnB4tY9u@catalogo-de-peliculas.mgpfkyu.mongodb.net/peliculas?retryWrites=true&w=majority"
JWT_SECRET=<una_clave_larga_y_secreta_para_firmar_tokens>
```

3. Ejecutar en modo desarrollo:

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

Para compilar y ejecutar la versión de producción:

```bash
npm run build
npm start
```

## Estructura del proyecto

```
src/
  config/
    db.ts                    # conexión a MongoDB
  components/
    movies/                  # modelo, repositorio, servicio, controlador y rutas
    users/                   # modelo, repositorio, servicio, controlador y rutas
  middlewares/
    auth.middleware.ts       # verifica el JWT
    role.middleware.ts       # exige rol admin
    logger.middleware.ts     # muestra método y URL de cada petición
  utils/
    AppError.ts              # error con código de estado
    handleError.ts           # respuesta de error común a los controladores
  app.ts
  server.ts
```

Cada componente sigue la arquitectura en capas: **rutas → controlador → servicio → repositorio (acceso a datos)**.

## Endpoints

### Autenticación

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registra un usuario | No |
| POST | `/api/auth/login` | Inicia sesión y devuelve un JWT | No |

**Registro** – body:

```json
{ "name": "Usuario1", "email": "Usuario1@gmail.com", "password": "123456" }
```

**Login** – body:

```json
{ "email": "Usuario1@gmail.com", "password": "123456" }
```

Respuesta: `{ "token": "...", "user": { "id", "name", "email", "role" } }`.

### Películas

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/movies` | Lista todas las películas (admite filtros) | No |
| GET | `/api/movies/:id` | Obtiene una película por id | No |
| POST | `/api/movies` | Crea una película | Sí (JWT) |
| PUT | `/api/movies/:id` | Modifica una película | Sí (JWT) |
| DELETE | `/api/movies/:id` | Elimina una película | Sí (JWT, solo admin) |

**Crear / modificar** – body:

```json
{ "title": "Alien", "director": "Ridley Scott", "genre": "terror", "rating": 9 }
```

**Filtros** en `GET /api/movies` (combinables):

- `?genre=terror`
- `?director=scott`
- `?minRating=8`

Ejemplo: `GET /api/movies?genre=terror&minRating=8`

### Autenticación en las rutas protegidas

Enviar el token del login en el header:

```
Authorization: Bearer <token>
```

## Validaciones de negocio

- El puntaje (`rating`) debe ser un número entre 1 y 10.
- No puede haber dos películas con el mismo título y director.
- El email del usuario debe tener formato válido y no repetirse.
- La contraseña debe tener al menos 6 caracteres.

## Códigos de estado

| Código | Uso |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos, faltantes o duplicados |
| 401 | Token ausente, inválido o vencido; credenciales incorrectas |
| 403 | Usuario autenticado sin permisos (eliminar requiere rol admin) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

## Roles

Los usuarios se registran con el rol `user`. Solo un usuario con rol `admin` puede eliminar películas. Para crear un admin, editar el campo `role` del usuario directamente en la base de datos y volver a iniciar sesión.

## Extras implementados

- Filtros con `req.query`
- Roles (solo admin elimina)
- Relación entre modelos: cada película guarda el usuario que la creó (`createdBy`)
- Middleware de logging

## Pruebas

La colección de Thunder Client está en la carpeta `thunder-tests/` e incluye los casos exitosos y los casos de error (400, 401, 403 y 404) de cada endpoint.

## Autor

Lautaro Paniagua
