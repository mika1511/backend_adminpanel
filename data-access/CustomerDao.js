const AWS = require('aws-sdk');
require('dotenv').config();
const http = require('http');
const ULID = require('ulid')
const { invalidParameter, invalidOperation } = require('../utils/ErrorUtils');

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


const intializeTasks = async ({task_details,agent_id}) => {
    
    const item ={
        case_id : ULID.ulid(),
        ticketRef_number: ULID.ulid(),
        assignee : agent_id,
        reporter : user_id,
        create_ts :Date.now(),
        updated_ts:Date.now(),
        ETA :9,
        status:"",
        issue_type :issue_type,
        issue_details:issue_details,
        support_chat_id:support_chat_id,
        tasks:[
        {
            task_id: ULID.ulid(),
            case_id: case_id,
            ETA :"",
            status:"",
            assignee:{},
            task_details :task_details,
            create_ts:Date.now(),
            updated_ts:Date.now(),
        
        }]
    }
    const params = {
        TableName: CASES_TABLE,
        Item: item,
        
    }
    const data = await dynamoClient.put(params).promise()
    console.log(item);
    return item
}

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

const updateAssignee = async ({case_id, value}) => {

    const params = {
        TableName: CASES_TABLE,
        Key: {
            case_id
        },
        UpdateExpression: "set assignee = :assignee" ,
        ExpressionAttributeValues: { ':assignee': value },
        ReturnValues: "ALL_NEW",
    }
    const resp = await dynamoClient.update(params).promise()
    return await resp.Attributes || {}
}  
const updateStatus = async ({case_id, value}) => {

    const params = {
        TableName: CASES_TABLE,
        Key: {
            case_id
        },
        UpdateExpression: "set #status = :status", 
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': value },
        ReturnValues: "ALL_NEW",

    }
    const resp = await dynamoClient.update(params).promise()
    return await resp.Attributes || {}
}  

const casePatchHandler = ({ case_id, op, path ,value}) => {
    switch (op) {
        case 'ADD': return Handler({ case_id ,path ,value});
        case 'REPLACE': return Handler({ case_id ,path , value });
        default:
            throw { name: 'INVALID_PARAM', message: invalidParameter(toString({ op })) };

    }
}
const Handler = ({ case_id , path , value }) => {
    switch (path) {
        case 'assignee': return updateAssignee({case_id,value});
        case 'status': return updateStatus({case_id,value}) ;
        default:
            throw { name: 'INVALID_PARAM', message: invalidParameter(toString({ path })) }
    }
}

module.exports = {
    intializeCases,
    getALLCases,
    getCaseById,
    intializeTasks,
    getTaskById,
    getALLTasks,
    updateAssignee,
    casePatchHandler,
    updateStatus
    
};  