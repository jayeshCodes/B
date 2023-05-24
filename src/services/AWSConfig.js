// import { S3Client } from "@aws-sdk/client-s3";
import * as AWS from "@aws-sdk/client-cognito-identity-provider";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { REACT_APP_AWS_REGION, REACT_APP_AWS_ACCESS_KEY_ID, REACT_APP_AWS_SECRET_ACCESS_KEY } from "@env";

const creds = {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
};

// export const s3 = new S3Client({
//     region: Config.REACT_APP_AWS_REGION,
//     credentials: creds
// });

export const cognito = new AWS.CognitoIdentityProviderClient({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: creds
});