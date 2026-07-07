// const { project } = require('../db/models');

const { where } = require('sequelize');
const db = require('../db/models');
const redisClient = require('../config/redis');
const project = db.project;
const users = db.users;
const getCache = require('../utils/rediscache').getCache;
const setCache = require('../utils/rediscache').setCache;
const deleteCache = require('../utils/rediscache').deleteCache;
// const projectId = require('../db/models/project').project.id;

// const project = require('../db/models/project');
// const users = require('../db/models/user');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const useRedisCache = require('../utils/rediscache');


const createProject = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.users.id;
    
    const newProject = await project.create({
        title: body.title,
        productImage: body.productImage,
        price: body.price,
        shortDescription: body.shortDescription,
        description: body.description,
        productUrl: body.productUrl,
        category: body.category,
        tags: body.tags,
        createdBy: userId,
    });

const key = await `project:${newProject.id}`
await setCache(key, newProject);


return res.status(201).json({
    status: 'success',
    data: newProject
})
})

const getAllProjects = catchAsync(async (req, res, next) => {

    const userId = req.users.id;
    const result = await project.findAll({
        include: users,
        where: { createdBy: userId },
    });


    return res.status(200).json({
        status:'sucess',
        data: result
    })
})

const getProjectById = catchAsync(async (req, res, next) => {

    const projectId = req.params.id;
    const key = `project:${projectId}`;

    
    const cachedProject = await getCache(key);

    if (cachedProject) {
        console.log("Data fetched from Redis");

        return res.status(200).json({
            status: 'success',
            source: 'got data from redis cache',
            data: cachedProject
        });
    }


    const projectData = await project.findOne({
        where: { id: projectId }
    });

    
    if (!projectData) {
        return next(new appError('Invalid project ID', 404));
    }

    
    await setCache(key, projectData, 5);

    console.log("Data fetched from PostgreSQL and cached");

    
    return res.status(200).json({
        status: 'success',
        source: 'got data from postgres database',
        data: projectData
    });

});

const updateProject = catchAsync(async (req, res, next) => {
    const userId = req.users.id;
    const projectId = req.params.id;
    const body = req.body;
    const result = await project.findOne({
        where: { id: projectId, createdBy: userId },
    });

    if(!result) {
        return next(new appError('invalid project id', 400))
    }
    result.title = body.title
    result.productImage = body.productImage
    result.price = body.price
    result.shortDescription = body.shortDescription
    result.description = body.description
    result.productUrl = body.productUrl
    result.category = body.category
    result.tags = body.tags
    
   
    const updatedResult = await result.save();

    const key = await `project:${updatedResult.id}`
    await setCache(key, updatedResult, 30);

    return res.status(200).json({
        status:'success',
        data: updatedResult
    })
    // await result.update(body);
    // return res.status(200).json({
    //     status:'sucess',
    //     data: result
    // })
})

const deleteProject = catchAsync(async (req, res, next) => {
    const userId = req.users.id;
    const projectId = req.params.id;
    const body = req.body;
    const result = await project.findOne({
        where: { id: projectId, createdBy: userId },
    });

    if(!result) {
        return next(new appError('invalid project id', 400))
    }
   await project.destroy({
  where: {
    id: projectId,
  },
  force: true,
});
 
    const key = await `project:${projectId}`
    await deleteCache(key);


    return res.json({
        status: 'success',
        message: 'Record deleted successfully',
    

    
    })
    // await result.update(body);
    // return res.status(200).json({
    //     status:'sucess',
    //     data: result
    // })
})


module.exports = {createProject, getAllProjects, getProjectById, updateProject,deleteProject}

