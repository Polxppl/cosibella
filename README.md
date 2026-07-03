# Simple Node.js Backend application with IdoSell integration

[![Node.js Version](https://img.shields.io/badge/Node.js-24.x-green.svg)](https://nodejs.org/)

App main purpose is to serve crucial data fetched from external IdoSell API. Data is served with Express.js server. There are two endpoints:
1. GET /orders To fetch all the orders stored in database
2. PUT /order/:orderSerialNumber/productsCost To change the order products costs value

## Tech Stack

* **Node.js** - Environment
* **Express.js** - Web server
* **PostgreSQL** - Database
* **AJV** - JSON schema validator

## Prerequisites

If you want to run the application without Docker you need to met the following requirements:
* Node.js v24 or higher
* PostgreSQL running locally

## Installation & Setup (with Docker)
  1. Env variables
  ```bash
    cp .env.example .env
    # Fill the environmental variables
  ```
  2. Run
  ```bash
    docker compose up
  ```
## Installation & Setup (without Docker)
  1. Env variables
  ```bash
    cp .env.example .env
    # Fill the environmental variables
  ```
  2. PostgreSQL
  ```bash
    cp .env.example .env
    # Fill the environmental variables

    # Ensure you have postgreSQL database running locally
    # Create user and database matching the environmental variables
    # Run the migrations placed in the /src/migrations

    npm install
    npm run dev
  ```

  3. Run
  ```bash
    npm install
    npm run dev
  ```


## API Documentation

1. **GET /orders**:
```bash
  curl --request GET \
  --header 'content-type: application/json' \
  --header 'accept: application/json' \
  --url "http://localhost:3000/orders"
```
  **Response**:
  200
  ```js
    Array<{
      productsCost: number,
      serialNumber: number,
      id: string,
      documents: Array<{ id: string, type: string }>
    }>
  ```

2. **PUT /order/:orderSerialNumber/productsCost**:
```bash
  curl --request PUT \
  --header 'content-type: application/json' \
  --header 'accept: application/json' \
  --url "http://localhost:3000/order/1/productsCost" \
  --data '{"productsCost": 1000}'
```
**Response**:
 200
