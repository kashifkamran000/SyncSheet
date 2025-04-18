import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createDocument, deleteDocument, getDocumentByID, getDocuments, removeAccess, shareDocument, updateDocument } from "../controllers/document.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route('/createDoc').post(createDocument);

router.route('/getAllDocs').get(getDocuments);

router.route('/openDoc/:id').get(getDocumentByID);

router.route('/shareDoc').post(shareDocument);

router.route('/updateDoc').put(updateDocument);

router.route('/deleteDoc/:id').delete(deleteDocument);

router.route('/removeAccess/:userId/:docId').patch(removeAccess);

export default router;