import { useState, useEffect } from 'react';
import { menuApi } from '../api/menuApi';

export const useMenu = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await menuApi.getCategories();
                setCategories([{ id: 0, name: 'Всі страви', slug: 'all' }, ...data]);
            } catch (err) {
                console.error('Failed to fetch categories', err);
                setError(err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchDishes = async () => {
            setIsLoading(true);
            try {
                const data = await menuApi.getDishes(activeCategory);
                if (isMounted) setDishes(data);
            } catch (err) {
                console.error('Failed to fetch dishes', err);
                if (isMounted) setError(err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchDishes();

        return () => { isMounted = false; };
    }, [activeCategory]);

    return {
        categories,
        dishes,
        activeCategory,
        isLoading,
        error,
        setActiveCategory
    };
};