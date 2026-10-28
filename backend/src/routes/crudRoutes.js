import { authorize } from '../middleware/auth.js';

// Adds the standard REST routes for a resource:
//   GET    /        list (supports ?filters)
//   GET    /:id     get one
//   POST   /        create
//   PUT    /:id     update (send only the fields to change)
//   PATCH  /:id     same as PUT
//   DELETE /:id     delete
export function addCrudRoutes(router, controller, { readRoles, writeRoles, deleteRoles = writeRoles }) {
  router.get('/', authorize(...readRoles), controller.list);
  router.get('/:id', authorize(...readRoles), controller.getById);
  router.post('/', authorize(...writeRoles), controller.create);
  router.put('/:id', authorize(...writeRoles), controller.update);
  router.patch('/:id', authorize(...writeRoles), controller.update);
  router.delete('/:id', authorize(...deleteRoles), controller.remove);
}
