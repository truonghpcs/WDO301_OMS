const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const CertificateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: 'https://example.com/default.jpg'
    },
}, { timestamps: true });

CertificateSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('certificate', CertificateSchema);
