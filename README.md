# Cardinator

This is a backend application built with Nest.js that allow users to buy "Cards" from each other.

## Description
The application follows a very regular Nest.js implementation. Several modules are created for the entities relevant to the requirements (CardModule, OfferModule, UserModule) while others support these functionalities (DataKeeperModule). Other components where used to make the application more robust and less error prone.

### Modules:
- **CardModule**: includes models (for entity and DTOs), service to communicate with the data-structure and a controller to provide API endpoints.
- **DataKeeperModule**: includes only a service that reads and writes to the local file system. This was just a much simpler alternative to using a database, but being abstracted as a independent module allows the application to change to any other type of database very easily. Its used by all other modules
- **OfferModule**: includes models (for entity and DTOs), service to communicate with the data-structure and a controller to provide API endpoints. Makes use of UserModule and CardModule.
- **UserModule**: includes models (for entity and DTOs), service to communicate with the data-structure and a controller to provide API endpoints. Makes use of the CardModule.
- **AppModule**: Main module. Here everything all other modules are included and its use to generate the app on startup.

### Interceptors:
- **LoggerInterceptor**: this is a small interceptor for for the HTTP requests that logs information for the request and its corresponding response.

### Guards:
- **JwtAuthGuard**: this class helps all endpoints that requires it to authenticate the user. This is achieved by allowing users to request a JWT when doing login and sending that JWT back through the Authorization header as a Bearer token.<br>
With the help of "passport" and "passport-jwt" libraries, a "Strategy" can be included in the app that automatically validates and decrypts the JWT received and adds it to the request object.

### Decorators:
- **User**: this decorator helps controllers easily get the user from the request object and insert it directly into the endpoints, instead of having to extract it from the request object.

## Technical Specifications
- [Nest](https://docs.nestjs.com/): Node.js framework
- [Jest](https://jestjs.io/): Test framework for JS/TS
- [Postman](https://www.postman.com/): Software used to communicate to the API. Collection included in 'collection' folder ready to be used, just unzip and import to Postman.
- [JSON Web Token](https://jwt.io/): "Open, industry standard RFC 7519 method" used here for authentication purposes.
- [Passport](http://www.passportjs.org/): Works with JWT to provide authentication.
- [class-validator](https://github.com/typestack/class-validator): Validation of incoming DTOs through HTTP POST request's bodies.
- No database used. Data saved in the folder 'data' at the root of the repository.

## Installation
To install the necessary dependencies for the app, just run the following command:

```bash
$ npm install
```

## Running the app
To start the app just run the following command:
```bash
$ nest start
```

## Test

```bash
# unit tests
$ npm run test
```

## Support
### Nest Support message:
Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Asher Kleiman](https://akleiman.dev) 

