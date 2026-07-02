import { HttpServer } from './http-server';

class Application {
  private httpServer: HttpServer;

  constructor() {
    this.httpServer = new HttpServer();
  }

  public run(): void {
    this.httpServer.run();
  }
}

const application = new Application();

application.run();
