README.md for MongoDB backup code:

## MongoDB Backup

This Node.js module provides functionality for creating backups of MongoDB databases. It can be run manually or automatically using a cron job. The backup is created using the `mongodump` command and is saved as a compressed archive in a specified directory.

### Installation

To use this module in your Node.js project, first install it using npm:

```bash
npm install mongodb-backup
```

Then, require it in your code:

```javascript
const { autoBackupMongoDB, backupMongoDB } = require("mongodb-backup");
```

### Usage

#### Manual Backup

To create a manual backup, call the `backupMongoDB` function with the required options:

```javascript
backupMongoDB({
  uri: "mongodb://localhost:27017/",
  dbName: "myDatabase",
  backupPath: "/path/to/my/backup",
});
```

This will create a backup of the `myDatabase` database and save it to the `/path/to/my/backup` directory.

#### Automatic Backup

To create automatic backups using a cron job, call the `autoBackupMongoDB` function with the required options:

```javascript
autoBackupMongoDB({
  uri: "mongodb://localhost:27017/",
  cronExpression: "0 0 * * *", // run every day at midnight
  dbName: "myDatabase",
  backupPath: "/path/to/my/backup",
});
```

This will create a cron job that runs every day at midnight and creates a backup of the `myDatabase` database, saving it to the `/path/to/my/backup` directory.

#### Options

The following options can be passed to both `backupMongoDB` and `autoBackupMongoDB` functions:

- `uri` (optional): The MongoDB connection URI. Defaults to `mongodb://localhost:27017/`.
- `dbName` (required): The name of the database to backup.
- `backupPath` (required): The directory where the backup will be saved.
- `cronExpression` (optional): The cron expression to use for automatic backups. If not provided, the backup will be created manually.

### License

This code is licensed under the MIT License.