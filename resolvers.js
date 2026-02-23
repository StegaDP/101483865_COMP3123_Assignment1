const User = require("./models/User");
const Employee = require("./models/Employee");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

console.log("Resolvers file loaded");

const jwt_secret = process.env.JWT_SECRET || "SUPER_SECRET_KEY";

cloudinary.config({
  url: process.env.CLOUDINARY_URL,
  secure: true,
});

/**
 * express-graphql + buildSchema:
 * rootValue должен содержать функции с именами полей Query/Mutation напрямую:
 * rootValue.signup, rootValue.login, rootValue.getAllEmployees, ...
 *
 * Сигнатура: (args, request) => result
 * args = { input } или { eid } и т.д.
 */
module.exports = {
  // ---------- Queries ----------
  login: async ({ input }) => {
    const { email, password } = input;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    // если у тебя нет comparePassword - будет падать
    const ok = await user.comparePassword(password);
    if (!ok) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      jwt_secret,
      { expiresIn: "24h" },
    );

    const obj = user.toObject();
    obj.id = user._id.toString();
    obj.created_at = obj.created_at.toISOString();
    obj.updated_at = obj.updated_at.toISOString();
    return { message: "Login successful", token, user: obj };
  },

  getAllEmployees: async () => {
    const employees = await Employee.find();
    return employees.map((emp) => {
      const obj = emp.toObject();
      obj.id = emp._id.toString();
      obj.date_of_joining = obj.date_of_joining.toISOString();
      obj.created_at = obj.created_at.toISOString();
      obj.updated_at = obj.updated_at.toISOString();
      return obj;
    });
  },

  getEmployeeById: async ({ eid }) => {
    const employee = await Employee.findById(eid);
    if (!employee) throw new Error("Employee not found");
    const obj = employee.toObject();
    obj.id = employee._id.toString();
    obj.date_of_joining = obj.date_of_joining.toISOString();
    obj.created_at = obj.created_at.toISOString();
    obj.updated_at = obj.updated_at.toISOString();
    return obj;
  },

  searchEmployees: async ({ designation, department }) => {
    const query = {};
    if (designation) query.designation = designation;
    if (department) query.department = department;
    const employees = await Employee.find(query);
    return employees.map((emp) => {
      const obj = emp.toObject();
      obj.id = emp._id.toString();
      obj.date_of_joining = obj.date_of_joining.toISOString();
      obj.created_at = obj.created_at.toISOString();
      obj.updated_at = obj.updated_at.toISOString();
      return obj;
    });
  },

  // ---------- Mutations ----------
  signup: async ({ input }) => {
    console.log("signup resolver called with input:", input);

    const { username, email, password } = input;

    // базовая валидация
    if (!username || !email || !password) {
      throw new Error("Missing required fields");
    }

    // (опционально) уникальность
    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email already in use");

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const obj = user.toObject();
    obj.id = user._id.toString();
    obj.created_at = obj.created_at.toISOString();
    obj.updated_at = obj.updated_at.toISOString();
    return obj;
  },

  addEmployee: async ({ employee }) => {
    if (!employee) throw new Error("Employee input is required");

    const { photo, ...empData } = employee;

    let photoUrl = null;
    if (photo) {
      const { createReadStream } = await photo;
      const stream = createReadStream();
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "employees" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.pipe(uploadStream);
      });
      photoUrl = result.secure_url;
    }

    const empDataFull = {
      ...empData,
      date_of_joining: empData.date_of_joining
        ? new Date(empData.date_of_joining)
        : undefined,
      employee_photo: photoUrl,
    };

    const newEmployee = new Employee(empDataFull);
    await newEmployee.save();
    const obj = newEmployee.toObject();
    obj.id = newEmployee._id.toString();
    obj.date_of_joining = obj.date_of_joining.toISOString();
    obj.created_at = obj.created_at.toISOString();
    obj.updated_at = obj.updated_at.toISOString();
    return obj;
  },

  updateEmployee: async ({ eid, employee }) => {
    if (!eid) throw new Error("Employee id (eid) is required");
    if (!employee) throw new Error("Employee input is required");

    const { photo, ...empData } = employee;

    let photoUrl = null;
    if (photo) {
      const { createReadStream } = await photo;
      const stream = createReadStream();
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "employees" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.pipe(uploadStream);
      });
      photoUrl = result.secure_url;
    }

    const updateData = {};
    if (empData.first_name !== undefined)
      updateData.first_name = empData.first_name;
    if (empData.last_name !== undefined)
      updateData.last_name = empData.last_name;
    if (empData.email !== undefined) updateData.email = empData.email;
    if (empData.gender !== undefined) updateData.gender = empData.gender;
    if (empData.designation !== undefined)
      updateData.designation = empData.designation;
    if (empData.salary !== undefined) updateData.salary = empData.salary;
    if (empData.date_of_joining !== undefined)
      updateData.date_of_joining = new Date(empData.date_of_joining);
    if (empData.department !== undefined)
      updateData.department = empData.department;
    if (photoUrl) updateData.employee_photo = photoUrl;

    const updated = await Employee.findByIdAndUpdate(
      eid,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) throw new Error("Employee not found");
    const obj = updated.toObject();
    obj.id = updated._id.toString();
    obj.date_of_joining = obj.date_of_joining.toISOString();
    obj.created_at = obj.created_at.toISOString();
    obj.updated_at = obj.updated_at.toISOString();
    return obj;
  },

  deleteEmployee: async ({ eid }) => {
    if (!eid) throw new Error("Employee id (eid) is required");

    const deleted = await Employee.findByIdAndDelete(eid);
    if (!deleted) throw new Error("Employee not found");

    return "Employee deleted successfully";
  },
};
