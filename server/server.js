import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import IntlWrapper from '../client/modules/Intl/IntlWrapper';
import initialAppState from '../client/modules/App/util/app.state.initial.js';
import { AppProvider } from "@shopify/polaris";

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// Initialize the Express App
const app = new Express();

// Set Development modes checks
const isDevMode = process.env.NODE_ENV === 'development' || false;
const isProdMode = process.env.NODE_ENV === 'production' || false;

// Run Webpack dev server in development mode
if (isDevMode) {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
import { configureStore } from '../client/store';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';

// Import required modules
import routes from '../client/routes';
import { fetchComponentData } from './util/fetchData';
import { api, auth } from './routes';
import dummyData from './dummyData';
import serverConfig from './config';

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { makeShopify } = require('./util/makeShopify');
import Shop from './models/shop';
const { createNewAccountAndRedirect } = require('./util/createNewAccountAndRedirect')(Shop);

const sessionStore = new MongoDBStore(
  {
    uri: serverConfig.mongoURL,
    collection: 'sessions',
  });

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }

  // feed some dummy data in DB.
  dummyData();
});

// Catch errors
sessionStore.on('error', error => {
  console.log(error); // eslint-disable-line no-console
});

app.use(session({
  secret: 'm4venly!',
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
  store: sessionStore,
  resave: true,
  saveUninitialized: true,
}));

// Apply body Parser and server public assets and routes
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(Express.static(path.resolve(__dirname, '../dist/client')));
app.set('views', path.join(__dirname, '../', 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use('/auth', auth);
app.use('/api', api);

// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}

        ${isProdMode ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
        <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'/>
        <link rel="shortcut icon" href="http://res.cloudinary.com/hashnode/image/upload/v1455629445/static_imgs/mern/mern-favicon-circle-fill.png" type="image/png" />
        <link rel="stylesheet" href="https://unpkg.com/react-select@1.2.1/dist/react-select.css">
        <link rel="stylesheet" href="https://sdks.shopifycdn.com/polaris/2.0.0/polaris.min.css" />
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${isProdMode ?
          `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${isProdMode ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${isProdMode ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `;
};

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = isProdMode ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

// Logged in middleware for main app
app.use((req, res, next) => {
  console.log('CHECK LOGIN');
  console.log(req.query);
  if (req.query.shop) {
    createNewAccountAndRedirect(req.query.shop.split('.')[0], res, shop => {
      const Shopify = makeShopify(shop);
      if (Shopify.is_valid_signature(req.query) || process.env.NODE_ENV !== 'production') {
        next();
      } else {
        res.redirect('/auth/invalidSource');
      }
    });
  } else {
    res.redirect('/auth/login');
  }
});

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    // Set initial app state to inject logged-in user
    const store = configureStore({
      app: {
        ...initialAppState,
        user: { ...req.session.user },
      },
    });

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <AppProvider>
            <Provider store={store}>
              <IntlWrapper>
                <RouterContext {...renderProps} />
              </IntlWrapper>
            </Provider>
          </AppProvider>
        );
        const finalState = store.getState();

        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderFullPage(initialView, finalState));
      })
      .catch((error) => next(error));
  });
});

// start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`MERN is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
  }
});

export default app;
