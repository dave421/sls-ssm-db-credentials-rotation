import { CloudWatchLogsEvent } from "aws-lambda";
import BaseHandler from "./BaseHandler";

export class RotateSecretsTwoHandler extends BaseHandler {
  constructor() {
    super();
  }

  handleRequest = async (event: CloudWatchLogsEvent): Promise<void> => {
    try {
      if (!event.awslogs || !event.awslogs.data) return;
      await this.manageSecret(event, "two");
      // emit a message to SNS if you like or trigger GH actions redeployment if required.
    } catch (error) {
      // log the error or emit to SNS
    }
  };
}

export const handler = new RotateSecretsTwoHandler().handler;
