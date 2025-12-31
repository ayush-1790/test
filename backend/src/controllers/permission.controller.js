import Permission from "../models/Permission.js";

export const createPermission = async (req, res) => {
  const { key, description, module } = req.body;

  const permission = await Permission.create({
    key,
    description,
    module,
  });

  res.status(201).json(permission);
};

export const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { key, description, module } = req.body;

  const permission = await Permission.findByIdAndUpdate(
    id,
    { key, description, module },
    { new: true }
  );

  if (!permission) {
    return res.status(404).json({ message: "Permission not found" });
  }

  res.json(permission);
};

export const listPermissions = async (req, res) => {
  const permissions = await Permission.find().sort({ module: 1 });
  res.json(permissions);
};

export const deletePermission = async (req, res) => {
  await Permission.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
