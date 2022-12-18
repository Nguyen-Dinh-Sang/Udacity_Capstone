import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { getUserId } from '../utils';
import { updateTodo } from '../../BusinessLogic/todos';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event);
    return {
      statusCode: 204,
      body: JSON.stringify({
        "item": await updateTodo(todoId, userId, updatedTodo)
      }),
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
