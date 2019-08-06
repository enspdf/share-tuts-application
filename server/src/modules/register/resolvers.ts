import * as yup from 'yup';
import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { emailNotLongEnough, passwordNotLongEnough } from './errorMessages';

const schema = yup.object().shape({
    email: yup
        .string().min(3, emailNotLongEnough).max(255),
    password: yup.string().min(3, passwordNotLongEnough).max(255)
});

export const resolvers: ResolverMap = {
    Query: {
        bye: () => 'bye'
    },
    Mutation: {
        register: async (_,
            args: GQL.IRegisterOnMutationArguments, { url }) => {
            try {
                await schema.validate(args, { abortEarly: false });
            } catch (err) {
                return;
            }

            const { email, password } = args;

            const userAlreadyExists = await User.findOne({
                where: { email },
                select: ['id']
            });

            if (userAlreadyExists) {
                return [{
                    path: 'email',
                    message: url
                }];
            }

            const user = User.create({
                email, password
            });

            await user.save();

            return null;
        }
    }
};