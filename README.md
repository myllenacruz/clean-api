 This are an Rest API who implements solutions and methodologies, including: Design Patterns, TDD (Unity and Integration Tests), Clean Architecture, and SOLID. It provides a solid foundation for building scalable and maintainable applications.
 
 Its currently available features are: 
- ✅ SignUp 
- ✅ Login
_______
> ### Design Patterns:
  ##### Factory - Aims to provide an interface for creating objects of various classes without specifying the concrete class.
  ##### Adapter - Useful in situations where a compatible class needs to be used by other parts of the code, but its interface is not interfaced with those other parts.
  ##### Composite - Lets you treat individual objects and object compositions uniformly.
  ##### Decorator - Allows new functionalities to be dynamically added to an existing object, without modifying the structure of the original object.
  ##### Dependency Injection - Allows objects to rely on abstractions rather than on concrete implementations. 
_______
> ### Methodologies, Principles and Designs:
  ##### TDD - It ensures that the code meets the requirements defined by the tests and helps to identify problems in the code early, making it easier to fix them.
  ##### Clean Architecture - It aims to create a system that is easy to maintain, extensible and with high cohesion.
  ##### Single Responsibility Principle - A class or module should have a single responsibility. 
  ##### Open Closed Principle - New functionalities must be added without the need to change the existing code, but extending it through new methods.
  ##### Liskov Substitution Principle - Aims to promote code reuse by allowing classes to be easily extended and modified without affecting overall system functionality.
  ##### Interface Segregation Principle - It aims to ensure that the interfaces of a class are cohesive and lean, preventing a class from having too many responsibilities and being forced to implement unnecessary methods.
  ##### Dependency Inversion Principle - Allow modules to rely on abstractions instead of relying on concrete implementations.
  ##### Separation of Concerns (SoC) - Divides a system into smaller, independent parts, each responsible for dealing with a specific concern.
  ##### Don't Repeat Yourself (DRY) - For reduce code duplication.
_______
> ### Frameworks, librarys and packages used:
  ##### Yarn
  ##### Jest
  ##### MongoDB
  ##### Express
_______
### Tests
1. Run: 

```
yarn test
```
_______
### Development
1. Install project dependencies: 

```
yarn install
```

2. Start the server:
```
yarn dev
```
_______
### Documentation
1 - Create a user calling <strong>/api/signup</strong>: 
```
{
    "username": "user",
    "email": "user@email.com",
    "password": "userPassword",
    "passwordConfirmation": "userPassword"
}
```

2 - Do login in <strong>/api/login</strong>:
```
{
    "username": "user",
    "password": "userPassword"
}
```
