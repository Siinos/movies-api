import compression from 'compression';
import express, { Application } from 'express';
import { controllers } from '@controllers/index';
import { attachControllers } from '@decorators/express';

export class App {
  private app: Application;
  private readonly port: Number;

  constructor() {
    this.port = Number(process.env.APP_PORT);
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(compression());
    this.app.set('etag', false);
    attachControllers(this.app, controllers);
  }

  public start(): void {
    this.app.listen(this.port);
    console.log(`⚡️ [movies-api]: Running at localhost:${this.port}.`);
  }
}
