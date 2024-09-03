import mongoose from 'mongoose';

const researchPaperSchema = new mongoose.Schema(
    {
        doi: {
            type: String,
            required: false,
        },
        title: { type: String, required: true },
        synopsis: { type: String, required: true },
        keywords: [{ type: String }],
        authors: [{ type: String }],
        contactNumber: { type: String },
        yearOfPublication: { type: String },
        language: { type: String, required: true },
        mainCategories: [{ type: String, required: true }],
        subCategories: [{ type: String, required: false }],
        officialUrl: [{ type: String }],
        files: [{ type: String }],
        issn: [{ type: String, required: false }],
        journalName: [{ type: String, required: false }],
        isApproved: {
            type: String,
            required: true,
            enum: ['approved', 'disapproved', 'pending'],
            default: 'pending',
        },
        email: {
            type: String,
            required: false,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null,
            required: false,
        },
        itemType: {
            type: String,
            required: false,
            enum: ['Research Paper', 'Book', 'Article', 'Thesis'],
        },
        reasonOfRejection: {
            type: String,
            required: false,
            default: null,
        },
        isbn: {
            type: Number,
            required: false,
        },
    },
    { timestamps: true }
);

export default mongoose.models.ResearchPaper ||
    mongoose.model('ResearchPaper', researchPaperSchema);
