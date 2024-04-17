# Restaurant

Express, Sequelize, PostgresQl, REST API, Supabase, Claudinary

- npm install

- change config

```javascript
// config/config.json
  "development": {
    "username": "postgres",// change this
    "password": "postgres",// change this
    "database": "Restaurant_DB",// change this
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
```

- make .env
- change .env

```javascript
// .env
PORT=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
DATABASE_URL=
```

- npx sequelize-cli db:create
- npx sequelize-cli db:migrate
- npx sequelize-cli db:seed:all
- npm start

http://localhost:3000/

- update image may be wrong

- npm run test

Postman documentation

- https://documenter.getpostman.com/view/32679813/2sA2rFRfSs
