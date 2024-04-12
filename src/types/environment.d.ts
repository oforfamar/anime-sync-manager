declare global {
  namespace NodeJS {
    interface ProcessEnv {
      log_level: string;
      showsConfigFile: string;
      sourceFolder: string;
      destinationBasePath: string;
      provider: string;
      resolution: string;
      extension: string;
      delimiter: string;
      uid: string;
      gid: string;
    }
  }
}

export {};
