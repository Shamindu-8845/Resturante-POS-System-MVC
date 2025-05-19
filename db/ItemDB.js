// Database layer - handles all data storage and retrieval
class ItemDB {
    constructor() {
        this.items = [
            { id: 'I001', name: 'Cake', qty: 100, price: 120.00, expireDate: '2025-04-10' },
            { id: 'I002', name: 'Rolls', qty: 20, price: 200.00, expireDate: '2025-04-12' },
            { id: 'I003', name: 'Coffee', qty: 150, price: 500.00, expireDate: '2025-04-20' },
            { id: 'I004', name: 'Roti', qty: 50, price: 150.00, expireDate: '2025-04-15' }
        ];
    }

    // CRUD Operations
    getAllItems() {
        return [...this.items]; // Return a copy to prevent direct modification
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }

    createItem(item) {
        if (this.getItemById(item.id)) {
            throw new Error('Item ID already exists');
        }
        this.items.push(item);
        return this.getAllItems();
    }

    updateItem(id, updatedItem) {
        const index = this.items.findIndex(item => item.id === id);
        if (index === -1) throw new Error('Item not found');

        // Check if new ID conflicts with existing items (except itself)
        if (updatedItem.id !== id && this.getItemById(updatedItem.id)) {
            throw new Error('New ID already exists');
        }

        this.items[index] = updatedItem;
        return this.getAllItems();
    }

    deleteItem(id) {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== id);
        if (this.items.length === initialLength) {
            throw new Error('Item not found');
        }
        return this.getAllItems();
    }

    searchItems(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.items.filter(item =>
            item.id.toLowerCase().includes(term) ||
            item.name.toLowerCase().includes(term)
        );
    }
}