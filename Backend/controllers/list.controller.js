const List = require("../models/list.model");


const createList = async (req, res) => {
    try {

        const { name, description } = req.body;

        if (!name) return res.status(400).json({ message: "name must be required" })

        const list = await List.create({
            name,
            description,
        });

        res.status(201).json(list);

    } catch (error) {
        console.log("error:", error.message);
        res.status(500).json({ message: error.message })
    }

}

const getLists = async (req, res) => {
    try {
        const lists = await List.find();

        res.status(200).json({
            message: "list fetched successfully",
            lists
        });
    } catch (error) {
        console.log("error in getlist controller:", error.message)
        res.status(500).json({ message: error.message })
    }
};

const updateList = async (req, res) => {
    try {

        const { listId } = req.params;
        const { name, description } = req.body;


        const list = await List.findByIdAndUpdate(
            listId,
            { name, description },
            { new: true }
        );

        res.status(201).json({
            message: "list updated successfully",
            list
        });
    } catch (error) {
        console.log("error in update list controller", error.message);
        res.status(500).json({ message: error.message })
    }
};

const deleteList = async (req, res) => {
    try {
        await List.findByIdAndDelete(req.params.listId);

        res.status(200).json({
            message: "List deleted",
        });
    } catch (error) {
        console.log("error in delete list controller:", error.message);
        res.status(500).json({ message: error.message })
    }
};





module.exports = { getLists, createList, updateList, deleteList }

