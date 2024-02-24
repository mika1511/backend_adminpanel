const AWS = require('aws-sdk');
require('dotenv').config();
const http = require('http');
const ULID = require('ulid')
const { invalidParameter, invalidOperation } = require('../utils/ErrorUtils');
const { open } = require('fs');

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

const intializeCases = async ({issue_type,issue_details,support_chat_id,user_id}) => {
    
    const item ={
        case_id : ULID.ulid(),
        ticketRef_number: ULID.ulid(),
        assignee : {},
        reporter : user_id,
        create_ts :Date.now(),
        updated_ts:Date.now(),
        ETA :9,
        status:"open",
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


const intializeTasks = async ({case_id,agent_id,user_id,ticketRef_number,issue_details,issue_type,support_chat_id}) => {

    const item ={
        case_id : case_id,
        ticketRef_number: ticketRef_number,
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
            ETA :"",
            status:"",
            task_details :"solving the issue",
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
        UpdateExpression: "set assignee = :assignee ,  #status=:status" ,
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':assignee': value , ':status':"ack" },
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

const getAllAgentCases = async ({assignee}) => {
    const params = {
        TableName: CASES_TABLE,
        IndexName: "assignee-status-index",
        KeyConditionExpression: "assignee = :assignee and #s= :status",
        ExpressionAttributeNames: { 
            "#s": "status" 
        },
        ExpressionAttributeValues: {
            ":assignee": assignee,
            ":status": "closed"
        }
    }
    const agentCases = await dynamoClient.query(params).promise()

    return agentCases.Items[0]
}
const getAllCasesByStatus = async ({status}) => {
    const params = {

        TableName: CASES_TABLE,
        IndexName: "status-index",
        KeyConditionExpression: "#s = :status", 
        ExpressionAttributeNames: { 
            "#s": "status" 
        },
        ExpressionAttributeValues: {
            ":status": status
        },
    }
    const openCases = await dynamoClient.query(params).promise()
    return openCases.Items
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
    updateStatus,
    getAllCasesByStatus,
    getAllAgentCases
    
};  