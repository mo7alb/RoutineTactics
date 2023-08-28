# Routine Tactics - Backend API

## Overview

This is a Node JS and express application which is the backend application of routine tactics that communicates with the mobile UI

## Prerequisites

-  Node (v18 or higher)
-  Docker (for testing database)
-  Firebase project

## Getting Started

1. install packages

1. run the docker compose file

1. create a .env file based on .env.example file

1. In the firebase project navigate project settings > Service account and click on generate new private key (this downloads a json file)

1. move the json file to the backend directory and rename it 'firebaseConfig.json'

1. migrate the database

   ```bash
   yarn mirgateDb
   ```

1. build and run the application

   ```bash
   yarn build
   yarn start
   ```

## Project Structure

-  **prisma** - Contain prisma schema and a seed file

-  **src**

   -  **config** - Consists of all the config files

   -  **controllers** - Consists of route controllers

   -  **middleware** - Consists of any code that runs on every request

   -  **routes** - Consists of all routes

   -  **index.ts** - The entry point to the express application
