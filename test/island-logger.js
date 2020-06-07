'use strict';

const axios = require('axios');
const baseUrl = 'http://LAPTOP-H3TFJSOQ:3000';

class IslandLogger {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getCategories() {
    const response = await axios.get(this.baseUrl + '/api/categories');

    return response.data;
  }

  async getCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/categories/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createCategories(newCategory) {
    const response = await axios.post(this.baseUrl + '/api/categories', newCategory);
    return response.data;
  }

  async deleteAllCategories() {
    const response = await axios.delete(this.baseUrl + '/api/categories');
    return response.data;
  }

  async deleteOneCategory(id) {
    const response = await axios.delete(this.baseUrl + '/api/categories/' + id);
    return response.data;
  }

  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + '/api/users');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/users/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + '/api/users', newUser);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + '/api/users');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + '/api/users/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async addIsland(id, island) {
    try {
      const response = await axios.post(this.baseUrl + '/api/categories/' + id + '/islands', island);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getIslands(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/categories/' + id + '/islands');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllIslands() {
    try {
      const response = await axios.delete(this.baseUrl + '/api/islands');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async authenticate(user) {
    try {
      const response = await axios.post(this.baseUrl + '/api/users/authenticate', user);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async clearAuth(user) {
    axios.defaults.headers.common['Authorization'] = '';
  }

}

module.exports = IslandLogger;