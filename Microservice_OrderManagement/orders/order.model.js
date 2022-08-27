const mongoose = require('mongoose');

mongoose.model('Orders', {
    bookId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    customerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    customerName:{
        type: String
    },  
    bookTitle:{
        type: String,
    },
    initialDate: {
        type: Date,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    }
});