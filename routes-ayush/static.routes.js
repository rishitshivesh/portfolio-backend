const Router = require("express").Router;
const router = Router();
const DB = require("../utils/Dynamo");
const crypto = require("crypto");
const TableName = process.env.TABLE_NAME;
const validateEndpoint = require("../middlewares/validateEndpoint");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const UserName = "ayush";

router.get("/static", (req, res) => {
  return res.status(400).json({ message: "Missing Parameters!!" });
});

// get all static data by type
router.get("/static/:type", validateEndpoint, async (req, res) => {
  try {
    const { type } = req.params;
    const data = await DB.queryBeginsWith(
      UserName,
      type,
      process.env.TABLE_NAME
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});
// add static data by type
router.post(
  "/static/:type",
  validateEndpoint,
  isAuthenticated,
  async (req, res) => {
    try {
      const { type } = req.params;
      const id = crypto.randomBytes(4).toString("hex");

      const params = {
        pk: UserName,
        sk: `${type}#${id}`,
        id,
        ...req.body,
        created: Date.now(),
      };
      await DB.put(params, process.env.TABLE_NAME);
      return res
        .status(201)
        .json({ message: `${type} Data Added Successfully!` });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

// add batch static data using array
router.post(
  "/static/:type/batchAdd",
  validateEndpoint,
  isAuthenticated,
  async (req, res) => {
    try {
      const { type } = req.params;
      // console.log(req.body);
      const { data } = req.body;
      if (!data) {
        return res.json({ message: "Missing Data Field!!" });
      }
      if (data.length > 25) {
        return res.json({ message: "Maximum 25 items can be added at once!!" });
      }
      const params = data.map((item) => {
        const id = crypto.randomBytes(4).toString("hex");
        return {
          PutRequest: {
            Item: {
              pk: UserName,
              sk: `${type}#${id}`,
              id,
              ...item,
              created: Date.now(),
            },
          },
        };
      });
      await DB.batchWrite(params, process.env.TABLE_NAME);
      return res
        .status(201)
        .json({ message: `${type} Data Added Successfully!` });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

// get static data by type and id
router.get("/static/:type/:id", validateEndpoint, async (req, res) => {
  try {
    const { type, id } = req.params;
    const data = await DB.get(
      UserName,
      `${type}#${id}`,
      process.env.TABLE_NAME
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// update static data by type and id
router.put(
  "/static/:type/:id",
  validateEndpoint,
  isAuthenticated,
  async (req, res) => {
    try {
      const { type, id } = req.params;
      const params = {
        pk: UserName,
        sk: `${type}#${id}`,
        id,
        ...req.body,
        updatedAt: Date.now(),
      };
      await DB.put(params, process.env.TABLE_NAME);
      return res
        .status(202)
        .json({ message: `${type} Data Updated Successfully!` });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

// delete static data by type and id
router.delete(
  "/static/:type/:id",
  validateEndpoint,
  isAuthenticated,
  async (req, res) => {
    try {
      const { type, id } = req.params;
      await DB.delete(UserName, `${type}#${id}`, process.env.TABLE_NAME);
      return res
        .status(204)
        .json({ message: `${type} Data Deleted Successfully!` });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

module.exports = router;
