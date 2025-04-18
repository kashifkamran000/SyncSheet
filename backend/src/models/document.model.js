import {model, Schema} from "mongoose";

const documentSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: "Untitled Document"
    },
    content: {
        type: Schema.Types.Mixed,
        default: ''
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    allowToAll: {
        type: Boolean,
        default: false
    },
    permissions: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true
        },
        permission: {
            type: String,
            enum: ['read-only', 'read-write']
        }
    }]
},{timestamps: true})

export const Document = model('Document', documentSchema);