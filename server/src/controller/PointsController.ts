import {Request, Response, query} from 'express'
import knex from '../database/connection';

class PointsController{

    async create(req:Request,res: Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;

        const point = {
            image: 'https://www.supermarketperimeter.com/ext/resources/2019/8/sprouts.jpg?1565013671',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
    
        const trx = await knex.transaction();
    
        const pointID = await trx('points').insert(point)
    
        const point_id = pointID[0];
    
        const pointItems = items.map((item_id: number) =>{
            return {
                item_id,
                point_id
            };
        })
    
        await trx('point_items').insert(pointItems);
        
        await trx.commit();
    
        return res.json({point_id,...point });
    }
    
    async show(req:Request,res: Response){
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return res.status(404).json({ message: 'Point not found'});
        }

        const items = await knex('items').join('point_items','items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id).select('items.title');
        return res.json({ point, items});
    }

    async index(req:Request,res: Response){
        const {city, uf,items} = req.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id',parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

        return res.json(points);
    }
}


export default PointsController;