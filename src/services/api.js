
const API_URL = "https://employee-management-system-prld.onrender.com";



// Get logged-in owner's ID
const getOwnerId = () => {
    const ownerId = localStorage.getItem("ownerId");

    if (!ownerId) {
        throw new Error("Owner not logged in");
    }

    return ownerId;
};


// Get employees of logged-in owner
export const getEmployees = async () => {

    const ownerId = getOwnerId();

    const response = await fetch(
        `${API_URL}/employees?ownerId=${ownerId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch employees");
    }

    return response.json();
};


// Get all employees of logged-in owner
export const getAllEmployees = async () => {

    const ownerId = getOwnerId();

    const response = await fetch(
        `${API_URL}/employees?ownerId=${ownerId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch employees");
    }

    return response.json();
};


// Get employee by ID
export const getEmployee = async (id) => {

    const response = await fetch(
        `${API_URL}/employees/${id}`
    );

    if (!response.ok) {
        throw new Error("Employee not found");
    }

    return response.json();
};


// Add employee under logged-in owner
export const addEmployee = async (employee) => {

    const ownerId = getOwnerId();

    const response = await fetch(
        `${API_URL}/employees?ownerId=${ownerId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        }
    );

    if (!response.ok) {
        let message = "Failed to add employee";

        try {
            const errorData = await response.json();

            message =
                errorData?.message ||
                errorData?.error ||
                message;

        } catch {
            // Keep default message
        }

        throw new Error(message);
    }

    return response.json();
};


// Update employee
export const updateEmployee = async (employee) => {

    const response = await fetch(
        `${API_URL}/employees`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update employee");
    }

    return response.json();
};


// Delete employee
export const deleteEmployee = async (id) => {

    const response = await fetch(
        `${API_URL}/employees/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete employee");
    }

    return response.text();
};


// =====================================================
// ATTENDANCE APIs
// =====================================================

// Get all attendance
export const getAllAttendance = async () => {

    const response = await fetch(
        `${API_URL}/attendance`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch attendance");
    }

    return response.json();
};


// Add attendance
export const addAttendance = async (attendance) => {

    const response = await fetch(
        `${API_URL}/attendance`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(attendance)
        }
    );

    if (!response.ok) {

        let message = "Failed to add attendance";

        try {

            const errorData = await response.json();

            message =
                errorData?.message ||
                errorData?.error ||
                message;

        } catch {
            // Keep default message
        }

        throw new Error(message);
    }

    return response.json();
};


// Update attendance
export const updateAttendance = async (attendance) => {

    const response = await fetch(
        `${API_URL}/attendance`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(attendance)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update attendance");
    }

    return response.json();
};


// Delete attendance
export const deleteAttendance = async (id) => {

    const response = await fetch(
        `${API_URL}/attendance/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete attendance");
    }

    return response.text();
};


// Today's attendance
export const getTodayAttendance = async () => {

    const response = await fetch(
        `${API_URL}/attendance/today`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch today's attendance");
    }

    return response.json();
};


// Employee attendance history
export const getEmployeeAttendance = async (employeeid) => {

    const response = await fetch(
        `${API_URL}/attendance/employee/${employeeid}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch employee attendance");
    }

    return response.json();
};


// =====================================================
// SALARY
// =====================================================

export const getSalary = async (
    employeeid,
    year,
    month,
    paidLeave
) => {

    const response = await fetch(
        `${API_URL}/salary/${employeeid}/${year}/${month}?paidLeave=${paidLeave}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch salary");
    }

    return response.json();
};


// =====================================================
// MONTHLY ATTENDANCE
// =====================================================

export const getMonthlyAttendance = async (
    employeeid,
    year,
    month
) => {

    const response = await fetch(
        `${API_URL}/attendance/employee/${employeeid}/month/${year}/${month}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch monthly attendance");
    }

    return response.json();
};
