import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { icons } from "../components/Icons";
import { useEffect, useState } from "react";
import {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
} from "../services/api";

function Employees({ sidebarOpen, onMenuToggle }) {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        employeName: "",
        department: "",
        salary: ""
    });

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (error) {
            console.error(error);
            alert("Could not load employees");
        }
    };

    const filteredEmployees = employees.filter((employee) =>
        employee.employeName.toLowerCase().includes(search.toLowerCase())
    );

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEmployee) {
                const employee = {
                    employeeid: editingEmployee.employeeid,
                    employeName: formData.employeName,
                    department: formData.department,
                    salary: Number(formData.salary)
                };
                await updateEmployee(employee);
                alert("Employee updated successfully");
            } else {
                const employee = {
                    employeName: formData.employeName,
                    department: formData.department,
                    salary: Number(formData.salary)
                };
                await addEmployee(employee);
                alert("Employee added successfully");
            }
            await loadEmployees();
            setFormData({ employeName: "", department: "", salary: "" });
            setEditingEmployee(null);
            setShowForm(false);
        } catch (error) {
            console.error(error);
            alert("Operation failed");
        }
    };

    const handleAdd = () => {
        setEditingEmployee(null);
        setFormData({ employeName: "", department: "", salary: "" });
        setShowForm(true);
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            employeName: employee.employeName,
            department: employee.department,
            salary: employee.salary
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this employee?")) return;
        try {
            await deleteEmployee(id);
            alert("Employee deleted successfully");
            await loadEmployees();
        } catch (error) {
            console.error(error);
            alert("Could not delete employee");
        }
    };

    const handleView = (employee) => {
        alert(
            `Employee ID: ${employee.employeeid}\n` +
            `Name: ${employee.employeName}\n` +
            `Department: ${employee.department}\n` +
            `Salary: ₹${employee.salary}`
        );
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingEmployee(null);
        setFormData({ employeName: "", department: "", salary: "" });
    };

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} />

            <div className="main-section">
                <Navbar onMenuToggle={onMenuToggle} />

                <main className="dashboard">
                    <div className="page-header">
                        <div>
                            <h1>Employees</h1>
                            <p className="subtitle">Manage employee information</p>
                        </div>
                        <button className="add-button" onClick={handleAdd}>
                            {icons.plus} Add Employee
                        </button>
                    </div>

                    <div className="employee-section">
                        <div className="employee-toolbar">
                            <input
                                type="text"
                                placeholder="Search employee..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Salary</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.length > 0 ? (
                                        filteredEmployees.map((employee) => (
                                            <tr key={employee.employeeid}>
                                                <td>#{employee.employeeid}</td>
                                                <td>
                                                    <strong>{employee.employeName}</strong>
                                                </td>
                                                <td>{employee.department}</td>
                                                <td>₹{Number(employee.salary).toLocaleString()}</td>
                                                <td>
                                                    <button className="view-button" onClick={() => handleView(employee)}>
                                                        {icons.eye} View
                                                    </button>
                                                    <button className="action-button" onClick={() => handleEdit(employee)}>
                                                        {icons.edit} Edit
                                                    </button>
                                                    <button className="delete-button" onClick={() => handleDelete(employee.employeeid)}>
                                                        {icons.trash} Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="empty-state">
                                                No employees found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {showForm && (
                        <div className="form-overlay">
                            <div className="employee-form">
                                <h2>
                                    {editingEmployee ? "Update Employee" : "Add Employee"}
                                </h2>

                                <form onSubmit={handleSubmit}>
                                    {editingEmployee && (
                                        <div className="input-group">
                                            <label>Employee ID</label>
                                            <input
                                                type="text"
                                                value={editingEmployee.employeeid}
                                                disabled
                                            />
                                        </div>
                                    )}

                                    <div className="input-group">
                                        <label>Employee Name</label>
                                        <input
                                            type="text"
                                            name="employeName"
                                            placeholder="Employee Name"
                                            value={formData.employeName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            placeholder="Department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Salary</label>
                                        <input
                                            type="number"
                                            name="salary"
                                            placeholder="Salary"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-buttons">
                                        <button type="submit" className="add-button">
                                            {editingEmployee ? "Update Employee" : "Add Employee"}
                                        </button>
                                        <button type="button" className="cancel-button" onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Employees;