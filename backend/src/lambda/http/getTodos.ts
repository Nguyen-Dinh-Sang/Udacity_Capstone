import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getTodosForUser } from '../../BusinessLogic/todos';
import { getUserId } from '../utils';

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const userId = getUserId(event);
      const response = {
        statusCode: 200,
        body: JSON.stringify({
            "items": await getTodosForUser(userId)
        }),
      };
      return response;
    }
)

handler.use(
  cors({
    credentials: true
  })
)
