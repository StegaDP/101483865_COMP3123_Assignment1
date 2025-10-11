const {Router} = require("express");
const Employee = require("../models/employee");
const {validateCreateEmployee, validateUpdateEmployee} = require("../validations/employeeValidation");
const employeeRouter = Router();


function dumpEmployee(employee) {
    const {first_name, last_name, email, position, salary, date_of_joining, department, _id} = employee;
    return { employee_id: _id, first_name, last_name, email, position, salary, date_of_joining, department }
}


employeeRouter.get("/employees", async (req, res) => {
    const data = await Employee.find({}).exec();
    let result= [];

    for (const item in data) {
        result.push(dumpEmployee(data[item]));
    }
    res.send(result).status(200);
})
employeeRouter.post("/employees", validateCreateEmployee, async (req, res) => {
    let emp = await Employee.create(req.body);

    res.send({message: "Employee created successfully", employee_id: emp._id}).status(201);
})

employeeRouter.get("/employees/:id", async (req, res) => {
    const employeeId = req.params.id;

    const employee = await Employee.findById(employeeId).exec();

    if (!employee) {
        return res.send("Employee not found").status(404);
    } else {
        return res.send(dumpEmployee(employee)).status(200);
    }
})
employeeRouter.put("/employees/:id", validateUpdateEmployee, async (req, res) => {
    const employeeId = req.params.id;

    await Employee.updateOne({_id: employeeId}, req.body).exec();
    res.send({message: "Employee details updated successfully"}).status(200);
})
employeeRouter.delete("/employees", async (req, res) => {

    const employeeId = req.query.eid;

    if (!employeeId) {
        return res.send("Employee ID is required").status(400);
    }

    await Employee.deleteOne({_id: employeeId}).exec();
    return res.status(204).send();
})


module.exports = employeeRouter;