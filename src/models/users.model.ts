import { Result } from "pg";
import { db } from "../config/db";

export interface Users {
    id?: number
    username: string
    role: string
    password: string
}

export const UsersModel = {

    getAll: (): Promise<Users[]> => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users ORDER BY id`, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result.rows)
            })
        })
    },
    getById: (id: Number): Promise<Users> => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE id = $1`, [id], (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result.rows[0])
            })
        })
    },

    createUser: (user: Users): Promise<Users | null> => {
        const { username, role, password } = user
        return new Promise((resolve, reject) => {
            if (
                !username || 
                !role ||
                !password 
            ) {
                reject("Gak Boleh Kosong")
            }
             db.query(
                `INSERT INTO users (username, role, password)
                VALUES ($1, $2, $3) RETURNING id, username, role`,
                [username, role, password],
                (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(result.rows[0])
                }
            )
        })
    },

    updateUser: (id: number, user: Users): Promise<Users> => {
        return new Promise((resolve, reject) => {
            const { username, role, password } = user
            db.query(
                `UPDATE users
                 SET username = $1, role = $2, password = $3
                 WHERE id = $4`,
                 [username, role, password, id],
                 (err, result) => {
                       if (err) {
                        reject(err)
                    }
                    resolve(result.rows[0])
                 }
            )
        })
    },

    deleteUser: (id: number): Promise<Users> => {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id], (err, result) => {
                if(err) {
                    reject(err)
                }
                resolve(result.rows[0])
            })
        })
    },

    getByUsername: (username: string): Promise<Users | null> => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT id, username, role, password FROM users WHERE username = $1`, [username], (err,result) => {
                if (err) {
                    reject(err)
                }
                resolve(result.rows[0])
            })
        })
    }

    
}


