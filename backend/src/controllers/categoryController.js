const { Category } = require('../models');

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] });
        res.json({ 
            success: true, 
            data: categories 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const category = await Category.create({ 
            name, 
            slug, 
            description, 
            image 
        });

        res.status(201).json({ 
            success: true, 
            data: category 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const cat = await Category.findByPk(req.params.id);
        if (!cat) { 
            res.status(404); 
            throw new Error('Category not found'); 
        }

        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
        }

        await cat.update(req.body);

        res.json({ 
            success: true, 
            data: cat 
        });
    } catch (e) { 
        next(e); 
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const cat = await Category.findByPk(req.params.id);
        if (!cat) { 
            res.status(404); throw new Error('Category not found'); 
        }

        await cat.destroy();

        res.json({ 
            success: true, 
            message: 'Category deleted' 
        });
    } catch (e) { 
        next(e); 
    }
};