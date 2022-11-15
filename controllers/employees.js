const data = {
    employees: require('../model/employees.json'),
    setEmployeese: function(data){
        this.employees = data              //what is the significance of this here? Maybe because this method will be used in different function so this might be required
        
    }
}

// const getEmployees = (req,res)=>{
//     res.json(data.employees)
// }
// const updateEmployee = (req,res)=>{
//     res.json(
//         {
//             "firstName": req.body.firstName,
//             "lastName": req.body.lastName
//         }
//     )
// }

// const createEmployee = (req,res)=>{
//     res.json(
//         {
//             "firtName": req.body.firstName,
//             "secondName": req.body.lastName
//         }
//     )
// }

// const deleteEmployee = (req,res)=>{
//     res.json({
//         "id": req.body.id
//     })
// }
// const getEmployee = (req, res) => {
//     res.json({ 
//         "id": req.params.id 
//     });                    //here params is used instead of body
// }

//updated methods

const getEmployees = (req,res)=>{
    
    res.json(data.employees)
}

const createEmployee= (req,res)=>{
    const newEmployee = {
        id: data.employees?.length? data.employees[data.employees.length-1].id + 1: 1,
        firstName: req.body.firstname,
        lastName: req.body.lastname
    }
    if(!newEmployee.firstName || !newEmployee.lastName){
       return res.status(400).json({'message': 'first name and last name are required!'})
    }
    data.setEmployeese([...data.employees, newEmployee])  //square brackets are required here because data.employees is an array(of objects) and you are passing one argument to the setEmployees method.
    res.status(201).json(data.employees)
}

const updateEmployee = (req, res)=>{
    const employee = data.employees.find(emp=> emp.id === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({'message': `Employee ID ${req.body.id} not found!`})
        
    }
    if (req.body.firstName) employee.firstname = req.body.firstName
    if (req.body.lastName)  employee.lastname = req.body.lasttName
    const filteredArray = data.employees.filter(emp=> emp.id !== parseInt(req.body.id)) //filtered array is required here because I have to separate the rest of records from the the one being updated, so to not repeat in unordered array.
    const unorderedArray = [filteredArray, employee]
    data.setEmployeese( unorderedArray.sort((a,b)=> a.id>b.id? 1 : a.id<b.id? -1 : 0))  //here also a new array is being assigned like below(delEmp)
    res.json(data.employees)  //it is important to mutate the original data array because the user expects it to be mutated after updating it
    
}   

const deleteEmployee = (req,res)=>{
    const employee = data.employees.find(emp=> emp.id === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({'message': 'Cannot delete the record which does not exist!'})
    }
    const filteredArray = data.employees.filter(emp=> emp.id !== parseInt(req.body.id))
    data.setEmployeese([...filteredArray]) //this array is a new array which contains every element of filtered array
    res.json(data.employees)
}

const getEmployee = (req,res)=>{
    const employee = data.employees.find(emp=>emp.id === parseInt(req.body.id))
    if(!employee){
        return res.status(400).json({'message': 'There is no such empployee!'})
    }
    res.json(employee)
}

module.exports = {
    getEmployees, updateEmployee, createEmployee, deleteEmployee, getEmployee
}

