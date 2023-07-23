import { AppRequest, WithUser, Empty, IHandlerUser } from ".";
import { Response } from "express";
import { IRepositoryBlacklist } from "../repositories/blacklist";
import { IRepositoryUser } from "../repositories/user";
import { compareHash, hashPassword } from "../auth/bcrypt";
import { JwtAuthRequest, Payload, newJwt } from "../auth/jwt";

export function newHandlerUser(
  repoUser: IRepositoryUser,
  repoBlacklist: IRepositoryBlacklist
): IHandlerUser {
  return new HandlerUser(repoUser, repoBlacklist);
}

class HandlerUser implements IHandlerUser {
  private repoUser: IRepositoryUser;
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repoUser: IRepositoryUser, repoBlacklist: IRepositoryBlacklist) {
    this.repoUser = repoUser;
    this.repoBlacklist = repoBlacklist;
  }

  async register(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, name, password } = req.body;
    if (!username || !name || !password) {
      return res
        .status(400)
        .json({ error: "missing username name, username or password" })
        .end();
    }

    return this.repoUser
      .createUser({ username, name, password: await hashPassword(password) })
      .then((user) =>
        res
          .status(201)
          .json({ ...user, password: undefined })
          .end()
      )

      .catch((err) => {
        const errMsg = `failed to create user $${username}`;
        console.error(`${errMsg} : ${err}`);
        return res.status(500).json({ error: errMsg }).end();
      });
  }

  async login(
    req: AppRequest<Empty, WithUser>,
    res: Response
  ): Promise<Response> {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "missing username or password" })
        .end();
    }

    try {
      const user = await this.repoUser.getUser(username);
      const isMatch = await compareHash(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ error: "invalid username or password" })
          .end();
      }

      const payload: Payload = { id: user.id, username: user.username };
      const token = newJwt(payload);

      return res
        .status(200)
        .json({
          status: "logged in",
          id: user.id,
          username,
          token,
        })
        .end();
    } catch (err) {
      console.error(`failed to get user : ${err}`);
      return res.status(500).end();
    }
  }

  async logout(req: JwtAuthRequest, res: Response): Promise<Response> {
    return await this.repoBlacklist
      .addToBlacklist(req.token)
      .then(() =>
        res.status(200).json({ status: `logged out`, token: req.token }).end()
      )
      .catch((err) => {
        console.error(err);
        return res
          .status(500)
          .json({ error: `could not log out with token ${req.token}` })
          .end();
      });
  }
}
