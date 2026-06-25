const {createProject,getAllProjects,getProjectById,updateProject,deleteProject} = require('../controller/projectController');
const {authentication, restrictTo,} = require('../controller/authController');

const router = require('express').Router();

router.route('/')
.post(authentication,restrictTo('1'),createProject)
.get(authentication,restrictTo('1'),getAllProjects);

router.route('/:id')
.get(authentication,restrictTo('1'),getProjectById)
.patch(authentication,restrictTo('1'),updateProject)
.delete(authentication,restrictTo('1'),deleteProject);


module.exports = router;

