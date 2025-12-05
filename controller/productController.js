const db = require("../config/db");

exports.addProduct = async function(req, res) {
    try {
        const { name, price, category, quantity } = req.body;

        const [product] = await db.query(
        "INSERT INTO products(name, price, category, quantity) VALUES(?, ?, ?, ?)",
        [name, price, category, quantity]);

    console.log(product[0]);
    
    res.status(201).json({ message: "Product added successfully", data: {product: product[0]} });
}catch(err) {
    res.status(500).json({status: false, message: err.message ?? err})
}
};

exports.getProducts = async function(req, res) {
    try {
        const [rows] = await db.query("SELECT * FROM products");
        res.status(200).json({status: true, message: "Products fetched successfully", results: rows.length, data: {products: rows}});
    }catch(err) {
        res.status(500).json({status: false, message: err.message ?? err})
    }
};


exports.getProduct  = async function(req, res) {
    try {

          const { id } = req.params;
        
        // Check if product exists
        const [product] = await db.query(
        "SELECT * FROM products WHERE product_id = ?",
        [id]
    );

     if (!product.length) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({status: true, message: "Product fetched successfully", data: {product}})
    }catch(err) {
 res.status(500).json({status: false, message: err.message ?? err})
    }
}

exports.deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;
        
        // Check if product exists
        const [product] = await db.query(
        "SELECT * FROM products WHERE product_id = ?",
        [id]
    );

    if (!product.length) {
        return res.status(404).json({ message: "Product not found" });
    }
    
    // Delete product
    await db.query("DELETE FROM products WHERE product_id = ?", [id]);
    
    res.status(204).json({ success: true,  message: "Product deleted successfully", data: null });
}catch(err) {
    res.status(500).json({status: false, message: err.message ?? err})
}
};



exports.updateProduct = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, price, category, quantity } = req.body;
        
        // Check if product exists
        const [product] = await db.query(
        "SELECT * FROM products WHERE product_id = ?",
        [id]
    );
    
    if (!product.length) {
        return res.status(404).json({ message: "Product not found" });
    }
    
    // Update the product
    await db.query(
        "UPDATE products SET name = ?, price = ?, category = ?, quantity = ? WHERE product_id = ?",
        [name, price, category, quantity, id]
    );
    
    res.json({
        message: "Product updated successfully",
        updatedProduct: {
            id,
            name,
            price,
            category,
            quantity
        }
    });
}catch(err) {
     res.status(500).json({status: false, message: err.message ?? err})
}
};



exports.searchProducts = async function(req, res) {
   try {

       
       const { minPrice, maxPrice, category, minQty } = req.query;
       
       let sql = "SELECT * FROM products WHERE 1=1";
       let params = [];
       
       if (minPrice) { sql += " AND price >= ?"; params.push(minPrice); }
       if (maxPrice) { sql += " AND price <= ?"; params.push(maxPrice); }
       if (category) { sql += " AND category = ?"; params.push(category); }
       if (minQty)   { sql += " AND quantity >= ?"; params.push(minQty); }
       
       const [rows] = await db.query(sql, params);
       res.status(200).json({status: true, message: "product fetched successfully!", data: {product: rows} });
    }catch(err) {
        res.status(500).json({status: false, message: err.message ?? err}) 
    }
};
