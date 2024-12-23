import { useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { CategoryContext } from '../contexts/CategoryContext';

export interface Category {
  id: number;
  name: string;
  created_at?: string;
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return {
    ...context,
    categories: context.categories || []
  };
} 