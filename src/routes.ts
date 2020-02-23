import { Router } from 'express';
import posts from './routes/posts';
import users from './routes/users';

const routes = Router();

routes.get('/posts/:id(\\d+)?', posts);
routes.get('/users', users);

export default routes;
