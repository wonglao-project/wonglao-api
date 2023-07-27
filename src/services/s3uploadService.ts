import { S3Client, PutObjectAclCommand } from "@aws-sdk/client-s3"
import 'dotenv/config'


const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY


export async function S3imageUpload(fileBuffer, fileName, mimetype){
    const s3 = new S3Client({
        credentials : {
            accessKeyId: accessKey || 'somekey',
            secretAccessKey: secretAccessKey || 'somekey'
        },
        region: bucketRegion
    })
    const paramsService = { 
        Bucket: bucketName,
        Body: fileBuffer,
        Key: fileName,
        ContentType: mimetype
     }
    const command = new PutObjectAclCommand(paramsService)
    return await s3.send(command)
}

