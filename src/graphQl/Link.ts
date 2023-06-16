import { booleanArg, extendType, intArg, nonNull, objectType, stringArg } from "nexus";

export const ToDo = objectType({
    name: 'ToDo',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.string('description');
        t.nonNull.string('title');
        t.nonNull.boolean('complete');
    }
})
export const getQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.nonNull.field('feed', {
            type: 'ToDo', 
            resolve(parent, args, context, info) {
                return context.prisma.toDo.findMany();
            }
        })
    }
})

export const addMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('post', {
            type: 'ToDo',
            args: {
                description: nonNull(stringArg()),
                title: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                const newLink = context.prisma.toDo.create({
                    data: {
                        description: args.description,
                        title: args.title,
                        complete: false,
                    },
                });
                return newLink;
            }
        })
    }
})

export const deleteMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('delete', {
            type: 'ToDo',
            args: {
                id: nonNull(intArg()),
            },
            resolve(parent, args, context) {
                const { id } = args;
                const link = context.prisma.toDo.findUnique({ where: { id } })
                if (!link) {
                    throw new Error(`link with ${ id } is not found`)
                }
                const deleteLink = context.prisma.toDo.delete({ where: { id }, })
                    return deleteLink;
            }
        })
    }
})

export const updateMutation = extendType({
    type: 'Mutation',
    definition(t) {
      t.field('update', {
        type: 'ToDo',
        args: {
          id: nonNull(intArg()),
        },
        resolve: async (parent, args, context) => {
          const { id } = args;
  
          const todo = await context.prisma.toDo.findUnique({
            where: { id },
          });
          if (!todo) {
            return null;
          }
          const updatedTodo = await context.prisma.toDo.update({
            where: { id },
            data: {
              complete: true,
            },
          });
          return updatedTodo;
        },
      });
    },
  });
  