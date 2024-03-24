[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Hzd9L7ho)

![](http://images.restapi.co.za/pvt/Noroff-64.png)
# Noroff
# Back-end Development Year 1
### Databases - Course Assignment 1 <sup>V4</sup>

Startup code for Noroff back-end development 1 - Front-end Technologies course.

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://images.restapi.co.za/pvt/ca_important.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

![](http://images.restapi.co.za/pvt/help.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---

# Application Installation and Usage Instructions
1. Clone the repository to your local machine:
   ```
   git clone <repository_url>
   ```

2. Navigate to the project directory:
   ```
   cd <project_directory>
   ```

3. Install dependencies using npm:
   ```
   npm install
   ```

4. Set up environment variables by creating a `.env` file in the root directory of the project and adding necessary variables (see **Environment Variables** section for details).

5. Start the server:
   ```
   npm start
   ```

6. Access the application through your web browser at `http://localhost:3000`.
   

* Once the server is running, you can navigate to the provided URL in your browser to access the application.
* Follow the application's user interface to interact with its features.


# Environment Variables

- **PORT**: Specifies the port number for the server to listen on.
- **HOST**: Specifies the hostname for the server.
- **DATABASE_NAME**: Name of the MySQL database used by the application.
- **DB_USER**: Username for accessing the MySQL database.
- **DB_PASSWORD**: Password for the specified MySQL database user.
- **SESSION_SECRET**: Secret key used for session management.

Ensure you set appropriate values for these environment variables in the `.env` file.

# Additional Libraries/Packages
- **cookie-parser**: Middleware for parsing cookies.
- **debug**: Utility for debugging.
- **dotenv**: Loads environment variables from a `.env` file.
- **ejs**: Templating engine for generating HTML markup.
- **express**: Web framework for Node.js.
- **express-session**: Middleware for managing sessions in Express.
- **http-errors**: Utility for creating HTTP errors.
- **morgan**: HTTP request logger middleware.
- **mysql2**: MySQL client for Node.js.
- **passport**: Authentication middleware for Node.js.
- **passport-local**: Passport strategy for authenticating with a username and password.
- **sequelize**: Promise-based ORM for Node.js and SQL databases.

Ensure these dependencies are installed by running `npm install`.

# NodeJS Version Used
v20.10.0

# DATABASE
To create the database, execute the following SQL command:
```sql
CREATE DATABASE adoptiondb
```

# DATABASEACCESS
To grant access to the database, execute the following SQL commands:

```sql
CREATE USER 'dabcaowner'@'localhost' IDENTIFIED BY 'dabca1234';
GRANT ALL PRIVILEGES ON adoptiondb.* TO 'dabcaowner'@'localhost' WITH GRANT OPTION;
```




