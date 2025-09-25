import { Request, Response } from "express";
import { ProductModel } from "../models/product.model";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 5
        console.log("search", search)
        const {rows, total} = await ProductModel.getAll(page, pageSize, search);
        const totalPages = Math.ceil(total / pageSize)

        res.status(200).json({
            page: page,
            pageSize: pageSize,
            total,
            totalPages,
            results: rows,
        })
    } catch (err) {
        res.status(500).json ({meassage: "Error get product", err})
    }
}