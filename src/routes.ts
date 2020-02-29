import { Router } from 'express';
import getPosts from './routes/posts/get';
import addPost from './routes/posts/add';
import addUser from './routes/users/add';
import authUser from './routes/users/auth';

const routes = Router();

routes.get('/posts/:id(\\d+)?', getPosts);
routes.post('/posts', addPost);

routes.post('/users/auth', authUser);
routes.post('/users', addUser);

export default routes;
