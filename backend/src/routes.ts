import Router from 'express';
import AttendanceListController from './controllers/AttendanceListController';
import KeyController from './controllers/KeyController';

const routes = Router();

routes.get("/attendance_list", AttendanceListController.index);
routes.get("/attendance_list/:id", AttendanceListController.show);
routes.post("/attendance_list", AttendanceListController.create);
routes.put("/attendance_list/:id", AttendanceListController.update);
routes.patch("/attendance_list/:id", AttendanceListController.closed);
routes.delete("/attendance_list/:id", AttendanceListController.remove);
routes.post("/key", KeyController.add);
routes.delete("/key", KeyController.remove);
routes.patch("/key", KeyController.present);

// criar
// alteração de atributos de attendance_list

export default routes;