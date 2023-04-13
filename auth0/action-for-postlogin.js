const axios = require("axios");

/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {

  if(event.user.app_metadata.userKey) {
    api.idToken.setCustomClaim("userKey", event.user.app_metadata.userKey);
    return;
  }

  // todo: Drits に user を登録する

  const { LAMBDA_ENDPOINT: url } = event.secrets
  const response = await fetchUserKey(url, event.user.user_id);

  // todo: lambdaのレスポンスのハンドリング
  const { userKey } = response.data;
  api.user.setAppMetadata("userKey", userKey);
  api.idToken.setCustomClaim("userKey", userKey);

  return
};

const fetchUserKey = async (url, user_id) => {
  return await axios.get(
    url,
    {
      params: {
        user_id
      }
    }
  );
}


/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };
