const express = require("express");
const { createList, getLists, updateList, deleteList } = require("../controllers/list.controller");
const route = express.Router();



route.post("/", createList);
route.get("/", getLists);
// router.get("/:listId", getList);
route.put("/:listId", updateList);
route.delete("/:listId", deleteList);




module.exports = route;