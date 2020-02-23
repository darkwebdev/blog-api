import express from 'express';
import routes from './routes';

const port = 1234;
const app = express();

app.use('/', routes);

app.listen(port, err => {
  if (err) console.log(err);
  else console.log(`Application listening on port ${port}...`);
});
