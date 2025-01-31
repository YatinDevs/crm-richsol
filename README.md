## Setting up a Node.js environment :

1.  Install Node.js and npm

    - Download and Install Node.js:

              Visit Node.js official website and download the latest LTS version.

      - https://nodejs.org/en

             The installation includes npm (Node Package Manager).

    - Verify Installation:

                node -v
                npm -v

    - Manually Add Node.js to PATH (if needed) :

          Locate the Node.js installation directory. By default, it’s something like:

                C:\Program Files\nodejs

    - Add this directory to the PATH:

      - Press Win + R, type sysdm.cpl, and press Enter.
      - Go to the Advanced tab and click Environment Variables.
      - Under System variables, find Path and click Edit.
      - Add the path to the Node.js installation directory
        (e.g., C:\Program Files\nodejs).
      - Click OK to save.

    - Restart your terminal and try running node -v and npm -v again.

    1.  Bypass Execution Policy

        To fix this issue temporarily, you can bypass the execution policy for the current PowerShell session by running:

                Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

        After running this command, try executing npm -v again:

                 npm -v

    2.  Set Execution Policy for the Current User (Recommended)

        If you want a more permanent solution for your user account, change the execution policy to RemoteSigned, which allows locally created scripts to run while requiring remote scripts to be signed:

                Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

        Explanation:

        RemoteSigned: Allows running locally created scripts but requires remote scripts to be signed.

        CurrentUser: Applies the change only to the current user's account.

                    npm -v again to verify.

2.  Install PostgreSQL 16 and PGAdmin4

    - Download and Install PostgreSQL:

          Visit PostgreSQL official website and install the latest version.

      - https://www.postgresql.org/download/
      - https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

    - Setup PostgreSQL:

            During installation, set up a password for the postgres user.
            Use pgAdmin or CLI to manage your database.

3.  Setting Up github repository :

        echo "# website-template-app" >> README.md
        git init
        git add README.md
        git commit -m "first commit"
        git branch -M main
        git remote add origin https://github.com/YatinDevs/website-template-app.git
        git push -u origin main

## Folder Structure

        App/
        ├── config/
        │ └── db.js
        ├── controller/
        │ ├── authController.js
        │ └── adminController.js
        ├── middleware/
        │ ├── authMiddleware.js
        │ └── adminMiddleware.js
        ├── models/
        │ ├── User.js
        │ └── Admin.js
        ├── routes/
        │ ├── authRoutes.js
        │ └── adminRoutes.js
        ├── index.js

## Setup Backend (Server) :

- Tech Stack : Nodejs + Expressjs + Postgres + Docker

> Setup Node App with PostgresSQL ORM

1.  Create Node Project :

    - Install Dependencies :

            npm init or npm init -y
            npm install
            npm i express cors morgan body-parser
            npm i nodemon
            npm i dotenv
            npm run dev or npm start

    - Folder Structuring :

            Add .gitignore
            Add App folder
            - config
            - controller
            - middleware
            - models
            - routes
            - index.js

    - create server script and run it

2.  Setup Database to Node server :

            npm i pg
            npm i sequelize

    - created config folder -> db.config.js -> configuration with env

            # Postgres - Docker Configuration env
            POSTGRESDB_USER=postgres
            POSTGRESDB_ROOT_PASSWORD=12345
            POSTGRESDB_DATABASE=lite-server_db
            POSTGRESDB_LOCAL_PORT=5433
            POSTGRESDB_DOCKER_PORT=5432

            # Hosted db / Local db - Configuration env
            DB_HOST=localhost
            DB_USER=postgres
            DB_PASSWORD=root
            DB_NAME=webtempapp-db
            DB_PORT=5433

    - created utils folder -> db.js -> configured db with sequelize

    - index.js -> dotenv config for env

    - sequelize -> authentication -> synchronization with models -> port connection

## Authentication

- Install Dependencies :

               npm install express sequelize pg pg-hstore bcryptjs jsonwebtoken cookie-parser cors dotenv nodemon

      <!--

      {
        "username" : "yatin",
        "email" : "c.yatin727@gmail.com",
        "password" : "9594515799"
      }
      {
          "message": "User created and logged in successfully",
          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzgxMjcxNDksImV4cCI6MTczODEyODA0OX0.l2V7d0cQmKDDpjO2PIMTrq6cynpA6pmE-h7lh_lMBOo",
          "userDetails": {
              "role": "user",
              "id": 1,
              "username": "yatin",
              "email": "c.yatin727@gmail.com",
              "password": "$2a$10$tFV.j3VMsRpn/shk4KMww.VUwYpeAKXIeDNisoMkRR4rnBSFtACce",
              "updatedAt": "2025-01-29T05:05:49.611Z",
              "createdAt": "2025-01-29T05:05:49.611Z"
          }
       }

      -->

# Admin Credentials

                {
                "username" : "Yatin Chaudhari",
                "email" : "c.yatin727@gmail.com",
                "password" : "9594515799"

                }

<!--
 tanstack query
 tankstack table
-->
