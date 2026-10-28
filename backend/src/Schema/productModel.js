const mongoose = require("mongoose");

const warrantySchema = new mongoose.Schema(
    {
        durationMonths: {
            type: Number,
            required: true,
            min: 1
        },

        startDate: {
            type: Date,
            required: true
        },

        expiryDate: {
            type: Date,
            required: true
        },

        type: {
            type: String,
            enum: ["Manufacturer", "Seller", "Extended", "Other", ""],
            default: "Manufacturer"
        },
        placeOfWarrantyCard: {
            type : String,
            
        }
    },
    { _id: true }
);


const productSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        productName: {
            type: String,
            required: true,
            trim: true
        },

        brand: {
            type: String,
            trim: true
        },

        category: {
            type: String,
            trim: true
        },

        purchaseDate: {
            type: Date,
            required: true
        },

        purchasePrice: {
            type: Number,
            min: 0
        },

        warranty: [warrantySchema],

        // serialNumber: {
        //     type: String,
        //     trim: true
        // },

        // seller: {
        //     type: String,
        //     trim: true
        // },

        // notes: {
        //     type: String,
        //     trim: true
        // }
    },
    {
        timestamps: true
    }
);


const productModel = mongoose.model(
    "Product",
    productSchema
);

module.exports = productModel;



// WarrantyProduct
// ├── userId
// ├── productName
// ├── brand
// ├── category
// ├── purchaseDate
// ├── purchasePrice
// ├── warranty
// │   ├── durationMonths
// │   ├── startDate
// │   ├── expiryDate
// │   └── type
// ├── serialNumber
// ├── seller
// ├── notes
// ├── createdAt
// └── updatedAt