import { v4 as uuidv4 } from 'uuid';
import { TodosAccess } from '../DataLogic/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { AttachmentUtils } from '../helpers/attachmentUtils';
const attachmentUtils = new AttachmentUtils();
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

export async function createTodo(model: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const newTodo = {
        todoId : uuidv4(),
        createdAt : new Date().toISOString(),
        done : false,
        userId : userId,
        name : model.name,
        dueDate : model.dueDate
    } as TodoItem;

    return await new TodosAccess().createTodo(newTodo);
}

export async function getTodosForUser(userId: string): Promise<any> {
    return await new TodosAccess().getTodoList(userId);
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    await new TodosAccess().createImageUrl(todoId, userId);
    return await attachmentUtils.getImageUrl(todoId);
}

export async function updateTodo(todoId: string, userId: string, model: UpdateTodoRequest) {
    await new TodosAccess().updateTodo(todoId, userId, model)
}

export async function deleteTodo(todoId: string, userId: string) {
    await new TodosAccess().deleteTodo(todoId, userId)
}