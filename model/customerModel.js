class CustomerModel {
    constructor(db) {
        this.db = db;
    }

    getAllCustomers() {
        return this.db.getAllCustomers();
    }

    getCustomer(id) {
        return this.db.getCustomerById(id);
    }

    addCustomer(customerData) {
        if (!this.validateCustomer(customerData)) {
            throw new Error('Invalid customer data');
        }
        return this.db.addCustomer(customerData);
    }

    updateCustomer(id, customerData) {
        if (!this.validateCustomer(customerData)) {
            throw new Error('Invalid customer data');
        }
        return this.db.updateCustomer(id, customerData);
    }

    deleteCustomer(id) {
        return this.db.deleteCustomer(id);
    }

    searchCustomers(term, type) {
        return this.db.searchCustomers(term, type);
    }

    validateCustomer(customer) {
        return customer.id &&
            customer.name &&
            customer.phone &&
            /^\d{10}$/.test(customer.phone); // Basic phone validation
    }
}