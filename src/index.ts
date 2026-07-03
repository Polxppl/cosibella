import pgPromise, { IDatabase } from 'pg-promise';
import { HttpServer } from './http-server';
import { IdoSellTask } from './ido-sell-task';
import { PostgresDocumentRepository } from './repositories/document/respository';
import { TaskRunner } from './task-runner';
import { PostgresOrderRepository } from './repositories/order/repository';
import { OrderService } from './services/order';
import { OrderController } from './controllers/order';
import { PostgresDetailedOrderRepository } from './repositories/detailed-order/repository';

process.loadEnvFile();

class Application {
  private taskRunner: TaskRunner;
  private httpServer: HttpServer;
  private db: IDatabase<unknown> | null = null;

  constructor() {
    const pgp = pgPromise({ query: (e) => console.log(e.query)} );
    this.db = pgp(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/cosi`);

    const documentRepository = new PostgresDocumentRepository(this.db);
    const orderRepository = new PostgresOrderRepository(this.db);
    const detailedOrderRepository = new PostgresDetailedOrderRepository(this.db);

    const orderService = new OrderService(orderRepository);

    const orderController = new OrderController(detailedOrderRepository, orderService);

    const idoSellTask = new IdoSellTask(orderRepository, documentRepository);

    this.httpServer = new HttpServer(orderController);
    this.taskRunner = new TaskRunner(idoSellTask);
  }

  public run(): void {
    this.taskRunner.run();
    this.httpServer.run();
  }

  public destroy(): void {
    this.taskRunner.destroy();
    this.httpServer.destroy();
  }
}

const application = new Application();

application.run();

