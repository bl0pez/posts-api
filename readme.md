# NodeJS Rest API

## Instalacion
1. Clonar el repositorio
2. Renombrar el archivo .example.env a .env
3. Configurar las variables de entorno
4. Ejecutar el comando `npm install`
5. Ejecutar el comando `npm run dev`



## Post EndPoints

Obtener todos los posts
- GET  /feed/posts 

query Params
``` 
{
    currentPage: 1
    perPage: 2
}
```

Crear un post
- POST /feed/post

body
``` 
{
    title: '',
    content: '',
    imageUrl: ''
}
```

Obtener un post
- GET /feed/post/:postId

Actualizar un post
- PUT /feed/post/:postId

Eliminar un post
- DELETE /feed/post/:postId

## User EndPoints

Crear un usuario
- POST /auth/signup

body
```
{
    email: '',
    password: '',
    name: ''
}
```

Iniciar sesion

- POST /auth/login

body
```
{
    email: '',
    password: ''
}
```