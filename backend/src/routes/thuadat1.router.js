const express = require("express");

const router = express.Router();

const ThuaDat1Model = require("../models/thuadat1.model");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await ThuaDat1Model.getAll();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET BY ID
router.get("/:id", async (req, res) => {
  try {
    const data = await ThuaDat1Model.getById(req.params.id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const data = await ThuaDat1Model.create(req.body);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const data = await ThuaDat1Model.update(req.params.id, req.body);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await ThuaDat1Model.delete(req.params.id);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
