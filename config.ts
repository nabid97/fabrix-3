
export default {

  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/mydb1',

  aws: {

    s3Bucket: process.env.AWS_S3_BUCKET || 'ecommerce-website-generated-logo-2025',

    region: process.env.AWS_REGION || 'us-east-1'

  }

};

