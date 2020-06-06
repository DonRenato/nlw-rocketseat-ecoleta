import express, { response } from 'express';


import PointsController from './controller/PointsController';
import ItemsController from './controller/ItemsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get('/points/:id', pointsController.show);
routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
 export default routes;