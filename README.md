# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Pip.Services MongoDB components for Node.js

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit.

The MongoDB module simplifies how we work with Mongo databases and contains everything you need to start working with MongoDB.

This module contains the following packages:
- **Build** - contains a factory for creating MongoDB persistence components.
- **Connect** - instruments for configuring connections to the database. The component receives a set of configuration parameters and uses them to generate all necessary database connection parameters.
- **Persistence** - abstract classes for working with the database that can be used for connecting to collections and performing basic CRUD operations.

<a name="links"></a> Quick links:

* [Data Microservice. Step 3](https://www.pipservices.org/tutorials/data-microservice/persistence) 
* [Data Microservice. Step 6](https://www.pipservices.org/tutorials/data-microservice/container) 
* [Data Microservice. Step 7](https://www.pipservices.org/tutorials/data-microservice/run-and-test)
* [API Reference](https://pip-services3-node.github.io/pip-services3-mongodb-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](https://www.pipservices.org/community/help)
* [Contribute](https://www.pipservices.org/community/contribute)


## Use

Install the NPM package as
```bash
npm install pip-services3-mongodb-node --save
```

## Develop

For development you shall install the following prerequisites:
* Node.js 8+
* Visual Studio Code or another IDE of your choice
* Docker
* Typescript

Install dependencies:
```bash
npm install
```

Compile the code:
```bash
tsc
```

Run automated tests:
```bash
npm test
```

Generate API documentation:
```bash
./docgen.ps1
```

Before committing changes run dockerized build and test as:
```bash
./build.ps1
./test.ps1
./clear.ps1
```

## Contacts

The library is created and maintained by **Sergey Seroukhov**.

The documentation is written by **Mark Makarychev**.
