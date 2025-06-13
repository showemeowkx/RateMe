import { fetchCategories } from './categoriesFetch';

const fillObj = async () => {
  const response = await fetchCategories();
  const obj = {};
  for (const el of response) {
    obj[el.slug] = el.name;
  }

  return obj;
};

export const CATEGORY_OPTIONS = await fillObj();
