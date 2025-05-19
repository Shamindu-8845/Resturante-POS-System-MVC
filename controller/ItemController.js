class ItemController {
    constructor(model) {
        this.model = model;
        this.currentItemId = null;
        this.initializeDOM();
        this.bindEvents();
        this.renderItems();
    }

    initializeDOM() {
        this.elements = {
            form: {
                id: document.getElementById('item_IdInput'),
                name: document.getElementById('item_NameInput'),
                qty: document.getElementById('item_QtyInput'),
                price: document.getElementById('item_PriceInput'),
                expireDate: document.getElementById('itemExpireDateInput')
            },
            buttons: {
                add: document.getElementById('add_ItemBtn'),
                update: document.getElementById('updateItemBtn'),
                delete: document.getElementById('deleteItemBtn'),
                reset: document.getElementById('resetFormBtn'),
                search: document.getElementById('search_ItemBtn'),
                viewAll: document.getElementById('viewAllItemsBtn')
            },
            search: document.getElementById('itemSearchInput'),
            tableBody: document.getElementById('itemTableBody')
        };
    }

    bindEvents() {
        this.elements.buttons.add.addEventListener('click', () => this.addItem());
        this.elements.buttons.update.addEventListener('click', () => this.updateItem());
        this.elements.buttons.delete.addEventListener('click', () => this.deleteItem());
        this.elements.buttons.reset.addEventListener('click', () => this.resetForm());
        this.elements.buttons.search.addEventListener('click', () => this.searchItems());
        this.elements.buttons.viewAll.addEventListener('click', () => this.viewAllItems());

        // Table row events (delegation)
        this.elements.tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('item_EditBtn')) {
                this.editItem(e.target.dataset.id);
            }
            if (e.target.classList.contains('item_DeleteRowBtn')) {
                this.deleteItem(e.target.dataset.id);
            }
        });
    }

    renderItems(items) {
        const itemsToRender = items || this.model.getAllItems();
        this.elements.tableBody.innerHTML = itemsToRender.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.expireDate}</td>
                <td>
                    <button class="btn btn-sm btn-warning item_EditBtn" data-id="${item.id}">Edit</button>
                    <button class="btn btn-sm btn-danger item_DeleteRowBtn" data-id="${item.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    addItem() {
        try {
            const newItem = this.getFormData();
            this.model.addItem(newItem);
            this.renderItems();
            this.resetForm();
        } catch (error) {
            alert(error.message);
        }
    }

    updateItem() {
        if (!this.currentItemId) return;

        try {
            const updatedItem = this.getFormData();
            this.model.updateItem(this.currentItemId, updatedItem);
            this.renderItems();
            this.resetForm();
        } catch (error) {
            alert(error.message);
        }
    }

    deleteItem(id = this.currentItemId) {
        if (!id || !confirm('Are you sure you want to delete this item?')) return;

        try {
            this.model.deleteItem(id);
            this.renderItems();
            if (id === this.currentItemId) this.resetForm();
        } catch (error) {
            alert(error.message);
        }
    }

    editItem(id) {
        const item = this.model.getItem(id);
        if (item) {
            this.fillForm(item);
            this.currentItemId = id;
            this.toggleEditButtons(true);
        }
    }

    searchItems() {
        const term = this.elements.search.value.trim();
        if (term) {
            this.renderItems(this.model.searchItems(term));
        } else {
            this.renderItems();
        }
    }

    viewAllItems() {
        this.elements.search.value = '';
        this.renderItems();
    }

    resetForm() {
        this.elements.form.id.value = '';
        this.elements.form.name.value = '';
        this.elements.form.qty.value = '';
        this.elements.form.price.value = '';
        this.elements.form.expireDate.value = '';
        this.currentItemId = null;
        this.toggleEditButtons(false);
    }

    // Helper methods
    getFormData() {
        return {
            id: this.elements.form.id.value.trim(),
            name: this.elements.form.name.value.trim(),
            qty: parseInt(this.elements.form.qty.value),
            price: parseFloat(this.elements.form.price.value),
            expireDate: this.elements.form.expireDate.value
        };
    }

    fillForm(item) {
        this.elements.form.id.value = item.id;
        this.elements.form.name.value = item.name;
        this.elements.form.qty.value = item.qty;
        this.elements.form.price.value = item.price;
        this.elements.form.expireDate.value = item.expireDate;
    }

    toggleEditButtons(enable) {
        this.elements.buttons.update.disabled = !enable;
        this.elements.buttons.delete.disabled = !enable;
    }
}