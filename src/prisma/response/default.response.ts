import { applyDecorators } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiCustomResponseArray = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `PageResponseOf${model.name}`, // 👈 add title to the schema
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                title: `DataOf${model.name}`, // 👈 add title to the schema
                items: {
                  $ref: getSchemaPath(model),
                },
              },
              total: {
                type: 'number',
                title: `TotalOf${model.name}`,
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiCustomResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `PageResponseOf${model.name}`, // 👈 add title to the schema
        allOf: [
          {
            properties: {
              data: {
                type: 'object',
                title: `DataOf${model.name}`, // 👈 add title to the schema
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};
