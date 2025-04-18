
import { Document } from "../models/document.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createDocument = asyncHandler(async(req, res)=>{
        const userId = req.user._id;

        const newDoc = new Document({
            title: req.body.title || 'Untitled Document',
            content: req.body.content || '',
            owner: userId,
            permissions: [],
        })

        const savedDoc = await newDoc.save();

        return res
        .status(200)
        .json(
            new ApiResponse(200, savedDoc, "Document created successfully")
        )
})

const getDocuments = asyncHandler(async(req, res)=>{
    const userId = req.user._id; 
    const documents = await Document.find({
        $or: [
          { owner: userId },
          { 'permissions.userId': userId, 'permissions.permission': { $in: ['read-write', 'read-only'] } } 
        ]
      }).populate('owner', 'fullName username');
     
    return res
    .status(200)
    .json(
        new ApiResponse(200, documents, 'Document found successfully')
    )
})

const getDocumentByID = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const userId = req.user._id;

    const document = await Document.findById(id).populate('owner', 'fullName email avatar').populate('permissions.userId', 'fullName username email');

    if(!document){
        throw new ApiError(404, 'No such document found');
    }

    const isOwner = document.owner._id.equals(userId);

    const isAllowedToAll = document.allowTOAll;

    const hasPermission = document.permissions.some(
        (perm) => perm.userId._id.equals(userId) 
    );

    if(!isOwner && !hasPermission && !isAllowedToAll){
        throw new ApiError(403, 'Access denied');
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(200, document, "Document fetched successfully.")
    )
})

const updateDocument = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const {content} = req.body;
    const userId = req.user._id;

    const document = await Document.findById(id);

    if(!document){
        throw new ApiError(404, "No such document found!");
    }

    const isOwner = document.owner.equals(userId);
    const hasPermission = document.permissions.some(
        (perm) => perm.userId.equals(userId) && perm.permission === 'read-write'
      );

    if(!isOwner && !hasPermission){
        throw new ApiError(403, 'Access Denied');
    }

    document.content = content;

    await document.save();

    return res 
    .status(200)
    .json(
        new ApiResponse(200, document, "Updated Successfully")
    )
})

const shareDocument = asyncHandler(async(req, res)=>{
    const {documentId, userId, permission} = req.body;

    const document = await Document.findById(documentId);

    if(!document){
        throw new ApiError(404, 'Document not found');
    }

    if(!document.owner.equals(req.user._id)){
        return res 
        .status(403)
        .json(
            new ApiResponse(403, {}, 'Access Denied')
        )
    }

    const existingPermission = document.permissions.find(
        (perm) => perm.userId.equals(userId)
    );

    if(existingPermission){
        existingPermission.permission = permission;
    }else{
        document.permissions.push({userId, permission});
    }

    await document.save();

    return res
    .status(200)
    .json(
         new ApiResponse(200, document, "Permisson updated successfully")
    )
})

const deleteDocument = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const userId = req.user._id;

    const document = await Document.findById(id);

    if(!document){
        throw new ApiError(404, 'No Such Document found');
    }

    if(!document.owner.equals(userId)){
        throw new ApiError(403, "Access Denied");
    }

    await Document.deleteOne({ _id: id });

    return res 
    .status(200)
    .json(
        new ApiResponse(200, {}, 'Document deleted successfully')
    )
})

const removeAccess = asyncHandler(async (req, res) => {
    const { userId, docId } = req.params;

    if (!userId) {
        throw new ApiError(404, "Please provide userId");
    }

    if (!docId) {
        throw new ApiError(404, "Please provide docId");
    }

    const document = await Document.findById(docId);

    if (!document) {
        throw new ApiError(404, "Such doc is not present");
    }

    if (document.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to remove access.");
    }

    const userIndex = document.permissions.findIndex(
        (permission) => permission.userId.toString() === userId
    );

    if (userIndex === -1) {
        throw new ApiError(400, "User does not have permissions for this document.");
    }

    // Store the permission being removed
    const removedPermission = document.permissions[userIndex];

    // Remove the permission from the array
    document.permissions.splice(userIndex, 1);

    await document.save();

    return res.status(200).json(
        new ApiResponse(200, { userId, permissionId: removedPermission._id }, "Done!")
    );
});


export {
    createDocument,
    getDocuments,
    getDocumentByID,
    updateDocument,
    shareDocument,
    deleteDocument,
    removeAccess
}