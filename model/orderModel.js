class OrderModel {
    constructor(db) {
        this.db = db;
    }

    // Customer methods
    getCustomer(id) {
        return this.db.getCustomerById(id);
    }

    // Item methods
    getItem(id) {
        return this.db.getItemById(id);
    }

    // Order methods
    createNewOrder() {
        return {
            id: this.db.generateOrderId(),
            customerId: '',
            customerName: '',
            date: new Date().toISOString().split('T')[0],
            items: [],
            subTotal: 0,
            discount: 0,
            tax: 0,
            total: 0,
            paymentMethod: 'Cash',
            cashReceived: 0,
            change: 0,
            status: 'New',
            paymentStatus: 'Unpaid'
        };
    }

    getAllOrders() {
        return this.db.getAllOrders();
    }

    getOrder(id) {
        return this.db.getOrderById(id);
    }

    saveOrder(order) {
        // Calculate order totals
        this.calculateOrderTotals(order);

        // Set payment status
        this.setPaymentStatus(order);

        // Set order status
        this.setOrderStatus(order);

        return this.db.addOrder(order);
    }

    updateOrder(id, order) {
        // Calculate order totals
        this.calculateOrderTotals(order);

        // Set payment status
        this.setPaymentStatus(order);

        // Set order status
        this.setOrderStatus(order);

        return this.db.updateOrder(id, order);
    }

    deleteOrder(id) {
        return this.db.deleteOrder(id);
    }

    searchOrders(term) {
        return this.db.searchOrders(term);
    }

    // Helper methods
    calculateOrderTotals(order) {
        // Calculate subtotal
        order.subTotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // Calculate tax (10%)
        order.tax = (order.subTotal * 0.1);

        // Calculate total
        const discountAmount = order.subTotal * (order.discount / 100);
        order.total = (order.subTotal - discountAmount) + order.tax;

        // Calculate change
        order.change = order.cashReceived - order.total;
    }

    setPaymentStatus(order) {
        if (order.paymentMethod === 'Cash') {
            if (order.cashReceived >= order.total) {
                order.paymentStatus = 'Paid';
            } else if (order.cashReceived > 0) {
                order.paymentStatus = 'Partially Paid';
            } else {
                order.paymentStatus = 'Unpaid';
            }
        } else {
            order.paymentStatus = 'Paid';
            order.cashReceived = order.total;
            order.change = 0;
        }
    }

    setOrderStatus(order) {
        order.status = order.paymentStatus === 'Paid' ? 'Completed' : 'Pending';
    }

    validateOrder(order) {
        return order.items.length > 0 &&
            order.customerId &&
            order.customerName &&
            !isNaN(order.discount) &&
            !isNaN(order.tax) &&
            !isNaN(order.total);
    }
}