import { CloudWatchLogsEvent } from "aws-lambda";
import BaseHandler from "./BaseHandler";

export class RotateSecretsOneHandler extends BaseHandler {
  constructor() {
    super();
  }

  handleRequest = async (event: CloudWatchLogsEvent): Promise<void> => {
    try {
      if (!event.awslogs || !event.awslogs.data) return;
      await this.manageSecret(event, "one");
      // emit a message to SNS if you like or trigger GH actions redeployment if required.
    } catch (error) {
      // log the error or emit to SNS
    }
  };
}

export const handler = new RotateSecretsOneHandler().handler;
