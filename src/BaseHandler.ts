import { CloudWatchLogsEvent } from "aws-lambda";
import * as zlib from "zlib";
import {
  SecretsManagerClient,
  UpdateSecretCommand,
} from "@aws-sdk/client-secrets-manager";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default abstract class BaseHandler {
  protected abstract handleRequest(req: unknown): Promise<any>;
  protected _secretsManager: SecretsManagerClient;

  constructor() {
    this._secretsManager = new SecretsManagerClient({ region: "eu-west-2" });
  }

  protected manageSecret = async (
    event: CloudWatchLogsEvent,
    oneOrTwo: string
  ) => {
    try {
      if (!event.awslogs || !event.awslogs.data) return;

      // decode event
      const base64Data = event.awslogs.data;

      const payload = Buffer.from(base64Data, "base64");

      const logevents = JSON.parse(
        zlib.unzipSync(payload).toString()
      ).logEvents;

      // loop the log events, if we find the string `Successfully set AWSCURRENT stage to version` in the message, we know the secret has been rotated
      // if the secret has been rotated, we can update the active user in the active-database-user secret
      for (const logevent of logevents) {
        if (
          logevent.message.includes(
            "Successfully set AWSCURRENT stage to version"
          )
        ) {
          const ts = new Date().getTime();
          await this._secretsManager.send(
            new UpdateSecretCommand({
              SecretId: `elysium-demo/dev/active-database-user`,
              SecretString: JSON.stringify({
                activeUser: oneOrTwo,
                timestamp: ts,
                rotatedAt: dayjs(ts).toISOString(),
                rotatedAtUTC: dayjs(ts).utc().toISOString(),
                becomesLiveAt: dayjs(ts).add(90, "minutes").toISOString(),
              }),
            })
          );
        }
      }
    } catch (error) {
      // log the error or emit to SNS
      console.error(error);
    }
  };

  failed = (error: Error): string => {
    return JSON.stringify({
      name: error.name,
      message: error.message,
      status: error.stack,
    });
  };

  handler = async (req: any): Promise<unknown> => {
    try {
      const resp = await this.handleRequest(req);
      return JSON.stringify(resp);
    } catch (err: any) {
      await this.errorHandler(err);
    }
  };

  protected async errorHandler(err: Error): Promise<void> {
    throw this.failed(new Error(JSON.stringify(err)));
  }
}
