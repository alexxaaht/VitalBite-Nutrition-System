import api from '../../../services/api'; 

export const menuApi = {
    getCategories: async () => {
        const response = await api.get('/menu/categories');
        return response.data;
    },

    getDishes: async (categorySlug = 'all') => {
        const params = categorySlug !== 'all' ? { category: categorySlug } : {};
        const response = await api.get('/menu', { params });
        return response.data;
    }
};