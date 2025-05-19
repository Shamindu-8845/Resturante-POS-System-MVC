class CustomerDB {
    constructor() {
        this.customers = [
            { id: 'C001', name: 'Shamindu', phone: '0751538845' },
            { id: 'C002', name: 'Sasanka', phone: '0751666385' },
            { id: 'C003', name: 'Rani', phone: '0772604586' },
            { id: 'C004', name: 'Kasun', phone: '0741538845' }
        ];
    }

    getAllCustomers() {
        return [...this.customers];
    }

    getCustomerById(id) {
        return this.customers.find(c => c.id === id);
    }

    addCustomer(customer) {
        if (this.getCustomerById(customer.id)) {
            throw new Error('Customer ID already exists');
        }
        this.customers.push(customer);
        return this.getAllCustomers();
    }

    updateCustomer(id, updatedCustomer) {
        const index = this.customers.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Customer not found');

        // Check if new ID conflicts with existing customers
        if (updatedCustomer.id !== id && this.getCustomerById(updatedCustomer.id)) {
            throw new Error('New ID already exists');
        }

        this.customers[index] = updatedCustomer;
        return this.getAllCustomers();
    }

    deleteCustomer(id) {
        const initialLength = this.customers.length;
        this.customers = this.customers.filter(c => c.id !== id);
        if (this.customers.length === initialLength) {
            throw new Error('Customer not found');
        }
        return this.getAllCustomers();
    }

    searchCustomers(searchTerm, type) {
        const term = searchTerm.toLowerCase();
        return this.customers.filter(customer => {
            if (type === 'phone') return customer.phone.toLowerCase().includes(term);
            if (type === 'id') return customer.id.toLowerCase().includes(term);
            if (type === 'name') return customer.name.toLowerCase().includes(term);
            return false;
        });
    }
}