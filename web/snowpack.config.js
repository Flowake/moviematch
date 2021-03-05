const httpProxy = require("http-proxy");
const proxy = httpProxy.createServer({
  target: {
    host: "192.168.1.175",
    port: 8000,
  },
});

const env = {
  SNOWPACK_PUBLIC_LANG: "en",
  SNOWPACK_PUBLIC_VERSION: "dev",
  SNOWPACK_PUBLIC_BASE_PATH: "",
};

for (const [key, value] of Object.entries(env)) {
  process.env[key] = value;
}

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "app/src": "/dist",
    "static": "/",
    "template": "/",
  },
  routes: [
    {
      src: "/api/ws",
      dest: (req, res, head) => proxy.ws(req, res, head),
    },
    {
      src: "/api/.*",
      dest: (req, res, head) => proxy.web(req, res, head),
    },
  ],
  packageOptions: {
    source: "remote",
    types: true,
  },
  devOptions: {
    open: "none",
  },
  buildOptions: {},
};
