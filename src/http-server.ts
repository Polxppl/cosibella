import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { type Server } from 'node:http';
import { OrderController } from './controllers/order';
import { OrderRouter } from './routers/order';
import { ERRORS } from './errors';

export class HttpServer {
  private port = process.env.PORT || 3000;
  private app: Express;
  private server: Server | null = null;

  constructor(private orderController: OrderController) {
    this.app = express();
    this.app.use(express.json());

    const orderRouter = new OrderRouter(this.orderController);

    orderRouter.setup(this.app);

    this.app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      if (!(err instanceof Error)) {
        res.status(500).send(ERRORS.INTERNAL_ERROR);
        return;
      }
      switch (err.message) {
        case ERRORS.INVALID_REQUEST: {
          res.status(400).send(ERRORS.INVALID_REQUEST);
          return;
        }
        case ERRORS.NOT_FOUND: {
          res.status(404).send(ERRORS.NOT_FOUND);
          return;
        }
        default: {
          res.status(500).send(ERRORS.INTERNAL_ERROR);
          return;
        }
      }
    })
  }

  private closeServer(): void {
    if (this.server) {
      this.server.close();
    }
  }

  public async run(): Promise<void> {
    this.closeServer();

    this.server = this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`)
    })
  }

  public destroy(): void {
    this.closeServer();
  }
}
