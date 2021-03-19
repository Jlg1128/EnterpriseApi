const config = {
  development: {
    host: "localhost",
    port: 8089,
  },
  production: {
    host: '175.24.120.38',
    port: 8089,
  },
};

const dbConfig = {
  "connectionLimit": 100,
  "database": "enterprise",
  "host": "localhost",
  "port": "3306",
  "user": "root",
  "password": "woshibenzhu20131",
  "multipleStatements": true,
};

function getConfig(config) {
  const env = process.env.NODE_ENV.toString();
  return config[env];
}

export {
  dbConfig,
};

export default getConfig(config);