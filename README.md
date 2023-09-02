# mocha-automation-api

### Prerequisites:

- Install Node.js and npm

### How to Getting Started:

```sh
$ npm install
```

### This is directory structure

        .
        ├── data
        │  ├── fixtures
        │  ├── schema
        ├── page
        ├── reports
        │  └── mochawesome
        ├── test
        ├── .env
        └── package.json

### Foldering and Naming Convention

1. Filename using `snake_case` *except for the repo name*
2. Variable name using `camelCase`
3. Add your Cucumber file (`.feature`) into `cypress/integration/feature` folder
4. Add your Steps file (`.js`) in to `cypress/integration/common` folder
5. The steps file (`.js`) should be same as feature file (`.feature`)
6. Declare and hook your `.env` variables to Cypress Config Env (`support/index.js`)
7. Add your test data file in to `cypress/fixtures` folder
8. If you set `true` to video on `cypress.json`, your result video will be added in to `cypress/videos`
3. Your result screenshots will be added in to `cypress/screenshots`

## Run the test

You can specify the command that you want to run from package.json file.

###### Here are our default commands:

```sh
$ npm run cypress
```

###### Here are our other commands:

```sh
$ npm run cypress -- -e TAGS=''                     | to run all tests
$ npm run cypress -- -e TAGS='@tagNameScenario'     | to run test with specific tag / specific repo
$ npm run cypress -- -e TAGS='not @skip'            | to exclude @skip tag
$ npm run cypress -- -e TAGS='' --browser chrome    | to run all tests with launch browser
```