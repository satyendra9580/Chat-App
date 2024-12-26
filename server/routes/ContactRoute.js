import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactsForDMList, SearchContact } from "../controllers/ContactsController.js";

const contactRoutes=Router();
contactRoutes.post("/search",verifyToken,SearchContact);
contactRoutes.get("/get-contacts-for-dm",verifyToken,getContactsForDMList);
contactRoutes.get("/get-all-contacts",verifyToken,getAllContacts);

export default contactRoutes;