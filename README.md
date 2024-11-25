# SLS SSM DB Credentials Rotation

This repository demonstrates a practical implementation of automatic rotation of Amazon RDS database credentials using AWS Systems Manager (SSM), AWS Secrets Manager, and the Serverless Framework.

Building on the connection repo [sls-ssm-knex-config-ssm](https://github.com/dave421/sls-ssm-knex-config-ssm).

## Overview

The project showcases a secure and efficient method to automate credential rotation for RDS databases, reducing the risks associated with static credentials. It utilizes AWS Lambda to handle the rotation process and updates credentials in AWS Secrets Manager and SSM Parameter Store.

## Key Features

- **Serverless Framework Integration:** Easily deploy AWS Lambda functions and other AWS resources.
- **Automatic Credential Rotation:** Updates RDS database credentials without manual intervention.
- **Secrets Manager Integration:** Ensures credentials are securely managed and updated.
- **Error Handling & Logging:** Provides robust mechanisms for monitoring and debugging.

---

## Project Structure

### `src/BaseHandler.ts`

Defines an abstract base class, `BaseHandler`, to standardize Lambda functions in the credential rotation process.

- **Abstract Method `handleRequest`:** Designed to be implemented by subclasses for specific processing.
- **AWS Secrets Manager Integration:** Facilitates interactions with AWS Secrets Manager.
- **Secret Management:** Manages and updates credentials based on CloudWatch log events.
- **Error Handling:** Includes methods like `failed` and `errorHandler` for consistent error management.

---

### `src/RotateSecretsOneHandler.ts`

Implements the `BaseHandler` class to handle the rotation of credentials for the first RDS instance.

- **Core Responsibilities:**
  - Generates new credentials.
  - Updates AWS Secrets Manager and SSM.
  - Applies new credentials to the RDS instance.

---

### `src/RotateSecretsTwoHandler.ts`

Implements the `BaseHandler` class to manage credentials for a second RDS instance.

- **Core Responsibilities:**
  - Similar functionality to `RotateSecretsOneHandler` but targets a different RDS instance or use case.

---

### `serverless.yml`

Defines the infrastructure and resources for deployment using the Serverless Framework.

- **Lambda Functions:** Configures and deploys the rotation handlers (`RotateSecretsOneHandler` and `RotateSecretsTwoHandler`).
- **IAM Roles:** Grants necessary permissions for Lambda functions to access AWS Secrets Manager, SSM, and RDS.
- **Triggers:** Specifies CloudWatch events or manual triggers for invoking credential rotation.

---

## Deployment

### Prerequisites

- Node.js and npm/yarn installed.
- AWS CLI configured with appropriate permissions.
- Serverless Framework installed globally.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/dave421/sls-ssm-db-credentials-rotation.git
   cd sls-ssm-db-credentials-rotation
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Deploy the stack:
   ```bash
   serverless deploy
   ```

---

## Usage

The deployed Lambda functions can be triggered manually or via CloudWatch events to rotate credentials for the associated RDS instances. These credentials are updated in Secrets Manager and SSM Parameter Store.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgements

Special thanks to the AWS community and Serverless Framework contributors for their valuable resources.
