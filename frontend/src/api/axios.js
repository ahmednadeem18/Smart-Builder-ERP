import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  verify: () => api.get("/auth/verify"),
  changePassword: (data) => api.put("/auth/change-password", data),
};

export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard-overview"),
  getProjects: () => api.get("/admin/projects"),
  getUsersByRole: (role) => api.get(`/admin/users`, { params: { role } }),
  createProject: (data) => api.post("/admin/projects", data),
  updateProjectStatus: (id, status) => api.patch(`/admin/projects/${id}/status`, { status }),
  getProjectBudget: (id) => api.get(`/admin/projects/${id}/budget`),
  getProjectReport: (id) => api.get(`/admin/projects/${id}/report`),
};
export const clientAPI = {
  createWithAccount: (data) => api.post("/admin/clients/create", data),
  getAll: () => api.get("/admin/clients"),
  getOne: (id) => api.get(`/admin/clients/${id}`),
  getProjects: (id) => api.get(`/admin/clients/${id}/projects`),
  getPayments: (id) => api.get(`/admin/clients/${id}/payments`),
  getInvoices: (id) => api.get(`/admin/clients/${id}/invoices`),
  create: (data) => api.post("/admin/clients", data),
};

export const financeAPI = {
  getExpenses:        ()    => api.get("/admin/finance/expenses"),
  getRevenues:        ()    => api.get("/admin/finance/revenues"),
  getPendingPayments: ()    => api.get("/admin/finance/payments/pending"),
  getPendingInvoices: ()    => api.get("/admin/finance/invoices/pending"),
  approvePayment:     (id)  => api.post(`/admin/finance/payment/approve/${id}`),
  approveInvoice:     (id)  => api.post(`/admin/finance/invoice/approve/${id}`),
};

export const hrAPI = {
  getResources:       ()     => api.get("/hr/resources"),
  getPendingRequests: ()     => api.get("/hr/requests/pending"),
  createRequest:      (data) => api.post("/hr/request", data),
  approveRequest:     (data) => api.post("/hr/approve", data),
  freeLabour:         (data) => api.post("/hr/free", data),
  getAllAllocations:     ()     => api.get("/hr/allocations"),
};

export const materialAPI = {
  getStock:           ()       => api.get("/material/stock"),
  getShipments:       ()       => api.get("/material/shipments"),
  getSuppliers:       ()       => api.get("/material/suppliers"),
  getPendingRequests: ()       => api.get("/material/requests/pending"),
  getBatches:         (params) => api.get("/material/inventory-batches", { params }),
  createRequest:      (data)   => api.post("/material/request", data),
  createShipment:     (data)   => api.post("/material/shipment/manual", data),
  approveBatch:       (data)   => api.post("/material/approve-batch", data),
};

export const equipmentAPI = {
  getPendingRequests: () => api.get("/equipment/pending"),
  getActiveAllocations: () => api.get("/equipment/active"),
  approveRequest: (data) => api.post("/equipment/approve", data),
  releaseEquipment: (data) => api.post("/equipment/release", data),
};
export const pmAPI = {
  getMyProjects:  ()           => api.get("/pm/projects"),
  getProjectLogs: (projectId)  => api.get(`/pm/project/logs/${projectId}`),
  addLog:         (data)       => api.post("/pm/log", data),
  submitRequest:  (type, data) => api.post(`/pm/request/${type}`, data),
};

export const subcontractorAPI = {
  createRequest:      (data)       => api.post("/subcontractor/request", data),
  getPendingRequests: ()           => api.get("/subcontractor/requests/pending"),
  getByCategory:      (categoryId) => api.get(`/subcontractor/list/${categoryId}`),
  approve:            (data)       => api.post("/subcontractor/approve", data),
};