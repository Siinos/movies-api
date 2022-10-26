import compression from 'compression';
import express, { Application } from 'express';
import { controllers } from '@controllers/index';
import { Container } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';
import ErrorHandler from '@middlewares/error-handler.middleware';

export class App {
  private app: Application;
  private readonly port: Number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.APP_PORT);
    this.initializeMiddlewares();
    this.initializeDiContainer();
    this.initializeControllers();
  }

  public start(): void {
    this.app.listen(this.port);
    console.log(`⚡️ [movies-api]: Running at localhost:${this.port}.`);
  }

  private initializeMiddlewares(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(compression());
    this.app.set('etag', false);
  }

  private initializeDiContainer(): void {
    useContainer(Container);
  }

  private initializeControllers(): void {
    useExpressServer(this.app, {
      controllers: controllers,
      middlewares: [ErrorHandler],
      defaultErrorHandler: false,
      validation: false
    });
  }
}
