const config = {
  development: {
    host: "localhost",
    port: 8199,
  },
  production: {
    host: '175.24.120.38',
    port: 8199,
  },
};

const dbConfig = (function () {
  const env = process.env.NODE_ENV.toString();
  console.log('😀env', env);
  if (env === 'development') {
    return {
      "connectionLimit": 100,
      "database": "enterprise",
      "host": "localhost",
      "port": "3306",
      "user": "root",
      "password": "woshibenzhu20131",
      "multipleStatements": true,
    };
  }
  return {
    "connectionLimit": 100,
    "database": "enterprise",
    "host": "localhost",
    "port": "3306",
    "user": "root",
    "password": "Woshibenzhu20131",
    "multipleStatements": true,
  };
}());

function getConfig(config) {
  const env = process.env.NODE_ENV.toString();
  return config[env];
}

export {
  dbConfig,
};

export default getConfig(config);