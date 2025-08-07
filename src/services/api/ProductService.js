import productsData from '@/services/mockData/products.json';

// Enhanced ProductService with admin capabilities and role verification
class ProductServiceClass {
  constructor() {
    this.products = [...productsData];
  }

  // Public methods
  getAll() {
    return Promise.resolve([...this.products]);
  }

  getById(id) {
    const product = this.products.find(prod => prod.Id === parseInt(id));
    return Promise.resolve(product || null);
  }

  search(query, limit = 20) {
    const filtered = this.products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    return Promise.resolve(filtered.slice(0, limit));
  }

  // Admin-only methods with role verification
  adminBulkUpdate(updates) {
    if (!this.verifyAdminAccess()) {
      return Promise.reject(new Error('Admin access required for bulk operations'));
    }
    
    const updatedProducts = [];
    updates.forEach(update => {
      const index = this.products.findIndex(p => p.Id === update.Id);
      if (index !== -1) {
        this.products[index] = {
          ...this.products[index],
          ...update,
          updatedAt: new Date().toISOString()
        };
        updatedProducts.push(this.products[index]);
      }
    });
    
    return Promise.resolve(updatedProducts);
  }

  adminCreate(productData) {
    if (!this.verifyAdminAccess()) {
      return Promise.reject(new Error('Admin access required'));
    }
    
    const newProduct = {
      Id: Math.max(...this.products.map(p => p.Id)) + 1,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    return Promise.resolve(newProduct);
  }

  adminUpdateStock(productId, newStock) {
    if (!this.verifyAdminAccess()) {
      return Promise.reject(new Error('Admin access required for stock management'));
    }
    
    const index = this.products.findIndex(p => p.Id === parseInt(productId));
    if (index === -1) {
      return Promise.reject(new Error('Product not found'));
    }
    
    this.products[index].stock = newStock;
    this.products[index].updatedAt = new Date().toISOString();
    
    return Promise.resolve(this.products[index]);
  }

  adminGetLowStockItems(threshold = 10) {
    if (!this.verifyAdminAccess()) {
      return Promise.reject(new Error('Admin access required'));
    }
    
    const lowStockItems = this.products.filter(product => 
      product.stock && product.stock < threshold
    );
    
    return Promise.resolve(lowStockItems);
  }

  verifyAdminAccess() {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.role === 'admin';
      }
    } catch (error) {
      console.error('Error verifying admin access:', error);
    }
    return false;
  }
}

export const ProductService = new ProductServiceClass();