const { HttpRequest } = require('@aws-sdk/protocol-http');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { Sha256 } = require('@aws-crypto/sha256-universal');
const axios = require("axios");

/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {

  const USER_KEY = "userKey";

  if(event.user.app_metadata.userKey) {
    api.idToken.setCustomClaim(USER_KEY, event.user.app_metadata.userKey);
    return;
  }

  // todo: Drits に user を登録する

  const { LAMBDA_URL, ACCESS_KEY_ID, SECRET_ACCESS_KEY, SERVICE, REGION } = event.secrets;
  const { user_id } = event.user;
  const signatureV4 = generateSignatureV4(SERVICE, REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY, Sha256);
  const httpRequest = generateHttpRequest(new URL(LAMBDA_URL), user_id);
  const signedRequest = await signatureV4.sign(httpRequest);

  const response = await axios.get(LAMBDA_URL, {
    headers: signedRequest.headers,
    params: { user_id }  
  });
    
  const { userKey } = response.data;
  api.user.setAppMetadata(USER_KEY, userKey);
  api.idToken.setCustomClaim(USER_KEY, userKey);

  return;
};

const generateSignatureV4 = (service, region, accessKeyId, secretAccessKey, Sha256) => {
  return new SignatureV4({
    service,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    sha256: Sha256,
  });
};

const generateHttpRequest = (url, user_id) => {
  return new HttpRequest({
    method: 'GET',
    hostname: url.hostname,
    query: { user_id },
    headers: {
      'content-type': 'application/json',
      host: url.hostname,
    },
    path: url.pathname,
  });
};


/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };
