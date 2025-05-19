class OrderController {
    constructor(model) {
        this.model = model;
        this.currentOrder = this.model.createNewOrder();
        this.initializeDOM();
        this.bindEvents();
        this.initializeUI();
    }

    initializeDOM() {
        this.elements = {
            // Form inputs
            orderId: document.getElementById('orderIdInput'),
            customerId: document.getElementById('customerIdInput'),
            customerName: document.getElementById('customerNameInput'),
            itemId: document.getElementById('itemIdInput'),
            itemName: document.getElementById('itemNameInput'),
            itemPrice: document.getElementById('itemPriceInput'),
            itemQty: document.getElementById('itemQtyInput'),
            orderDate: document.getElementById('orderDateInput'),
            discount: document.getElementById('discountInput'),
            paymentMethod: document.getElementById('paymentMethodSelect'),
            cashReceived: document.getElementById('cashReceivedInput'),

            // Containers
            orderItemsContainer: document.getElementById('orderItemsContainer'),
            cashReceivedContainer: document.getElementById('cashReceivedContainer'),

            // Summary elements
            subTotal: document.getElementById('subTotalAmount'),
            tax: document.getElementById('taxAmount'),
            total: document.getElementById('totalAmount'),
            change: document.getElementById('changeAmount'),

            // Buttons
            addItem: document.getElementById('addItemBtn'),
            clearForm: document.getElementById('clearFormBtn'),
            searchCustomer: document.getElementById('searchCustomerBtn'),
            searchItem: document.getElementById('searchItemBtn'),
            saveOrder: document.getElementById('saveOrderBtn'),
            completeOrder: document.getElementById('completeOrderBtn'),
            searchOrder: document.getElementById('searchOrderBtn'),
            viewAllOrders: document.getElementById('viewAllOrdersBtn'),
            printReceipt: document.getElementById('printReceiptBtn'),
            exit: document.getElementById('exitBtn'),

            // Search
            searchOrderInput: document.getElementById('searchOrderInput'),

            // Tables
            orderHistoryTable: document.getElementById('orderHistoryTable'),

            // Status
            orderStatusBadge: document.getElementById('orderStatusBadge'),

            // Modals
            paymentSuccessModal: new bootstrap.Modal(document.getElementById('paymentSuccessModal')),
            orderDetailsModal: new bootstrap.Modal(document.getElementById('orderDetailsModal')),

            // Modal elements
            completedOrderId: document.getElementById('completedOrderId'),
            completedOrderAmount: document.getElementById('completedOrderAmount'),
            completedOrderChange: document.getElementById('completedOrderChange')
        };
    }

    bindEvents() {
        // Button events
        this.elements.addItem.addEventListener('click', () => this.addItemToOrder());
        this.elements.clearForm.addEventListener('click', () => this.clearForm());
        this.elements.searchCustomer.addEventListener('click', () => this.searchCustomer());
        this.elements.searchItem.addEventListener('click', () => this.searchItem());
        this.elements.saveOrder.addEventListener('click', () => this.saveOrder());
        this.elements.completeOrder.addEventListener('click', () => this.completeOrder());
        this.elements.searchOrder.addEventListener('click', () => this.searchOrders());
        this.elements.viewAllOrders.addEventListener('click', () => this.viewAllOrders());
        this.elements.printReceipt.addEventListener('click', () => this.printReceipt());
        this.elements.exit.addEventListener('click', () => this.exitOrderManagement());

        // Input events
        this.elements.customerId.addEventListener('change', () => this.updateCustomer());
        this.elements.itemId.addEventListener('change', () => this.updateItem());
        this.elements.discount.addEventListener('input', () => this.updateOrderSummary());
        this.elements.paymentMethod.addEventListener('change', () => this.updatePaymentMethod());
        this.elements.cashReceived.addEventListener('input', () => this.updateOrderSummary());
    }

    initializeUI() {
        this.elements.orderId.value = this.currentOrder.id;
        this.elements.orderDate.value = this.currentOrder.date;
        this.renderOrderHistory();
        this.updateOrderSummary();
        this.updatePaymentMethod();
    }

    // Order operations
    addItemToOrder() {
        const itemId = this.elements.itemId.value;
        const itemName = this.elements.itemName.value;
        const price = parseFloat(this.elements.itemPrice.value);
        const qty = parseInt(this.elements.itemQty.value);

        if (!itemId || !itemName || isNaN(price) || isNaN(qty)) {
            alert('Please select a valid item and quantity');
            return;
        }

        // Check if item already exists in order
        const existingItemIndex = this.currentOrder.items.findIndex(item => item.id === itemId);
        if (existingItemIndex >= 0) {
            // Update quantity if item already exists
            this.currentOrder.items[existingItemIndex].qty += qty;
        } else {
            // Add new item
            this.currentOrder.items.push({
                id: itemId,
                name: itemName,
                price: price,
                qty: qty
            });
        }

        // Update order status
        this.currentOrder.status = 'In Progress';
        this.updateStatusBadge();

        this.renderOrderItems();
        this.updateOrderSummary();
        this.clearItemForm();
    }

    saveOrder() {
        if (this.currentOrder.items.length === 0) {
            alert('Please add items to the order');
            return;
        }

        // Update current order from form
        this.updateCurrentOrderFromForm();

        // Save order
        this.model.saveOrder(this.currentOrder);

        // Show success message
        alert(`Order ${this.currentOrder.id} saved successfully with status: ${this.currentOrder.status}`);

        // Reset for new order
        this.resetForNewOrder();
    }

    completeOrder() {
        if (this.currentOrder.items.length === 0) {
            alert('Please add items to the order');
            return;
        }

        if (this.currentOrder.paymentMethod === 'Cash' && this.currentOrder.cashReceived < this.currentOrder.total) {
            alert('Cash received is less than total amount');
            return;
        }

        // Update current order from form
        this.updateCurrentOrderFromForm();

        // Complete order
        this.model.saveOrder(this.currentOrder);

        // Show success modal
        this.elements.completedOrderId.textContent = this.currentOrder.id;
        this.elements.completedOrderAmount.textContent = 'Rs. ' + this.currentOrder.total.toFixed(2);
        this.elements.completedOrderChange.textContent = 'Rs. ' + this.currentOrder.change.toFixed(2);
        this.elements.paymentSuccessModal.show();

        // Reset for new order
        this.resetForNewOrder();
    }

    editOrder(orderId) {
        const order = this.model.getOrder(orderId);
        if (!order) return;

        // Set current order to the selected order
        this.currentOrder = JSON.parse(JSON.stringify(order));

        // Update UI with order details
        this.elements.orderId.value = this.currentOrder.id;
        this.elements.orderDate.value = this.currentOrder.date;
        this.elements.customerId.value = this.currentOrder.customerId;
        this.elements.customerName.value = this.currentOrder.customerName;
        this.elements.discount.value = this.currentOrder.discount;
        this.elements.paymentMethod.value = this.currentOrder.paymentMethod;
        this.elements.cashReceived.value = this.currentOrder.cashReceived;
        this.updatePaymentMethod();

        // Update status badge
        this.updateStatusBadge();

        // Render items
        this.renderOrderItems();
        this.updateOrderSummary();

        // Remove the order from the orders array (will be re-added when completed)
        this.model.deleteOrder(orderId);

        // Scroll to top
        window.scrollTo(0, 0);
    }

    deleteOrder(orderId) {
        if (!confirm('Are you sure you want to delete this order?')) {
            return;
        }

        if (this.model.deleteOrder(orderId)) {
            this.renderOrderHistory();
            alert('Order deleted successfully');
        } else {
            alert('Order not found');
        }
    }

    // UI Update methods
    updateCurrentOrderFromForm() {
        this.currentOrder.customerId = this.elements.customerId.value;
        this.currentOrder.customerName = this.elements.customerName.value;
        this.currentOrder.discount = parseFloat(this.elements.discount.value) || 0;
        this.currentOrder.paymentMethod = this.elements.paymentMethod.value;
        this.currentOrder.cashReceived = parseFloat(this.elements.cashReceived.value) || 0;
    }

    updateOrderSummary() {
        this.model.calculateOrderTotals(this.currentOrder);

        // Update UI
        this.elements.subTotal.textContent = this.currentOrder.subTotal.toFixed(2);
        this.elements.tax.textContent = this.currentOrder.tax.toFixed(2);
        this.elements.total.textContent = this.currentOrder.total.toFixed(2);
        this.elements.change.textContent = this.currentOrder.change.toFixed(2);

        // Enable/disable complete order button based on payment
        if (this.currentOrder.paymentMethod === 'Cash') {
            this.elements.completeOrder.disabled = this.currentOrder.cashReceived < this.currentOrder.total;
        } else {
            this.elements.completeOrder.disabled = false;
        }

        // Highlight change if negative
        if (this.currentOrder.change < 0) {
            this.elements.change.classList.add('text-danger');
        } else {
            this.elements.change.classList.remove('text-danger');
        }
    }

    updatePaymentMethod() {
        this.currentOrder.paymentMethod = this.elements.paymentMethod.value;
        if (this.currentOrder.paymentMethod === 'Cash') {
            this.elements.cashReceivedContainer.style.display = 'block';
        } else {
            this.elements.cashReceivedContainer.style.display = 'none';
            this.elements.cashReceived.value = '0';
            this.currentOrder.cashReceived = 0;
            this.updateOrderSummary();
        }
    }

    updateStatusBadge() {
        this.elements.orderStatusBadge.textContent = this.currentOrder.status;

        if (this.currentOrder.status === 'Completed') {
            this.elements.orderStatusBadge.className = 'badge bg-success';
        } else if (this.currentOrder.status === 'Pending') {
            this.elements.orderStatusBadge.className = 'badge bg-warning';
        } else if (this.currentOrder.status === 'In Progress') {
            this.elements.orderStatusBadge.className = 'badge bg-warning';
        } else {
            this.elements.orderStatusBadge.className = 'badge bg-primary';
        }
    }

    updateCustomer() {
        const customerId = this.elements.customerId.value;
        const customer = this.model.getCustomer(customerId);

        if (customer) {
            this.elements.customerName.value = customer.name;
            this.currentOrder.customerId = customer.id;
            this.currentOrder.customerName = customer.name;
        } else {
            this.elements.customerName.value = '';
            this.currentOrder.customerId = '';
            this.currentOrder.customerName = '';
        }
    }

    updateItem() {
        const itemId = this.elements.itemId.value;
        const item = this.model.getItem(itemId);

        if (item) {
            this.elements.itemName.value = item.name;
            this.elements.itemPrice.value = item.price.toFixed(2);
        } else {
            this.elements.itemName.value = '';
            this.elements.itemPrice.value = '';
        }
    }

    // Render methods
    renderOrderItems() {
        if (this.currentOrder.items.length === 0) {
            this.elements.orderItemsContainer.innerHTML = '<p class="text-muted text-center">No items added to order</p>';
            return;
        }

        let html = '';
        this.currentOrder.items.forEach((item, index) => {
            html += `
            <div class="order-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">${item.id} | Rs. ${item.price.toFixed(2)} x ${item.qty}</small>
                </div>
                <div>
                    <span class="fw-bold">Rs. ${(item.price * item.qty).toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-danger ms-2 remove-item-btn" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary ms-1 edit-item-btn" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `;
        });

        this.elements.orderItemsContainer.innerHTML = html;

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('button').getAttribute('data-index'));
                this.currentOrder.items.splice(index, 1);
                this.renderOrderItems();
                this.updateOrderSummary();

                if (this.currentOrder.items.length === 0) {
                    this.currentOrder.status = 'New';
                    this.updateStatusBadge();
                }
            });
        });

        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('button').getAttribute('data-index'));
                const item = this.currentOrder.items[index];

                this.elements.itemId.value = item.id;
                this.elements.itemName.value = item.name;
                this.elements.itemPrice.value = item.price.toFixed(2);
                this.elements.itemQty.value = item.qty;

                // Remove the item from order (will be re-added when user clicks Add Item)
                this.currentOrder.items.splice(index, 1);
                this.renderOrderItems();
                this.updateOrderSummary();
            });
        });
    }

    renderOrderHistory(orders = this.model.getAllOrders()) {
        this.elements.orderHistoryTable.innerHTML = '';

        if (orders.length === 0) {
            this.elements.orderHistoryTable.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">No orders found</td>
            </tr>
        `;
            return;
        }

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.className = 'cursor-pointer';

            // Determine status badge color
            let statusBadgeClass = '';
            if (order.status === 'Completed') {
                statusBadgeClass = 'bg-success';
            } else if (order.status === 'Pending') {
                statusBadgeClass = 'bg-warning';
            } else {
                statusBadgeClass = 'bg-primary';
            }

            // Determine payment status badge color
            let paymentBadgeClass = '';
            if (order.paymentStatus === 'Paid') {
                paymentBadgeClass = 'bg-success';
            } else if (order.paymentStatus === 'Partially Paid') {
                paymentBadgeClass = 'bg-warning';
            } else {
                paymentBadgeClass = 'bg-danger';
            }

            row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.items.length} items</td>
            <td>Rs. ${order.total.toFixed(2)}</td>
            <td>${order.date}</td>
            <td>
                <span class="badge ${statusBadgeClass}">
                    ${order.status}
                </span>
            </td>
            <td>
                <span class="badge ${paymentBadgeClass}">
                    ${order.paymentStatus}
                </span>
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary edit-order-btn me-1" data-orderid="${order.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-order-btn" data-orderid="${order.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

            // Add click event to view order details
            row.addEventListener('click', () => this.viewOrderDetails(order.id));

            // Add event listeners to edit and delete buttons
            const editBtn = row.querySelector('.edit-order-btn');
            const deleteBtn = row.querySelector('.delete-order-btn');

            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editOrder(order.id);
            });

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteOrder(order.id);
            });

            this.elements.orderHistoryTable.appendChild(row);
        });
    }

    viewOrderDetails(orderId) {
        const order = this.model.getOrder(orderId);
        if (!order) return;

        // Update modal elements
        document.getElementById('modalOrderId').textContent = order.id;
        document.getElementById('modalCustomerName').textContent = order.customerName;
        document.getElementById('modalOrderDate').textContent = order.date;

        // Status badges
        const statusBadge = document.getElementById('modalOrderStatus');
        statusBadge.textContent = order.status;
        statusBadge.className = 'badge ' + (order.status === 'Completed' ? 'bg-success' : 'bg-warning');

        const paymentBadge = document.getElementById('modalPaymentStatus');
        paymentBadge.textContent = order.paymentStatus;
        paymentBadge.className = 'badge ' +
            (order.paymentStatus === 'Paid' ? 'bg-success' :
                order.paymentStatus === 'Partially Paid' ? 'bg-warning' : 'bg-danger');

        // Order items
        const itemsTable = document.getElementById('modalOrderItems');
        itemsTable.innerHTML = '';
        order.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>Rs. ${item.price.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td>Rs. ${(item.price * item.qty).toFixed(2)}</td>
        `;
            itemsTable.appendChild(row);
        });

        // Order totals
        document.getElementById('modalSubTotal').textContent = 'Rs. ' + order.subTotal.toFixed(2);
        document.getElementById('modalDiscount').textContent = order.discount + '%';
        document.getElementById('modalTax').textContent = 'Rs. ' + order.tax.toFixed(2);
        document.getElementById('modalTotal').textContent = 'Rs. ' + order.total.toFixed(2);

        // Payment information
        document.getElementById('modalPaymentMethod').textContent = order.paymentMethod;
        document.getElementById('modalCashReceived').textContent = 'Rs. ' + order.cashReceived.toFixed(2);
        document.getElementById('modalChange').textContent = 'Rs. ' + order.change.toFixed(2);

        // Show/hide payment section based on payment status
        const paymentSection = document.getElementById('paymentSection');
        if (order.paymentStatus === 'Paid') {
            paymentSection.style.display = 'block';
        } else {
            paymentSection.style.display = 'none';
        }

        // Show modal
        this.elements.orderDetailsModal.show();
    }

    // Search methods
    searchCustomer() {
        const customerId = this.elements.customerId.value.trim();
        if (!customerId) {
            alert('Please enter a customer ID');
            return;
        }

        const customer = this.model.getCustomer(customerId);
        if (customer) {
            this.elements.customerName.value = customer.name;
            this.currentOrder.customerId = customer.id;
            this.currentOrder.customerName = customer.name;
        } else {
            alert('Customer not found');
            this.elements.customerName.value = '';
            this.currentOrder.customerId = '';
            this.currentOrder.customerName = '';
        }
    }

    searchItem() {
        const itemId = this.elements.itemId.value.trim();
        if (!itemId) {
            alert('Please enter an item ID');
            return;
        }

        const item = this.model.getItem(itemId);
        if (item) {
            this.elements.itemName.value = item.name;
            this.elements.itemPrice.value = item.price.toFixed(2);
        } else {
            alert('Item not found');
            this.elements.itemName.value = '';
            this.elements.itemPrice.value = '';
        }
    }

    searchOrders() {
        const searchTerm = this.elements.searchOrderInput.value.trim();
        if (!searchTerm) {
            this.viewAllOrders();
            return;
        }

        const filteredOrders = this.model.searchOrders(searchTerm);
        this.renderOrderHistory(filteredOrders);
    }

    viewAllOrders() {
        this.elements.searchOrderInput.value = '';
        this.renderOrderHistory();
    }

    // Form methods
    clearForm() {
        this.elements.customerId.value = '';
        this.elements.customerName.value = '';
        this.clearItemForm();
        this.currentOrder.customerId = '';
        this.currentOrder.customerName = '';
    }

    clearItemForm() {
        this.elements.itemId.value = '';
        this.elements.itemName.value = '';
        this.elements.itemPrice.value = '';
        this.elements.itemQty.value = '1';
        this.elements.itemId.focus();
    }

    resetForNewOrder() {
        this.currentOrder = this.model.createNewOrder();
        this.elements.orderId.value = this.currentOrder.id;
        this.elements.orderDate.value = this.currentOrder.date;
        this.elements.paymentMethod.value = 'Cash';
        this.elements.cashReceivedContainer.style.display = 'block';
        this.updateStatusBadge();
        this.clearForm();
        this.renderOrderItems();
        this.updateOrderSummary();
        this.renderOrderHistory();
    }

    // Print receipt
    printReceipt() {
        const orderId = this.elements.completedOrderId.textContent;
        const order = this.model.getOrder(orderId);

        if (order) {
            let receiptContent = `
            <h2 class="text-center">Receipt</h2>
            <hr>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <hr>
            <h4>Items:</h4>
            <ul>
        `;

            order.items.forEach(item => {
                receiptContent += `
                <li>${item.name} - ${item.qty} x Rs. ${item.price.toFixed(2)} = Rs. ${(item.qty * item.price).toFixed(2)}</li>
            `;
            });

            receiptContent += `
            </ul>
            <hr>
            <p><strong>Subtotal:</strong> Rs. ${order.subTotal.toFixed(2)}</p>
            <p><strong>Discount:</strong> ${order.discount}%</p>
            <p><strong>Tax (10%):</strong> Rs. ${order.tax.toFixed(2)}</p>
            <h4><strong>Total:</strong> Rs. ${order.total.toFixed(2)}</h4>
        `;

            if (order.paymentMethod === 'Cash') {
                receiptContent += `
                <hr>
                <p><strong>Cash Received:</strong> Rs. ${order.cashReceived.toFixed(2)}</p>
                <p><strong>Change:</strong> Rs. ${order.change.toFixed(2)}</p>
            `;
            }

            receiptContent += `
            <hr>
            <p class="text-center">Thank you for your business!</p>
        `;

            // Open print window
            const printWindow = window.open('', '', 'width=600,height=600');
            printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt for Order ${order.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h2, h4 { color: #333; }
                        hr { border: 0; border-top: 1px solid #eee; margin: 10px 0; }
                        ul { list-style-type: none; padding: 0; }
                        li { margin-bottom: 5px; }
                        .text-center { text-align: center; }
                    </style>
                </head>
                <body>
                    ${receiptContent}
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                                window.close();
                            }, 200);
                        };
                    </script>
                </body>
            </html>
            `);
            printWindow.document.close();
        }

        this.elements.paymentSuccessModal.hide();
    }

    exitOrderManagement() {
        if (this.currentOrder.items.length > 0 && !confirm('You have items in your current order. Are you sure you want to exit?')) {
            return;
        }
        alert('Exiting order management system');
    }
}