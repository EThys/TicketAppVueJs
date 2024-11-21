import axios, { type AxiosInstance } from 'axios'

export const useAxiosRequestWithToken = (token: string = ''): AxiosInstance => {
  const useAxios: AxiosInstance = axios.create({
    baseURL: 'http://localhost:5184/api/',
    headers: {
      accept: 'application/json',
      'Content-type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Bearer ${token}`
    }
  })

  return useAxios
}

export const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiODkwOTksImV4cCI6MTcwMTUwMzQ5OSwibmJmIjoxNjk5Njg5MDk5LCJqdGkiOiJyeXdMTG5PZE04ZUtNbWRqIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.9WJWcUgoKJDrN_laSgGIXsRavo_d1l5HxcgAEe36GK4"

const categories = [
  { "CategoryID": 1, "CategoryName": "Beverages" },
  { "CategoryID": 2, "CategoryName": "Condiments" },
  { "CategoryID": 3, "CategoryName": "Confections" },
  { "CategoryID": 4, "CategoryName": "Dairy Products" },
  { "CategoryID": 5, "CategoryName": "Grains/Cereals" },
  { "CategoryID": 6, "CategoryName": "Meat/Poultry" },
  { "CategoryID": 7, "CategoryName": "Produce" },
  { "CategoryID": 8, "CategoryName": "Seafood" }
];

export { categories as categoriesData };

const products = [
  { "Numero": 1, "ProductName": "Tea", "CategoryID": 1, "QuantityPerUnit": "10 boxes x 20 bags", "UnitPrice": 18.0, "UnitsInStock": 39, "Discontinued": false },

  { "Numero": 7, "ProductName": "Dried Pears", "CategoryID": 7, "QuantityPerUnit": "12 - 1 lb pkgs.", "UnitPrice": 30.0, "UnitsInStock": 15, "Discontinued": false },

];

export { products as productsData };
