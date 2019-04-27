require('dotenv').config();

module.exports={
  "development": {
    "username": process.env.DB_USERNAME, // || 'nodejs_dev',
    "password": process.env.DB_PASSWORD, // || 'root',
    "database": process.env.DB_NAME, // || 'nodeauth',
    "host": process.env.DB_HOST, // || '127.0.0.1',
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
