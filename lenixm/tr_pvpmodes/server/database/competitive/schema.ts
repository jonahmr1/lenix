export const createDatabaseTable = async () => await exports.oxmysql.query_async(
  `
    CREATE TABLE IF NOT EXISTS tr_pvpmodes_users (
      identity int UNSIGNED NOT NULL AUTO_INCREMENT,
      name varchar(255) NOT NULL,
      avatar varchar(255) NOT NULL,
      friends JSON NOT NULL DEFAULT ('[]'),
      incomingInvitations JSON NOT NULL DEFAULT ('[]'),
      outgoingInvitations JSON NOT NULL DEFAULT ('[]'),
      license varchar(255) NOT NULL,
      PRIMARY KEY (identity)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `
)