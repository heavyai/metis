import proxy from "./client-proxy";
import processQueryResults from "./utils/process-query-results";

const CLIENT_KEY = Symbol("CLIENT_KEY");
const CONFIG_KEY = Symbol("CONFIG_KEY");
const SESSION_KEY = Symbol("SESSION_KEY");
const NONCE_KEY = Symbol("NONCE_KEY");

export default class Thrifty {
  constructor(config) {
    const url = `${config.protocol}://${config.host}:${config.port}`;
    const transport = new Thrift.Transport(url);
    const protocol = new Thrift.Protocol(transport);
    const client = new MapDClient(protocol);
    this[CONFIG_KEY] = config;
    this[CLIENT_KEY] = new Proxy(client, proxy);
    this[NONCE_KEY] = 0;
  }

  get curNonce() {
    return (this[NONCE_KEY]++).toString();
  }

  get config() {
    return this[CONFIG_KEY];
  }

  get client() {
    return this[CLIENT_KEY];
  }

  get session() {
    return this[SESSION_KEY];
  }

  query = (
    stmt,
    options = {
      limit: -1,
      columnar: true,
      logging: this.logging
    }
  ) => {
    return new Promise((resolve, reject) => {
      this.client.sql_execute(
        this.session,
        stmt,
        options.columnar,
        this.curNonce,
        options.limit,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(processQueryResults(result));
          }
        }
      );
    });
  };

  connect = () => {
    return new Promise((resolve, reject) => {
      const { user, password, dbName } = this.config;
      this.client.connect(user, password, dbName, (error, result) => {
        if (error) {
          reject(error);
        } else {
          this[SESSION_KEY] = result;
          resolve(this);
        }
      });
    });
  };
}
