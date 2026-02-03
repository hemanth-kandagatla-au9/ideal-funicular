declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    BABEL_ENV: "development" | "production" | "test";
  }
}
