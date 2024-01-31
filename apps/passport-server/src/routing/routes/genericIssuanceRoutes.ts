import {
  GenericIssuanceCheckInRequest,
  GenericIssuanceCheckInResponseValue,
  GenericIssuanceSendEmailResponseValue,
  PollFeedRequest,
  PollFeedResponseValue
} from "@pcd/passport-interface";
import cookieParser from "cookie-parser";
import express from "express";
import { GenericIssuanceService } from "../../services/generic-issuance/genericIssuanceService";
import { GlobalServices } from "../../types";
import { logger } from "../../util/logger";
import { checkUrlParam } from "../params";
import { PCDHTTPError } from "../pcdHttpError";

export function initGenericIssuanceRoutes(
  app: express.Application,
  { genericIssuanceService }: GlobalServices
): void {
  logger("[INIT] initializing generic issuance routes");
  app.use(cookieParser());
  app.use(express.json());

  /**
   * Throws if we don't have an instance of {@link GenericIssuanceService}.
   */
  function checkGenericIssuanceServiceStarted(
    issuanceService: GenericIssuanceService | null
  ): asserts issuanceService {
    if (!issuanceService) {
      throw new PCDHTTPError(503, "generic issuance service not instantiated");
    }
  }

  app.get("/generic-issuance/status", async (req, res) => {
    if (genericIssuanceService) {
      res.send("started");
    } else {
      res.send("not started");
    }
  });

  app.post(
    "/generic-issuance/api/poll-feed/:pipelineID",
    async (req: express.Request, res: express.Response) => {
      checkGenericIssuanceServiceStarted(genericIssuanceService);
      const pipelineID = checkUrlParam(req, "pipelineID");
      const request = req.body as PollFeedRequest;
      const result = await genericIssuanceService.handlePollFeed(
        pipelineID,
        request
      );
      res.send(result satisfies PollFeedResponseValue);
    }
  );

  app.post(
    "/generic-issuance/api/check-in/:pipelineID",
    async (req: express.Request, res: express.Response) => {
      checkGenericIssuanceServiceStarted(genericIssuanceService);
      const pipelineID = checkUrlParam(req, "pipelineID");
      const request = req.body as GenericIssuanceCheckInRequest;
      const result = await genericIssuanceService.handleCheckIn(
        pipelineID,
        request
      );
      res.send(result satisfies GenericIssuanceCheckInResponseValue);
    }
  );

  app.post(
    "/generic-issuance/api/user/send-email/:email",
    async (req: express.Request, res: express.Response) => {
      checkGenericIssuanceServiceStarted(genericIssuanceService);
      const result = await genericIssuanceService.sendLoginEmail(
        checkUrlParam(req, "email")
      );
      res.send(result satisfies GenericIssuanceSendEmailResponseValue);
    }
  );

  app.get(
    "/generic-issuance/api/pipelines",
    async (req: express.Request, res: express.Response) => {
      checkGenericIssuanceServiceStarted(genericIssuanceService);
      const { id } =
        await genericIssuanceService.authenticateStytchSession(req);
      res.send(genericIssuanceService.getUserPipelines(id));
    }
  );

  app.post(
    "/generic-issuance/api/pipelines",
    async (req: express.Request, res: express.Response) => {
      checkGenericIssuanceServiceStarted(genericIssuanceService);
      const { id } =
        await genericIssuanceService.authenticateStytchSession(req);
      // TODO: Validate req.body
      console.log("body", req.body, { id });
      await genericIssuanceService.createPipeline(req.body);
      const pipelines = await genericIssuanceService.getUserPipelines(id);
      console.log({ pipelines });
      res.send(pipelines);
    }
  );

  // temporary -- just for testing JWT authentication
  app.get(
    "/generic-issuance/api/user/ping",
    async (req: express.Request, res: express.Response) => {
      checkGenericIssuanceServiceStarted(genericIssuanceService);
      await genericIssuanceService.authenticateStytchSession(req);
      res.json("pong");
    }
  );
}