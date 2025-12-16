import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EcommerceStore } from '../../ecommerce';
import { Router } from '@angular/router';
import { UserRole, User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { AdminService, AdminProduct, AdminOrder } from '../../services/admin.service';

type Tab = 'users' | 'products' | 'orders';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-600">{{ user()?.name }} ({{ user()?.role }})</span>
              <button 
                (click)="logout()"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
          
          <!-- Tabs -->
          <div class="flex gap-4 mt-4 border-b border-gray-200">
            <button 
              (click)="activeTab.set('users')"
              [class]="getTabClass('users')">
              Users ({{ allUsers().length }})
            </button>
            <button 
              (click)="activeTab.set('products')"
              [class]="getTabClass('products')">
              Products ({{ allProducts().length }})
            </button>
            <button 
              (click)="activeTab.set('orders')"
              [class]="getTabClass('orders')">
              Orders ({{ allOrders().length }})
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Users Tab -->
        @if (activeTab() === 'users') {
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900">Users Management</h2>
              <button 
                (click)="refreshUsers()"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Refresh
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (user of allUsers(); track user.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <img [src]="user.imageUrl" alt="" class="w-10 h-10 rounded-full">
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [class]="getRoleBadgeClass(user.role)">{{ user.role }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        @if (user.role === 'customer') {
                          <button 
                            (click)="promoteToAdmin(user)"
                            class="text-blue-600 hover:text-blue-900">
                            Promote
                          </button>
                        } @else {
                          <button 
                            (click)="demoteToCustomer(user)"
                            class="text-orange-600 hover:text-orange-900">
                            Demote
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Products Tab -->
        @if (activeTab() === 'products') {
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900">Products Management</h2>
              <div class="flex gap-2">
                <button 
                  (click)="refreshProducts()"
                  class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                  Refresh
                </button>
                <button 
                  (click)="openAddProductForm()"
                  class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                  + Add Product
                </button>
              </div>
            </div>
            
            <!-- Add/Edit Product Form -->
            @if (showProductForm()) {
              <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 class="text-md font-semibold mb-3">{{ editingProduct() ? 'Edit' : 'Add' }} Product</h3>
                <div class="grid grid-cols-2 gap-4">
                  <input 
                    [(ngModel)]="productForm.name"
                    placeholder="Product Name"
                    class="px-3 py-2 border border-gray-300 rounded">
                  <input 
                    [(ngModel)]="productForm.price"
                    type="number"
                    placeholder="Price"
                    class="px-3 py-2 border border-gray-300 rounded">
                  <input 
                    [(ngModel)]="productForm.category"
                    placeholder="Category"
                    class="px-3 py-2 border border-gray-300 rounded">
                  <input 
                    [(ngModel)]="productForm.imageUrl"
                    placeholder="Image URL"
                    class="px-3 py-2 border border-gray-300 rounded">
                  <textarea 
                    [(ngModel)]="productForm.description"
                    placeholder="Description"
                    rows="2"
                    class="px-3 py-2 border border-gray-300 rounded col-span-2"></textarea>
                  <label class="flex items-center gap-2">
                    <input 
                      [(ngModel)]="productForm.inStock"
                      type="checkbox"
                      class="w-4 h-4">
                    <span class="text-sm">In Stock</span>
                  </label>
                </div>
                <div class="flex gap-2 mt-4">
                  <button 
                    (click)="saveProduct()"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Save
                  </button>
                  <button 
                    (click)="cancelProductForm()"
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </div>
            }

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (product of allProducts(); track product.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <img [src]="product.imageUrl" alt="" class="w-12 h-12 rounded object-cover">
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                            <div class="text-xs text-gray-500">{{ product.description | slice:0:50 }}...</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm">{{ product.category }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">\${{ product.price }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [class]="product.inStock ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                          {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button 
                          (click)="editProduct(product)"
                          class="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                        <button 
                          (click)="toggleProductStock(product)"
                          class="text-orange-600 hover:text-orange-900">
                          {{ product.inStock ? 'Disable' : 'Enable' }}
                        </button>
                        <button 
                          (click)="deleteProduct(product.id!)"
                          class="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Orders Tab -->
        @if (activeTab() === 'orders') {
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900">Orders Management</h2>
              <button 
                (click)="refreshOrders()"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Refresh
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (order of allOrders(); track order.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{ order.id | slice:0:8 }}...</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm">{{ order.userName }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">\${{ order.total }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <select 
                          [value]="order.status"
                          (change)="updateOrderStatus(order.id!, $any($event.target).value)"
                          class="text-sm px-2 py-1 border border-gray-300 rounded">
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ order.createdAt | date:'short' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button 
                          (click)="viewOrderDetails(order)"
                          class="text-blue-600 hover:text-blue-900">
                          View
                        </button>
                        <button 
                          (click)="deleteOrder(order.id!)"
                          class="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Order Details Modal -->
        @if (selectedOrder()) {
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="closeOrderDetails()">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" (click)="$event.stopPropagation()">
              <h3 class="text-lg font-semibold mb-4">Order Details</h3>
              <div class="space-y-2 mb-4">
                <p><strong>Order ID:</strong> {{ selectedOrder()!.id }}</p>
                <p><strong>Customer:</strong> {{ selectedOrder()!.userName }}</p>
                <p><strong>Status:</strong> {{ selectedOrder()!.status }}</p>
                <p><strong>Total:</strong> \${{ selectedOrder()!.total }}</p>
                <p><strong>Date:</strong> {{ selectedOrder()!.createdAt | date:'medium' }}</p>
              </div>
              <h4 class="font-semibold mb-2">Items:</h4>
              <div class="space-y-2">
                @for (item of selectedOrder()!.items; track item.productId) {
                  <div class="flex justify-between border-b pb-2">
                    <span>{{ item.productName }} x{{ item.quantity }}</span>
                    <span class="font-semibold">\${{ item.price * item.quantity }}</span>
                  </div>
                }
              </div>
              <button 
                (click)="closeOrderDetails()"
                class="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Close
              </button>
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: ``
})
export class AdminDashboardComponent {
  store = inject(EcommerceStore);
  router = inject(Router);
  authService = inject(AuthService);
  adminService = inject(AdminService);

  user = this.store.user;
  activeTab = signal<Tab>('users');
  
  // Users
  allUsers = signal<User[]>([]);
  
  // Products
  allProducts = signal<AdminProduct[]>([]);
  showProductForm = signal(false);
  editingProduct = signal<AdminProduct | null>(null);
  productForm: AdminProduct = this.getEmptyProductForm();
  
  // Orders
  allOrders = signal<AdminOrder[]>([]);
  selectedOrder = signal<AdminOrder | null>(null);

  constructor() {
    this.loadUsers();
    this.loadProducts();
    this.loadOrders();
  }

  // ==================== TAB MANAGEMENT ====================
  
  getTabClass(tab: Tab): string {
    const base = 'px-4 py-2 font-medium transition-colors';
    return this.activeTab() === tab
      ? `${base} text-blue-600 border-b-2 border-blue-600`
      : `${base} text-gray-600 hover:text-gray-900`;
  }

  // ==================== USERS ====================

  loadUsers() {
    this.authService.getAllUsers().subscribe(users => {
      this.allUsers.set(users);
    });
  }

  refreshUsers() {
    this.loadUsers();
  }

  getRoleBadgeClass(role: string): string {
    if (role === UserRole.ADMIN) {
      return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800';
    }
    return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
  }

  promoteToAdmin(user: User) {
    if (confirm(`Promote ${user.name} to Admin?`)) {
      this.authService.updateUserRole(user.id, UserRole.ADMIN).subscribe(updatedUser => {
        if (updatedUser) {
          this.loadUsers();
          if (this.user()?.id === user.id) {
            this.store.updateUserRole(UserRole.ADMIN);
          }
        }
      });
    }
  }

  demoteToCustomer(user: User) {
    if (confirm(`Demote ${user.name} to Customer?`)) {
      this.authService.updateUserRole(user.id, UserRole.CUSTOMER).subscribe(updatedUser => {
        if (updatedUser) {
          this.loadUsers();
          if (this.user()?.id === user.id) {
            this.store.updateUserRole(UserRole.CUSTOMER);
            this.router.navigate(['/']);
          }
        }
      });
    }
  }

  // ==================== PRODUCTS ====================

  loadProducts() {
    this.adminService.getAllProducts().subscribe(products => {
      this.allProducts.set(products);
    });
  }

  refreshProducts() {
    this.loadProducts();
  }

  getEmptyProductForm(): AdminProduct {
    return {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      inStock: true
    };
  }

  openAddProductForm() {
    this.editingProduct.set(null);
    this.productForm = this.getEmptyProductForm();
    this.showProductForm.set(true);
  }

  editProduct(product: AdminProduct) {
    this.editingProduct.set(product);
    this.productForm = { ...product };
    this.showProductForm.set(true);
  }

  saveProduct() {
    if (this.editingProduct()) {
      // Update
      const id = this.editingProduct()!.id!;
      this.adminService.updateProduct(id, this.productForm).subscribe(updated => {
        if (updated) {
          this.loadProducts();
          this.cancelProductForm();
        }
      });
    } else {
      // Create
      this.adminService.createProduct(this.productForm).subscribe(created => {
        if (created) {
          this.loadProducts();
          this.cancelProductForm();
        }
      });
    }
  }

  cancelProductForm() {
    this.showProductForm.set(false);
    this.editingProduct.set(null);
    this.productForm = this.getEmptyProductForm();
  }

  toggleProductStock(product: AdminProduct) {
    this.adminService.updateProduct(product.id!, { inStock: !product.inStock }).subscribe(updated => {
      if (updated) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(id: string) {
    if (confirm('Delete this product?')) {
      this.adminService.deleteProduct(id).subscribe(success => {
        if (success) {
          this.loadProducts();
        }
      });
    }
  }

  // ==================== ORDERS ====================

  loadOrders() {
    this.adminService.getAllOrders().subscribe(orders => {
      this.allOrders.set(orders);
    });
  }

  refreshOrders() {
    this.loadOrders();
  }

  updateOrderStatus(orderId: string, status: AdminOrder['status']) {
    this.adminService.updateOrderStatus(orderId, status).subscribe(updated => {
      if (updated) {
        this.loadOrders();
      }
    });
  }

  viewOrderDetails(order: AdminOrder) {
    this.selectedOrder.set(order);
  }

  closeOrderDetails() {
    this.selectedOrder.set(null);
  }

  deleteOrder(id: string) {
    if (confirm('Delete this order?')) {
      this.adminService.deleteOrder(id).subscribe(success => {
        if (success) {
          this.loadOrders();
        }
      });
    }
  }

  // ==================== GENERAL ====================

  logout() {
    this.store.signOut();
    this.router.navigate(['/']);
  }
}

export default AdminDashboardComponent;
