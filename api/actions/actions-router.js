const action_router = require('express').Router();
// Write your "actions" router here!
const {get, insert, update, remove} = require('../actions/actions-model')

action_router.get('/', (req, res, next) => {
    get()
    .then((actions) => {
        res.json(actions);
    })
    .catch(next);
})

action_router.get('/:id', (req, res, next) => {
    get(req.params.id)
    .then((action) => {
        if(action){
            res.json(action);
        } else {
            res.status(404).json({
                message: 'Action not found',
            });
        }
    })
    .catch(next);
})

action_router.post('/', (req, res, next) => {
    const action = req.body;
    if(action.project_id && action.description && action.notes){
        insert(action)
        .then((newAction) => {
            res.status(201).json(newAction);
        })
        .catch(next);
    } else {
        res.status(400).json({
            message: 'Please provide project_id, description and notes for the action',
        });
    }
});

action_router.put('/:id', (req, res, next) => {
    const changes = req.body;
    if(changes.project_id && changes.description && changes.notes){
        update(req.params.id, changes)
        .then((updateAction) => {
            if(updateAction){
                res.json(updateAction);
            } else {
                res.status(404).json({
                    message: 'Action not found',
                });
            }
        })
        .catch(next);
    } else {
        res.status(400).json({
            message: 'Please provide project_id, description and notes for action',
        });
    }
});

action_router.delete('/:id', (req, res, next) => {
    remove(req.params.id)
    .then((count) => {
        if (count > 0){
            res.json({
                message: 'The action has deleted',
            })
        } else {
            res.status(400).json({
                message: 'Action not found',
            });
        }
    })
    .catch(next);
})

module.exports = action_router;