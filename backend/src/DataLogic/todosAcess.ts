import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

export class TodosAccess {
    private documentClient : DocumentClient = new XAWS.DynamoDB.DocumentClient();
    private todoListTable = process.env.TODOS_TABLE;

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.documentClient.put({
            TableName: this.todoListTable,
            Item: todo
        }).promise()

        return todo;
    }

    async deleteTodo(todoId: string, userId: string) {
        await this.documentClient.delete({
            TableName: this.todoListTable,
            Key: {
                todoId: todoId,
                userId: userId
            },
        }).promise();
    }

    async createImageUrl(todoId: string, userId: string) {
        const attachmentUrl = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`;
        await this.documentClient.update({
            TableName: this.todoListTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": attachmentUrl,
            },
        }).promise();
    }

    async getTodoList(userId: string): Promise<TodoItem[]> {
        const query = await this.documentClient.query({
            TableName: process.env.TODOS_TABLE,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        const items = query.Items;
        return items as TodoItem[];
    }

    async updateTodo(todoId: string, userId: string, data: TodoUpdate): Promise<TodoUpdate> {
        await this.documentClient.update({
            TableName: this.todoListTable,
            Key: {
                todoId: todoId,
                userId: userId
            },
            UpdateExpression: "set #n = :n, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ":n": data.name,
                ":dueDate": data.dueDate,
                ":done": data.done,
            },
            ExpressionAttributeNames: { '#n': "name" }
        }).promise();

        return data;
    }
}