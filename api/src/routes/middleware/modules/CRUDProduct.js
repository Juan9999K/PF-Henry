const { User, Product, Category, Favorite } = require("../../../database.js"),
    { Op } = require("sequelize");
//definir las funciones que hacen toda la logica para traer todos los usuarios, por nombre o por id.
//En CRUDProduct se definen todas las peticiones Create (Crear), Read (Leer), Update (Actualizar) y Delete (Borrar)

//definir funciones

const modulePostProduct = async (newProduct) => {
    try {
        if (!newProduct.name || typeof newProduct.name !== "string") {
            throw new Error("El nombre del producto es incorrecto");
        }
        // if (!newProduct.image || typeof newProduct.image !== "string") {
        //   throw new Error("No se proporciono imagen, o el formato es incorrecto");
        // }
        if (
            !newProduct.description ||
            typeof newProduct.description !== "string"
        ) {
            throw new Error("La descripcion no puede estar vacia");
        }
        if (
            !newProduct.price ||
            newProduct.price < 0 ||
            isNaN(Number(newProduct.price))
        ) {
            throw new Error(
                "No se proporciono precio, o el formato es incorrecto"
            );
        }
        if (!newProduct.type || typeof newProduct.type !== "string") {
            throw new Error("Tipo de producto invalido");
        }
        if (!newProduct.categoryId) {
            throw new Error("Es necesaria una categoria");
        }

        const product = await Product.create(newProduct);
        const categories = await Category.findAll({
            where: {
                id: newProduct.categoryId,
            },
        });
        await product.setCategories(categories);
        return product;
    } catch (error) {
        console.error("Error al crear producto", error);
        throw new Error("Error al crear producto");
    }
};

const moduleGetAllProductFromDatabase = async () => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    attributes: ["name"],
                    through: { attributes: [] },
                },
            ],
        });
        const categories = products.map((c) => c.categories.map((c) => c.name));

        const formatedProducts = products.map((product, index) => ({
            id: product.id,
            name: product.name,
            image: product.image,
            description: product.description,
            price: product.price,
            type: product.type,
            categories: categories[index],
        }));

        return formatedProducts;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener todos los productos");
    }
};

const moduleGetProductFromDatabaseByName = async (name) => {
    try {
        const products = await Product.findAll({
            include: {
                model: Category,
                attributes: ["name"],
                through: { attributes: [] },
            },
            where: {
                name: { [Op.iLike]: `%${name}%` },
            },
        });

        const categories = products.map((c) => c.categories.map((c) => c.name));

        const formatedProducts = products.map((product, index) => ({
            id: product.id,
            name: product.name,
            image: product.image,
            description: product.description,
            price: product.price,
            type: product.type,
            categories: categories[index],
        }));

        return formatedProducts;
    } catch (error) {
        console.error(error);
        throw new Error(
            "Error al obtener los productos de la base de datos por nombre"
        );
    }
};

const moduleGetProductById = async (id) => {
    if (isNaN(id)) {
        throw new Error(`El id: ${id} no es válido`);
    }
    try {
        const productById = await Product.findOne({
            where: { id: id },
            include: {
                model: Category,
                attributes: ["name"],
                through: { attributes: [] },
            },
        });

        const categories = productById.categories.map((c) => c.name);
        const formatedProduct = {
            id: productById.id,
            name: productById.name,
            image: productById.image,
            description: productById.description,
            price: productById.price,
            type: productById.type,
            categories: categories,
        };
        return formatedProduct;
    } catch (error) {
        console.error(error);
        throw new Error(`El id: ${id} no es valido ${error}`);
    }
};
const modulePutStatusProduct = async (id, status) => {
    try {
        const product = await Product.findByPk(id);
        product.isActive = status;
        await product.save();
        return product;
    } catch (error) {
        console.error(error);
    }
};

const modulePutUpdateProduct = async (id, upProduct) => {
    try {
        console.log(id);
        console.log(upProduct);
        const product = await Product.findByPk(id, { include: Category });
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        product.name = upProduct.name;
        product.image = [upProduct.image];
        product.description = upProduct.description;
        product.price = upProduct.price;
        product.type = upProduct.type;

        await product.save();

        // Obtener las categorías asociadas al producto
        const existingCategories = product.categories.map(
            (category) => category.id
        );

        // Obtener las categorías nuevas del array categoryId
        const newCategories = await Category.findAll({
            where: {
                id: upProduct.categoryId.map((categoryId) =>
                    parseInt(categoryId)
                ),
            },
        });

        // Eliminar las categorías existentes que no están seleccionadas en la solicitud
        await product.removeCategories(
            existingCategories.filter(
                (categoryId) => !upProduct.categoryId.includes(categoryId)
            )
        );

        // Agregar las nuevas categorías al producto
        await product.addCategories(newCategories);

        return product;
    } catch (error) {
        console.error("Error al modificar el producto", error);
        throw new Error(`Error al modificar el producto `);
    }
};

const moduleGetFavorite = async (userId) => {
    try {
        const favorite = await Favorite.findAll({
            where: { userId },
        });

        if (!favorite) {
            throw new Error("No se encontró el favorito");
        }

        return favorite;
    } catch (error) {
        console.error(error);
        throw new Error("No se pudo obtener el favorito");
    }
};

const modulePostAddFavorite = async (productId, userId) => {
    try {
        let getFav = await Favorite.findOne({
            where: { productId, userId },
        });
        if (!getFav) {
            await Favorite.create({ productId, userId });
            console.log("Se agrego a favoritos");

            return true;
        } else {
            await Favorite.destroy({
                where: { productId, userId },
            });
            console.log("Se elimino el producto de favoritos");
        }
    } catch (error) {
        console.error("Error en la inserción del usuario", error);
        throw new Error(`Error en la inserción del usuario`);
    }
};

module.exports = {
    //exportar cada funcion
    modulePostProduct,
    moduleGetProductFromDatabaseByName,
    moduleGetAllProductFromDatabase,
    moduleGetProductById,
    modulePutStatusProduct,
    modulePutUpdateProduct,
    modulePostAddFavorite,
    moduleGetFavorite,
};
