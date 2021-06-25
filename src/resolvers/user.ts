import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  Field,
  ObjectType,
  Query,
} from 'type-graphql';
import { MyContext } from 'src/types';
import { User } from '../entities/User';
import argon2 from 'argon2';
import {
  COKKIE_NAME,
  FORGET_PASSWORD_PREFIX,
  PROD_CLIENT_URL,
} from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { v4 } from 'uuid';
import { sendMail } from '../utils/sendEmail';
import { getConnection } from 'typeorm';

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return User.findOne({ id: req.session.userId });
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 1 //   1 day expiration
    );

    const html = `<a href="${PROD_CLIENT_URL}/change-password/${token}">${PROD_CLIENT_URL}/change-password/${token}</a>`;
    await sendMail(user.email, html);

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length < 3) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'Password must be 3 character!',
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;

    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Token expired!',
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne({ id: userIdNum });

    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'User does not exist!',
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(key);

    // login after successfull chages
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    const hashPassword = await argon2.hash(options.password);
    let user;
    try {
      // await User.create({ username, email, password }).save()
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashPassword,
        })
        .returning('*')
        .execute();

      user = result.raw[0];
    } catch (err) {
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'Username already taken!!',
            },
          ],
        };
      }
    }

    // login after successfull registration
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes('@')
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: 'Username doesn"t exist!',
          },
        ],
      };
    }
    const valid = await argon2.verify(user?.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Invalid password!',
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          resolve(false);
          return;
        }
        // remove the cookie
        res.clearCookie(COKKIE_NAME);
        resolve(true);
      });
    });
  }
}
