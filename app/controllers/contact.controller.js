// exports.create = (req, res) => {
//     res.send({ message: "create handle"});
// };

// exports.findAll = (req, res) => {
//     res.send({ message: "findAll handle"});
// };

// exports.findOne = (req, res) => {
//     res.send({ message: "findOne handle"});
// };

// exports.update = (req, res) => {
//     res.send({ message: "update handle"});
// };

// exports.delete = (req, res) => {
//     res.send({ message: "delete handle"});
// };

// exports.deleteAll = (req, res) => {
//     res.send({ message: "deleteAll handle"});
// };

// exports.findAllFavorite = (req, res) => {
//     res.send({ message: "findAllFavorite handle"});
// };

const MongoDB = require("../utils/mongodb.util");
const ContactService = require('../services/contact.service');
const ApiError = require('../api-error');

//Create and Save a new Contact
exports.create = async (req, res, next) => {
    if(!req.body?.name){
        return next(new ApiError(400, 'Name can not be empty'));
    }
    console.log(req.body)
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    }catch (error) {
        return next(
            new ApiError(500, 'An error occurred while creating the contact')
        );
    }
};

//Retrieve all contacts of a user from the database
exports.findAll = async (req, res, next) =>{
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        }else {
            documents = await contactService.find({});
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, 'An error occurred while retrieving contacts')
        );
    }

    return res.send(documents);
};

//Find a single contact with  an id
exports.findOne = async (req, res, next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findById(req.params.id);
        if(!documents){
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.send(documents);
    }catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, 'Data to update can not be empty'));
    }

    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.send({message: 'Contact was uploaded successfully'});
    }catch (error){
        console.log(error);
        return next(
            new ApiError(500, `Error updating contact with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.send({ message: 'Contact was deleted successfully'});
    }catch (error){
        console.log(error);
        return next(
            new ApiError(
                500,
                `Could not delete contact with id=${req.params.id}`
            )
        );
    }
};

exports.findAllFavorite = async (req, res, next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents);
    }catch (error){
        console.log(error);
        return next(
            new ApiError(
                500, 'An error occured while retrieving favorite contacts'
            )
        );
    }
};

exports.deleteAll = async (req, res, next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    }catch(error){
        console.log(error);
        return next(
            new ApiError(500, 'An error occourred while removing all contacts')
        );
    }
};

