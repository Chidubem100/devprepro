// const mongoose = require('mongoose');
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    refreshToken :{
        type: String,
        require: true
    },

    ip: {
        type: String,
        required: true
    },

    userAgent: {
        type: String,
        required: true
    },

    isValid: {
        type: Boolean,
        default: true
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {timestamps: true});


const Token = mongoose.model('Token', tokenSchema);
export default Token;