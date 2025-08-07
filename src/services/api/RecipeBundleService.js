import recipeBundlesData from "@/services/mockData/recipeBundles.json";

// Enhanced RecipeBundleService with admin management capabilities
class RecipeBundleServiceClass {
  constructor() {
    this.recipeBundles = [...recipeBundlesData];
    this.nextId = Math.max(...recipeBundlesData.map(bundle => bundle.Id)) + 1;
  }

  // Existing public methods
  getAll() {
    return [...this.recipeBundles];
  }

  getById(id) {
    return this.recipeBundles.find(bundle => bundle.Id === parseInt(id)) || null;
  }

  getFeatured(limit = 6) {
    return this.recipeBundles.filter(bundle => bundle.featured).slice(0, limit);
  }

  getByCategory(category, limit = 12) {
    return this.recipeBundles
      .filter(bundle => bundle.category.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  }

  getByTime(maxTime, limit = 8) {
    return this.recipeBundles
      .filter(bundle => bundle.prepTime <= maxTime)
      .slice(0, limit);
  }

  search(query, limit = 10) {
    const lowerQuery = query.toLowerCase();
    return this.recipeBundles
      .filter(bundle => 
        bundle.name.toLowerCase().includes(lowerQuery) ||
        bundle.description.toLowerCase().includes(lowerQuery) ||
        bundle.cuisine.toLowerCase().includes(lowerQuery)
      )
      .slice(0, limit);
  }

  // Admin-only methods with enhanced capabilities
  adminCreate(bundleData) {
    if (!this.verifyAdminAccess()) {
      throw new Error('Admin access required for bundle creation');
    }

    const newBundle = {
      Id: this.nextId++,
      ...bundleData,
      components: bundleData.components || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    this.recipeBundles.push(newBundle);
    return newBundle;
  }

  adminUpdate(id, bundleData) {
    if (!this.verifyAdminAccess()) {
      throw new Error('Admin access required for bundle updates');
    }

    const index = this.recipeBundles.findIndex(bundle => bundle.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Bundle not found');
    }

    this.recipeBundles[index] = {
      ...this.recipeBundles[index],
      ...bundleData,
      updatedAt: new Date().toISOString()
    };

    return this.recipeBundles[index];
  }

  adminDelete(id) {
    if (!this.verifyAdminAccess()) {
      throw new Error('Admin access required for bundle deletion');
    }

    const index = this.recipeBundles.findIndex(bundle => bundle.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Bundle not found');
    }

    const deletedBundle = this.recipeBundles.splice(index, 1)[0];
    return deletedBundle;
  }

  adminBulkStatusUpdate(bundleIds, status) {
    if (!this.verifyAdminAccess()) {
      throw new Error('Admin access required for bulk operations');
    }

    const updatedBundles = [];
    bundleIds.forEach(id => {
      const index = this.recipeBundles.findIndex(bundle => bundle.Id === parseInt(id));
      if (index !== -1) {
        this.recipeBundles[index].status = status;
        this.recipeBundles[index].updatedAt = new Date().toISOString();
        updatedBundles.push(this.recipeBundles[index]);
      }
    });

    return updatedBundles;
  }

  adminGetAnalytics() {
    if (!this.verifyAdminAccess()) {
      throw new Error('Admin access required for analytics');
    }

    const analytics = {
      totalBundles: this.recipeBundles.length,
      activeBundles: this.recipeBundles.filter(b => b.status === 'active').length,
      featuredBundles: this.recipeBundles.filter(b => b.featured).length,
      averageRating: this.recipeBundles.reduce((sum, b) => sum + (b.rating || 0), 0) / this.recipeBundles.length,
      categoryCounts: this.recipeBundles.reduce((acc, bundle) => {
        acc[bundle.category] = (acc[bundle.category] || 0) + 1;
        return acc;
      }, {})
    };

    return analytics;
  }

  // Existing methods with admin verification where needed
  addComponent(bundleId, product, quantity, unit = "pc") {
    const bundle = this.getById(bundleId);
    if (!bundle) {
      throw new Error('Bundle not found');
    }

    const component = {
      id: Date.now(),
      product,
      quantity,
      unit,
      addedAt: new Date().toISOString()
    };

    if (!bundle.components) {
      bundle.components = [];
    }

    bundle.components.push(component);
    bundle.updatedAt = new Date().toISOString();
    
    return bundle;
  }

  removeComponent(bundleId, productId) {
    const bundle = this.getById(bundleId);
    if (!bundle) {
      throw new Error('Bundle not found');
    }

    if (bundle.components) {
      bundle.components = bundle.components.filter(comp => comp.product.Id !== productId);
      bundle.updatedAt = new Date().toISOString();
    }

    return bundle;
  }

  updateComponent(bundleId, productId, updates) {
    const bundle = this.getById(bundleId);
    if (!bundle) {
      throw new Error('Bundle not found');
    }

    if (bundle.components) {
      const componentIndex = bundle.components.findIndex(comp => comp.product.Id === productId);
      if (componentIndex !== -1) {
        bundle.components[componentIndex] = {
          ...bundle.components[componentIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        bundle.updatedAt = new Date().toISOString();
      }
    }

    return bundle;
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

export const RecipeBundleService = new RecipeBundleServiceClass();

// Legacy function exports for backward compatibility
export function getAll() { return RecipeBundleService.getAll(); }
export function getById(id) { return RecipeBundleService.getById(id); }
export function getFeatured(limit) { return RecipeBundleService.getFeatured(limit); }
export function getByCategory(category, limit) { return RecipeBundleService.getByCategory(category, limit); }
export function getByTime(maxTime, limit) { return RecipeBundleService.getByTime(maxTime, limit); }
export function search(query, limit) { return RecipeBundleService.search(query, limit); }
export function create(bundleData) { return RecipeBundleService.adminCreate(bundleData); }
export function update(id, bundleData) { return RecipeBundleService.adminUpdate(id, bundleData); }
export function deleteBundle(id) { return RecipeBundleService.adminDelete(id); }
export function addComponent(bundleId, product, quantity, unit) { return RecipeBundleService.addComponent(bundleId, product, quantity, unit); }
export function removeComponent(bundleId, productId) { return RecipeBundleService.removeComponent(bundleId, productId); }
export function updateComponent(bundleId, productId, updates) { return RecipeBundleService.updateComponent(bundleId, productId, updates); }