import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { z } from "zod";
import { ProductSchema, CategorySchema } from '@/types/types';

export async function loadCSVData() {
  const loadCSV = async <T>(filename: string, schema: z.ZodSchema<T>): Promise<T[]> => {
    const csvPath = path.join(process.cwd(), 'data', filename);
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          try {
            const validated = results.data.map((item) => schema.parse(item));
            resolve(validated);
          } catch (error) {
            reject(`Error validating ${filename}: ${error}`);
          }
        },
        error: reject
      });
    });
  };

  const [products, categories] = await Promise.all([
    loadCSV('products.csv', ProductSchema),
    loadCSV('categories.csv', CategorySchema)
  ]);

  return { products, categories };
}