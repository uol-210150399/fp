# Backend

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation
```bash
$ pnpm install
```

## Running the app

### ENVVARS

See .env.example for a list of ENVVARS. You can set these either by adding a _.env_ file to the root folder of this project, or using `export ENVVAR_NAME=value`.

### Install the dependencies


1. Install [NodeJS 20+ LTS](https://nodejs.org/) (I recommend [installing it](https://github.com/asdf-vm/asdf-nodejs) with [asdf](https://github.com/asdf-vm/asdf) if your on mac or linux)


```Shell
# Make sure you are using the correct version of Node before installing pnpm
nvm use 20.9.0

# Install pnpm (this is necessary as long as this is a mono-repo)
npm install -g pnpm

# Install the app's dependencies
pnpm install

# Initialize your .env by copying .env.example to .env
# Review .env

# Start the app in _watch_ mode
pnpm start
```

### Create the .env file, copy the .env.example file and fill in the necessary values

```bash
$ cp .env.example .env
```

### Set up the database
```bash
$ docker-compose -f docker-compose.dev.yml up
```


### Start the app

```bash
$ pnpm run codegen

$ pnpm run start

$ pnpm run start:dev

$ pnpm run start:prod
```

## GraphQL

The GraphQL playground is available at `http://localhost:3005/graphql`

### Generating GraphQL

To generate the GraphQL schema and types, run the following command

```bash
pnpm run codegen
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov

# shows lint
$ pnpm run check

# removes lint
$ pnpm run delint
```

