import Router = require('koa-router');
import userController from '../controllers/userController';
import roelsController from '../controllers/roelsController';
import departmentController from '../controllers/departmentController';
import wageController from '../controllers/wageController';

const router: Router = require('koa-router')();

router.post('/api/user/login', userController.login);
router.post('/api/user/register', userController.register);
router.post('/api/user/quit', userController.quit);
router.get('/api/user/userInfoIfRepeat', userController.userInfoIfRepeat);
router.post('/api/user/modifyUser', userController.modifyUser);
router.post('/api/user/modifyAvatar', userController.modifyAvatar);
router.post('/api/user/resetPassword', userController.resetPassword);
router.get('/api/user/getUserById', userController.getUserById);
router.post('/api/user/deleteUserByUid', userController.deleteUserByUid);
router.get('/api/user/isUserAlreatExit', userController.isUserAlreatExit);
router.get('/api/user/isUserExit', userController.isUserExit);

router.post('/api/role/insertRole', roelsController.insertRole);
router.post('/api/role/modifyRoles', roelsController.modifyRoles);
router.get('/api/role/getSingleRoleById', roelsController.getSingleRoleById);
router.get('/api/role/getRolesByIds', roelsController.getRolesByIds);
router.post('/api/role/deleteRoleByRoleId', roelsController.deleteRoleByRoleId);
router.get('/api/role/isRoleNameRepeat', roelsController.isRoleNameRepeat);

router.post('/api/department/addDepartment', departmentController.addDepartment);
router.post('/api/department/deleteDepartmentById', departmentController.deleteDepartmentById);
router.get('/api/department/getDepartmentById', departmentController.getDepartmentById);
router.get('/api/department/getAllDepartment', departmentController.getAllDepartment);
router.post('/api/department/modifyDepartmentName', departmentController.modifyDepartmentName);
router.post('/api/department/modifyDepartmentLeader', departmentController.modifyDepartmentLeader);
router.get('/api/department/isDepartmentNameRepeat', departmentController.isDepartmentNameRepeat);

router.post('/api/wage/sendWage', wageController.sendWage);
router.get('/api/wage/getWageById', wageController.getWageById);
router.get('/api/wage/getWagesByMonth', wageController.getWagesByMonth);
router.post('/api/wage/modifyWage', wageController.modifyWage);
router.post('/api/wage/deleteWageById', wageController.deleteWageByWageId);

module.exports = router.routes();
