import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { createClient } from "redis";

import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";
import { newHandlerGoogleService } from "./handlers/place";
import { Client } from "@googlemaps/google-maps-services-js";
import { newGoogleApiService } from "./services/googleService";
import { newRepositoryUser } from "./repositories/user";
import { newHandlerUser } from "./handlers/user";
import { newRepositoryBlacklist } from "./repositories/blacklist";

import { HandlerMiddleware } from "./auth/jwt";

async function main() {
  const db = new PrismaClient();
  const googlePlaceClient = new Client();

  // redis://host:port
  const redisHost = process.env.REDIS_HOST;
  const redisPort = process.env.REDIS_PORT;
  const redis = createClient({ url: `redis://${redisHost}:${redisPort}` });

  try {
    redis.connect();
    db.$connect();
  } catch (err) {
    console.error(err);
    return;
  }

  const repoContent = newRepositoryContent(db);
  const handlerContent = newHandlerContent(repoContent);

  const googleApiService = newGoogleApiService(googlePlaceClient);
  const handlerGoogleService = newHandlerGoogleService(googleApiService);

  const repoUser = newRepositoryUser(db);
  const repoBlacklist = newRepositoryBlacklist(redis);
  const handlerUser = newHandlerUser(repoUser, repoBlacklist);

  const handlerMiddleware = new HandlerMiddleware(repoBlacklist);

  const port = process.env.PORT || 8000;
  const server = express();

  server.use(express.json());

  server.use(cors());

  const userRouter = express.Router();
  const contentRouter = express.Router();
  const serviceRouter = express.Router();
  const productRouter = express.Router();

  server.use("/user", userRouter);
  server.use("/product", productRouter);
  server.use("/content", contentRouter);
  server.use("/service", serviceRouter);

  //Check server status
  server.get("/", (_, res) => {
    return res.status(200).json({ status: "ok" }).end();
  });

  // User API
  userRouter.post("/register", handlerUser.register.bind(handlerUser));
  userRouter.post("/login", handlerUser.login.bind(handlerUser));
  userRouter.get(
    "/logout",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerUser.logout.bind(handlerUser)
  );

  // Content API
  contentRouter.post(
    "/",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.createContent.bind(handlerContent)
  );
  contentRouter.get("/", handlerContent.getContents.bind(handlerContent));
  contentRouter.get("/:id", handlerContent.getContentById.bind(handlerContent));
  contentRouter.patch(
    "/update/:id",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.updateUserContent.bind(handlerContent)
  );

  //Product API
  productRouter.post(
    "/",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.createProduct.bind(handlerContent)
  );
  productRouter.get("/", handlerContent.getProducts.bind(handlerContent));
  productRouter.get("/:id", handlerContent.getProductbyId.bind(handlerContent));
  productRouter.patch(
    "/update/:id",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.updateUserProduct.bind(handlerContent)
  );

  // Google Service API
  serviceRouter.get(
    "/places/search",
    handlerGoogleService.getPlaceIdandPlaceDetail.bind(handlerGoogleService)
  );

  server.listen(port, () => console.log(`server is listening on ${port}`));
}

main();
