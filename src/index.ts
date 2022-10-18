import 'reflect-metadata';
import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '@commons': `${__dirname}/commons`,
  '@controllers': `${__dirname}/controllers`,
  '@middlewares': `${__dirname}/middlewares`,
  '@services': `${__dirname}/services`
});

import { App } from './app';

const app = new App();
app.start();
