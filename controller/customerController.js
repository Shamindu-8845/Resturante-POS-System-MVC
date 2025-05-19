class CustomerController {
    constructor(model) {
        this.model = model;
        this.currentCustomerId = null;
        this.initializeDOM();
        this.bindEvents();
        this.renderCustomers();
    }

    initializeDOM() {
        this.elements = {
            form: {
                id: document.getElementById('customerId'),
                name: document.getElementById('customerName'),
                phone: document.getElementById('customerPhone')
            },
            buttons: {
                add: document.getElementById('addCustomer'),
                update: document.getElementById('updateCustomer'),
                delete: document.getElementById('deleteCustomer'),
                search: document.getElementById('searchCustomer'),
                viewAll: document.getElementById('viewAllCustomers')
            },
            search: {
                input: document.getElementById('customerSearch'),
                type: document.getElementById('searchType')
            },
            tableBody: document.getElementById('customerTableBody')
        };
    }

    bindEvents() {
        this.elements.buttons.add.addEventListener('click', () => this.addCustomer());
        this.elements.buttons.update.addEventListener('click', () => this.updateCustomer());
        this.elements.buttons.delete.addEventListener('click', () => this.deleteCustomer());
        this.elements.buttons.search.addEventListener('click', () => this.searchCustomers());
        this.elements.buttons.viewAll.addEventListener('click', () => this.viewAllCustomers());

        // Table row events
        this.elements.tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                this.editCustomer(e.target.dataset.id);
            }
            if (e.target.classList.contains('delete-row-btn')) {
                this.deleteCustomer(e.target.dataset.id);
            }
        });
    }

    renderCustomers(customers) {
        const customersToRender = customers || this.model.getAllCustomers();
        this.elements.tableBody.innerHTML = customersToRender.map(customer => `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${customer.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-row-btn" data-id="${customer.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    addCustomer() {
        try {
            const newCustomer = this.getFormData();
            this.model.addCustomer(newCustomer);
            this.renderCustomers();
            this.clearForm();
        } catch (error) {
            alert(error.message);
        }
    }

    updateCustomer() {
        if (!this.currentCustomerId) return;

        try {
            const updatedCustomer = this.getFormData();
            this.model.updateCustomer(this.currentCustomerId, updatedCustomer);
            this.renderCustomers();
            this.clearForm();
            this.currentCustomerId = null;
            this.toggleEditButtons(false);
        } catch (error) {
            alert(error.message);
        }
    }

    deleteCustomer(id = this.currentCustomerId) {
        if (!id || !confirm('Are you sure you want to delete this customer?')) return;

        try {
            this.model.deleteCustomer(id);
            this.renderCustomers();
            if (id === this.currentCustomerId) {
                this.clearForm();
                this.currentCustomerId = null;
                this.toggleEditButtons(false);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    editCustomer(id) {
        const customer = this.model.getCustomer(id);
        if (customer) {
            this.fillForm(customer);
            this.currentCustomerId = id;
            this.toggleEditButtons(true);
        }
    }

    searchCustomers() {
        const term = this.elements.search.input.value.trim();
        const type = this.elements.search.type.value;

        if (term) {
            this.renderCustomers(this.model.searchCustomers(term, type));
        } else {
            this.renderCustomers();
        }
    }

    viewAllCustomers() {
        this.elements.search.input.value = '';
        this.renderCustomers();
    }

    clearForm() {
        this.elements.form.id.value = '';
        this.elements.form.name.value = '';
        this.elements.form.phone.value = '';
    }

    fillForm(customer) {
        this.elements.form.id.value = customer.id;
        this.elements.form.name.value = customer.name;
        this.elements.form.phone.value = customer.phone;
    }

    toggleEditButtons(enable) {
        this.elements.buttons.update.disabled = !enable;
        this.elements.buttons.delete.disabled = !enable;
    }

    getFormData() {
        return {
            id: this.elements.form.id.value.trim(),
            name: this.elements.form.name.value.trim(),
            phone: this.elements.form.phone.value.trim()
        };
    }
}