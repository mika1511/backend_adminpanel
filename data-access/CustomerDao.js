const AWS = require('aws-sdk');
require('dotenv').config();
const http = require('http');
const ULID = require('ulid')

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

const CASES_TABLE = "Cases"

const intializeCases = async ({user_id,issue_type,issue_details,support_chat_id}) => {
    
    const item ={
        case_id : ULID.ulid(),
        ticketRef_number: ULID.ulid(),
        assignee : {},
        reporter : user_id,
        create_ts :Date.now(),
        updated_ts:Date.now(),
        ETA :9,
        status:"",
        issue_type :issue_type,
        issue_details:issue_details,
        support_chat_id:support_chat_id,
        tasks:[]
        
    }
    const params = {
        TableName: CASES_TABLE,
        Item: item,
        
    }
    const data = await dynamoClient.put(params).promise()
    console.log(item);
    return item
}


const intializeTasks = async ({user_id,issue_type,issue_details,support_chat_id}) => {
    
    const item ={
        case_id : ULID.ulid(),
        ticketRef_number: ULID.ulid(),
        assignee : {},
        reporter : user_id,
        create_ts :Date.now(),
        updated_ts:Date.now(),
        ETA :9,
        status:"",
        issue_type :issue_type,
        issue_details:issue_details,
        support_chat_id:support_chat_id,
        tasks:
        {
            task_id: ULID.ulid(),
            case_id: ULID.ulid(),
            ETA :10,
            status:"",
            assignee:{},
            task_details :"",
            create_ts:"",
            updated_ts:"",
        
        }
    }
    const params = {
        TableName: CASES_TABLE,
        Item: item,
        
    }
    const data = await dynamoClient.put(params).promise()
    console.log(item);
    return item
}

const getTaskById = async (task_id) => {
    const params = {
        TableName: CASES_TABLE,
        Key: {
            task_id
        }
    };
    const data = await dynamoClient.get(params).promise();
    console.log(data);
    return data.Item;
};

const getALLCases =async()=>{
    
    const params={
        TableName:CASES_TABLE,
    }
    data= await dynamoClient.scan(params).promise();
    return data.Items
};
const getALLTasks =async()=>{
    
    const params={
        TableName:CASES_TABLE,
    }
    data= await dynamoClient.scan(params).promise();
    return data.Items
};

const getCaseById = async (case_id) => {
    const params = {
        TableName: CASES_TABLE,
        Key: {
            case_id
        }
    };
    const data = await dynamoClient.get(params).promise();
    console.log(data);
    return data.Item;
};

module.exports = {
    intializeCases,
    getALLCases,
    getCaseById,
    intializeTasks,
    getTaskById,
    getALLTasks
    
};  