class ItemModel {
    constructor(db) {
        this.db = db;
    }

    // Business logic and validation
    getAllItems() {
        return this.db.getAllItems();
    }

    getItem(id) {
        return this.db.getItemById(id);
    }

    addItem(itemData) {
        if (!this.validateItem(itemData)) {
            throw new Error('Invalid item data');
        }
        return this.db.createItem(itemData);
    }

    updateItem(id, itemData) {
        if (!this.validateItem(itemData)) {
            throw new Error('Invalid item data');
        }
        return this.db.updateItem(id, itemData);
    }

    deleteItem(id) {
        return this.db.deleteItem(id);
    }

    searchItems(term) {
        return this.db.searchItems(term);
    }

    validateItem(item) {
        return item.id &&
            item.name &&
            !isNaN(item.qty) && item.qty >= 0 &&
            !isNaN(item.price) && item.price >= 0 &&
            item.expireDate;
    }
}