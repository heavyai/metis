const connection = new MapdCon()
  .protocol("https")
  .host("metis.mapd.com")
  .port("443")
  .dbName("mapd")
  .user("mapd")
  .password("HyperInteractive");

connection.logging(true);

export function query(stmt) {
  return new Promise((resolve, reject) => {
    return connection.query(stmt, null, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

export function connect() {
  return new Promise((resolve, reject) => {
    return connection.connect((error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

window.query = query;
