// Write your "projects" router here!
const express = require('express')
const {
    get, 
    insert, 
    update, 
    remove, 
    getProjectActions
} 
= require('../projects/projects-model')
const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
        const projects = await get();
    //    res.status(200).json(projects.length ? projects : []);
        res.json(projects)
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const project = await get(req.params.id);
        if(!project){
            return res.status(404).json({
                message: 'Project not found',
            })
    }
    res.json(project);
} catch (err) {
    next(err)
}
});

router.post('/', async (req, res, next) => {
    try {
        const {name, description, completed} = req.body;
        if(!name || !description){
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }
        const newProject = await insert({
            name, 
            description, 
            completed: completed === undefined ? false : completed,
        });
        res.status(201).json(newProject);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const {name, description, completed} = req.body;
        if (!name || !description || completed === undefined) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        const updatedProject = await update(req.params.id, {name, description, completed});
        if(!updatedProject){
            return res.status(404).json({
                message: 'Project not found',
            })
        }
        res.json(updatedProject);
    } catch(err){
        next(err)
    }
});

router.delete('/:id', async (req, res, next) => {
    try{
        const deletedProject = await remove(req.params.id);
        if(!deletedProject){
            return res.status(404).json({
                message: 'Project not found',
            })
        }
        res.status(204).end();
    } catch(err){
        next(err);
    }
});

router.get('/:id/actions', async (req, res, next) => {
    try {
        const project = await get(req.params.id);
        if(!project){
            return res.status(404).json({
                message: 'Project not found',
            })
        }
        const actions = await getProjectActions(req.params.id);
        res.json(actions);
    } catch (err){
        next(err);
    }
});

module.exports = router;