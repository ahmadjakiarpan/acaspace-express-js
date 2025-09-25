import { Result } from "pg";
import { db } from "../config/db";

export interface Product {
    id?: number
    product_name: string
    current_price: number
    original_price: number
    discount: number
    image: string
    savings: number
}

export interface ProductList{
    rows: Product[]
    total: number}

export const ProductModel = {
    
    getAll: (page: number, pageSize: number, search?: string): Promise<ProductList> => {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * pageSize;

            let query = 'SELECT * FROM product';
            let countQuery = 'SELECT COUNT(*) FROM product';
            const values = [];
            if (search) {
                query += " WHERE product_name ILIKE $1",
                countQuery += " WHERE product_name ILIKE $1";
                values.push(`%${search}%`)
            }

            query += ` ORDER BY id ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
            values.push(pageSize, offset)

            db.query(query, values, (err, result) => {
                console.log(query)
                console.log(countQuery)
                if (err) {
                    reject (err)
                }
                db.query(countQuery, search ? [`%${search}`] :[], (countErr, countResult) => {
                    if(countErr) {
                        return reject(countErr)
                    }
                    const total = parseInt(countResult.rows[0].count)
                  
                    resolve({rows: result.rows, total})
                })
            })
        })
    },

    getById: (id: number): Promise<Product> => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM product WHERE id = $1`, [id], (err, result) => {
                if(err) {
                    reject (err)
                }
                resolve(result.rows[0])
            })
        })
    },
    

    createProduct: (product: Product): Promise<Product | null> => {
        const { current_price, discount, image, product_name, original_price, savings } = product
        return new Promise((resolve, reject) => {
            if (
                !current_price ||
                !image ||
                !product_name ||
                !original_price ||
                !savings
            ) {
                reject("Gak Boleh Kosong")
            }
            db.query(
                `INSERT INTO product (name, discount, current_price, image, original_price, savings)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [name, discount, current_price, image, original_price, savings],
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result.rows[0])
                }
            )
        })
    },

    updateProduct: (id: number, product: Product): Promise<Product> => {
        return new Promise((resolve, reject) => {
            const { current_price, discount, image, product_name, original_price, savings} = product
            db.query(
                `UPDATE product
                SET name = $1, discount = $2, current_price = $3, image = $4, original_price = $5, savings = $6 WHERE id = $7`,
                [name, discount, current_price, image, name, original_price, savings, id],
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result.rows[0])
                }
            )
        })
    },

    deleteProduct: (id: number): Promise<Product> => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM product WHERE id = $1 RETURNING *`, [id], (err, result) => {
                if(err) {
                    reject(err)
                }
                resolve(result.rows[0])
            })
        })
    }
}

