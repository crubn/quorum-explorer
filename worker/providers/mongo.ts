const { connect, connection } = require('mongoose');

class MongoDB {
  static start: () => any;
  static stop: () => any;

  public static async connect(dbName: string,
      triggerFunction: any, stopFunction: any): Promise<boolean> {
    console.log('process.env.MONGODB_HOST', process.env.MONGODB_HOST);

    this.start = () => triggerFunction();
    this.stop = () => stopFunction();
    return new Promise((resolve) => {
      connect(
          `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
          {
            user: process.env.MONGODB_USERNAME,
            pass: process.env.MONGODB_PASSWORD,
            dbName: dbName,
          },
      )
          .then(() => {
            console.info(`Connected to MongoDB: ${dbName}`);
            resolve(true);
          })
          .catch((error: any) => {
            console
                .error(`Error connecting to MongoDB: ${JSON.stringify(error)}`);
            resolve(false);
          });

      this.registerEvents();
    });
  }

  private static registerEvents() {
    connection.on('connecting', function() {
      console.info('Connecting to MongoDB');
    });
    connection.on('error', function(error: any) {
      console.error('Error in MongoDb connection');
      console.error(error);
    });
    connection.once('connected', () => {
      console.info('MongoDB connected');
      this.start();
    });
    connection.once('open', function() {
      console.info('MongoDB connection opened');
    });
    connection.on('reconnected', () => {
      console.info('MongoDB reconnected');
      this.start();
    });
    connection.on('disconnected', () => {
      console.error('MongoDB disconnected');
      this.stop();
    });
  }

  public static useDB(dbName: string) {
    console.info(`Changed DB: ${dbName}`);
    return connection.useDb(dbName, { useCache: true });
  }
}

module.exports = { MongoDB };
