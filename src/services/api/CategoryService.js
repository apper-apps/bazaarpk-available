import categoriesData from '@/services/mockData/categories.json';

// Enhanced CategoryService with admin capabilities
class CategoryServiceClass {
  constructor() {
    this.categories = [...categoriesData];
  }

  // Public methods
  getAll() {
    return Promise.resolve([...this.categories]);
  }

  getById(id) {
    const category = this.categories.find(cat => cat.Id === parseInt(id));
    return Promise.resolve(category || null);
  }

  // Admin-only methods
  adminCreate(categoryData) {
    if (!this.verifyAdminAccess()) {
      throw new Error('Admin access required');
    }
    
    const newCategory = {
      Id: Math.max(...this.categories.map(c => c.Id)) + 1,
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.categories.push(newCategory);
    return Promise.resolve(newCategory);
  }

  adminUpdate(id, categoryData) {
    if (!this.verifyAdminAccess()) {
      throw new Error('Admin access required');
    }
    
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    this.categories[index] = {
      ...this.categories[index],
      ...categoryData,
      updatedAt: new Date().toISOString()
    };
    
    return Promise.resolve(this.categories[index]);
  }

  adminDelete(id) {
    if (!this.verifyAdminAccess()) {
      throw new Error('Admin access required');
    }
    
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const deletedCategory = this.categories.splice(index, 1)[0];
    return Promise.resolve(deletedCategory);
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

export const CategoryService = new CategoryServiceClass();

export const CategoryService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...categoriesData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const category = categoriesData.find(c => c.Id === id);
    return category ? { ...category } : null;
  },

  create: async (category) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...categoriesData.map(c => c.Id));
    const newCategory = { ...category, Id: maxId + 1 };
    categoriesData.push(newCategory);
    return { ...newCategory };
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = categoriesData.findIndex(c => c.Id === id);
    if (index !== -1) {
      categoriesData[index] = { ...categoriesData[index], ...updates };
      return { ...categoriesData[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = categoriesData.findIndex(c => c.Id === id);
    if (index !== -1) {
      const deleted = categoriesData.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};