const AWS = require('aws-sdk');
require('dotenv').config();
const http = require('http');

const agent = new http.Agent({
    keepAlive: true,
    maxSockets: Infinity
});
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    httpOptions: {
        agent
    }
});

const dynamoClient = new AWS.DynamoDB.DocumentClient({
    sslEnabled: false,
    paramValidation: false,
    convertResponseTypes: false,
    httpOptions: {
        agent
    }
});

const USER_TABLE = "Admin"
const addAdmin = async (user) => {
    const {name, email , password } = user;
    const Item ={
        name:name,
        email:email,
        password:password,
    }
    const params = {
        TableName: USER_TABLE,
        Item: Item,
        
    }
    const data = await dynamoClient.put(params).promise()
    return Item
}

const getAllAdmin =async()=>{
    
    const params={
        TableName:USER_TABLE,
    }
    data= await dynamoClient.scan(params).promise();
    return data.Items
};

const getAdmin = async (name) => {
    const params = {
        TableName: USER_TABLE,
        KeyConditionExpression: "#name = :name",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": name
        }
    };
    const data = await dynamoClient.query(params).promise();
    console.log(data);
    return data.Items[0];
};

module.exports = {
    addAdmin,
    getAdmin,
    getAllAdmin
};  