// Update with your config settings.

module.exports = {
  test: {
    client: "postgresql",
    connection: {
      database: "limbictest",
      user: "vasco",
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  development: {
    client: "postgresql",
    connection: process.env.DB_URL ?? {
      database: "limbic",
      user: "vasco",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: `${__dirname}/src/migrations`,
    },
  },
};
