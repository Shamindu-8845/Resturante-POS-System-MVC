class OrderDB {
    constructor() {
        this.customers = [
            { id: 'C001', name: 'Shamindu' },
            { id: 'C002', name: 'Kasun' },
            { id: 'C003', name: 'Rani' }
        ];

        this.items = [
            { id: 'I001', name: 'Cake', price: 1200.00 },
            { id: 'I002', name: 'Rolls', price: 25.00 },
            { id: 'I003', name: 'Coffee', price: 45.00 },
            { id: 'I004', name: 'Roti', price: 250.00 }
        ];

        this.orders = [
            {
                id: 'ORD-1001',
                customerId: 'C001',
                customerName: 'Shamindu',
                date: '2024-04-15',
                items: [
                    { id: 'I001', name: 'Cake', price: 1200.00, qty: 1 },
                    { id: 'I002', name: 'Rolls', price: 25.00, qty: 2 }
                ],
                subTotal: 1250.00,
                discount: 0,
                tax: 125.00,
                total: 1375.00,
                paymentMethod: 'Cash',
                cashReceived: 1500.00,
                change: 125.00,
                status: 'Completed',
                paymentStatus: 'Paid'
            },
            {
                id: 'ORD-1002',
                customerId: 'C002',
                customerName: 'Kasun',
                date: '2024-04-16',
                items: [
                    { id: 'I003', name: 'Coffee', price: 45.00, qty: 3 },
                    { id: 'I004', name: 'Roti', price: 250.00, qty: 1 }
                ],
                subTotal: 385.00,
                discount: 10,
                tax: 38.50,
                total: 423.50,
                paymentMethod: 'Card',
                cashReceived: 0.00,
                change: 0.00,
                status: 'Pending',
                paymentStatus: 'Unpaid'
            }
        ];
    }

    // Customer operations
    getAllCustomers() {
        return [...this.customers];
    }

    getCustomerById(id) {
        return this.customers.find(c => c.id === id);
    }

    // Item operations
    getAllItems() {
        return [...this.items];
    }

    getItemById(id) {
        return this.items.find(i => i.id === id);
    }

    // Order operations
    getAllOrders() {
        return [...this.orders];
    }

    getOrderById(id) {
        return this.orders.find(o => o.id === id);
    }

    addOrder(order) {
        this.orders.unshift(order);
        return this.getAllOrders();
    }

    updateOrder(id, updatedOrder) {
        const index = this.orders.findIndex(o => o.id === id);
        if (index !== -1) {
            this.orders[index] = updatedOrder;
        }
        return this.getAllOrders();
    }

    deleteOrder(id) {
        const initialLength = this.orders.length;
        this.orders = this.orders.filter(o => o.id !== id);
        return initialLength !== this.orders.length;
    }

    searchOrders(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.orders.filter(order =>
            order.id.toLowerCase().includes(term) ||
            order.customerName.toLowerCase().includes(term) ||
            order.status.toLowerCase().includes(term) ||
            order.paymentStatus.toLowerCase().includes(term)
        );
    }

    generateOrderId() {
        return 'ORD-' + (1000 + this.orders.length + 1);
    }
}