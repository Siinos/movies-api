import 'reflect-metadata';
import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '@errors': `${__dirname}/errors`,
  '@controllers': `${__dirname}/controllers`,
  '@dtos': `${__dirname}/dtos`,
  '@helpers': `${__dirname}/helpers`,
  '@interfaces': `${__dirname}/interfaces`,
  '@mappers': `${__dirname}/mappers`,
  '@middlewares': `${__dirname}/middlewares`,
  '@repositories': `${__dirname}/repositories`,
  '@services': `${__dirname}/services`,
  '@utils': `${__dirname}/utils`,
  '@validators': `${__dirname}/validators`
});

import { App } from './app';

const app = new App();
app.start();
