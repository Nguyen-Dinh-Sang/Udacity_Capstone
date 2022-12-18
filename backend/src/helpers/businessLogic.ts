import { v4 as uuidv4 } from 'uuid';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createTodo, getTodosForUser, updateTodo, deleteTodo, createAttachmentPresignedUrl } from './todos';

export async function createTodoBL(model: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const newTodo = {
        todoId : uuidv4(),
        createdAt : new Date().toISOString(),
        done : false,
        userId : userId,
        name : model.name,
        dueDate : model.dueDate
    } as TodoItem;

    return await createTodo(newTodo);
}

export async function getTodosForUserBL(userId: string): Promise<any> {
    return await getTodosForUser(userId);
}

export async function createAttachmentPresignedUrlBL(todoId: string, userId: string): Promise<string> {
    return await createAttachmentPresignedUrl(todoId, userId);
}

export async function updateTodoBL(todoId: string, userId: string, model: UpdateTodoRequest) {
    await updateTodo(todoId, userId, model);
}

export async function deleteTodoBL(todoId: string, userId: string) {
    await deleteTodo(todoId, userId);
}