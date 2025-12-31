import Role from "../models/Role.js";

export const createRole = async (req, res) => {
  const { name, description, permissions } = req.body;

  const role = await Role.create({ name, description, permissions });
  res.status(201).json(role);
};

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, description, isActive, permissions } = req.body;

  const role = await Role.findByIdAndUpdate(
    id,
    { name, description, isActive, permissions },
    { new: true }
  );

  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  res.json(role);
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;
  await Role.findByIdAndDelete(id);
  res.json({ message: "Role deleted successfully" });
};

export const listRoles = async (req, res) => {
  const roles = await Role.find().populate("permissions");
  res.json(roles);
};
