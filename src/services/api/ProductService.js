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

  // Get trending products based on location and weather data
  getTrendingByLocation(locationData, limit = 8) {
    try {
      let trendingProducts = [];

      // If we have location data, filter by regional preferences
      if (locationData?.city || locationData?.weather) {
        // Filter by weather-appropriate products
        if (locationData.weather) {
          const weatherKeywords = this.getWeatherKeywords(locationData.weather);
          trendingProducts = this.products.filter(product => 
            product?.name && product?.badges &&
            (product.badges.includes('TRENDING') ||
             product.badges.includes('BESTSELLER') ||
             weatherKeywords.some(keyword => 
               product.name.toLowerCase().includes(keyword.toLowerCase())
             ))
          );
        }

        // Filter by regional preferences based on city
        if (locationData.city && trendingProducts.length < limit) {
          const regionalProducts = this.getRegionalProducts(locationData.city);
          const additionalProducts = this.products.filter(product =>
            !trendingProducts.find(tp => tp.id === product.id) &&
            regionalProducts.some(rp => 
              product?.name && product.name.toLowerCase().includes(rp.toLowerCase())
            )
          );
          trendingProducts = [...trendingProducts, ...additionalProducts];
        }
      }

      // Fallback to general trending products if no location-based results
      if (trendingProducts.length < limit) {
        const generalTrending = this.products.filter(product =>
          product?.badges && (
            product.badges.includes('TRENDING') ||
            product.badges.includes('BESTSELLER') ||
            product.badges.includes('FRESH')
          )
        );
        
        // Add products that aren't already in the trending list
        generalTrending.forEach(product => {
          if (!trendingProducts.find(tp => tp.id === product.id)) {
            trendingProducts.push(product);
          }
        });
      }

      // Final fallback to top-rated products
      if (trendingProducts.length < limit) {
        const topRated = this.products
          .filter(product => 
            !trendingProducts.find(tp => tp.id === product.id) &&
            product?.rating && product.rating >= 4.0
          )
          .sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        trendingProducts = [...trendingProducts, ...topRated];
      }

      // Return limited results, ensuring we don't exceed the requested limit
      return Promise.resolve(trendingProducts.slice(0, limit));

    } catch (error) {
      console.error('Error getting trending products by location:', error);
      // Fallback to basic trending products
      const fallbackTrending = this.products
        .filter(product => product?.badges?.includes('TRENDING'))
        .slice(0, limit);
      return Promise.resolve(fallbackTrending);
    }
  }

  // Helper method to get weather-appropriate product keywords
  getWeatherKeywords(weather) {
    const weatherMap = {
      'hot': ['cold', 'ice', 'frozen', 'chilled', 'drinks', 'beverages'],
      'cold': ['warm', 'hot', 'soup', 'tea', 'coffee', 'spices'],
      'rainy': ['hot', 'warm', 'comfort', 'soup', 'tea'],
      'sunny': ['fresh', 'salad', 'fruits', 'cold', 'drinks'],
      'clear': ['fresh', 'organic', 'seasonal'],
      'cloudy': ['comfort', 'warm', 'hearty']
    };

    if (typeof weather === 'string') {
      return weatherMap[weather.toLowerCase()] || ['fresh', 'organic'];
    }
    
    return ['fresh', 'organic'];
  }

  // Helper method to get regional product preferences
  getRegionalProducts(city) {
    const regionalMap = {
      'karachi': ['seafood', 'fish', 'biryani', 'spices'],
      'lahore': ['dairy', 'lassi', 'kulfi', 'traditional'],
      'islamabad': ['organic', 'imported', 'premium'],
      'peshawar': ['dry fruits', 'nuts', 'traditional'],
      'quetta': ['fruits', 'seasonal', 'local'],
      'multan': ['mangoes', 'fruits', 'sweet'],
      'faisalabad': ['grains', 'wheat', 'agricultural']
    };

    if (typeof city === 'string') {
      return regionalMap[city.toLowerCase()] || ['local', 'fresh'];
    }
    
    return ['local', 'fresh'];
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