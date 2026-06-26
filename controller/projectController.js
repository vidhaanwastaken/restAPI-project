// const { project } = require('../db/models');

const { where } = require('sequelize');
const db = require('../db/models');

const project = db.project;
const users = db.users;


// const project = require('../db/models/project');
// const users = require('../db/models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createProject = catchAsync(async (req, res, next) => {
    const body = req.body;
    const userId = req.users.id;
    // const userId = req.user.id;
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
    const result = await project.findByPk(projectId, {include: users});
    if(!result) {
        return next(new AppError('invalid project id', 400))
    }
    
    return res.status(200).json({
        status:'sucess',
        data: result
    })
})

const updateProject = catchAsync(async (req, res, next) => {
    const userId = req.users.id;
    const projectId = req.params.id;
    const body = req.body;
    const result = await project.findOne({
        where: { id: projectId, createdBy: userId },
    });

    if(!result) {
        return next(new AppError('invalid project id', 400))
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
        return next(new AppError('invalid project id', 400))
    }
   await project.destroy({
  where: {
    id: projectId,
  },
  force: true,
});
 

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

