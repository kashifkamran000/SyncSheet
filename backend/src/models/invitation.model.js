import mongoose, { Schema } from "mongoose";

const invitationSchema = new Schema({
    documentId: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    invitedUserEmail: {
        type: String, 
        required: true
    },
    invitedUserName: {
        type: String, 
        required: true
    },
    permission: {
        type: String, 
        enum: ['read-only', 'read-write'],
        required: true
    },
    status: {
        type: String, 
        enum: ['pending', 'accepted', 'rejected', 'expired'],
        default: 'pending'
    },
    expiredAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 1000),
    },
}, {timestamps: true})

export const Invitation = mongoose.model('Invitation', invitationSchema)