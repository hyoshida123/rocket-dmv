const docusign = require('docusign-esign');
const path = require('path');
const apiClient = new docusign.ApiClient();

let accountId = 'e32318d9-7c98-4adb-bf32-746edc3317a8';

const bearerToken = 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQgAAAABAAUABwAAXHZass7VSAgAAMQ6vLrO1UgCAKIhy8IofvRBpmDvnvIXrUsVAAEAAAAYAAEAAAAFAAAADQAkAAAAODAyYzNmZmUtOTM0Yy00M2I3LTljZGItNGMzZTA2NTZmZjU0IwAkAAAAODAyYzNmZmUtOTM0Yy00M2I3LTljZGItNGMzZTA2NTZmZjU0.OSPH2ihD0Ehc0cA0kxHfy0Fup6ttzWCmAybxKlr5_7sZZKqZJZ4MtLrsU44nJCnm4HoKUtBMfFV_MnX7Ag5qLJsdjH5M5pvWN-WaYSWmQk2G-hIaURVB-2ss3urQM-0wcLJwFmcme4bnv_USKi67-WWDne7KDqrggB2o2thu91kIUXhEWtKfjHuxmjBgU5o5MXRbIx540PPlAJMPghZJTqKLpRrOvE55sI6MDU_Gq-_T_KUWIK_L2dZdwrN4vFobXG14NvmhiMKidpmsEnZVx2xZaGSIamSrLgjqZUM_tw7SzzaeUWUlRoAZnAGB_GeAwpGt1zFF5OaNJWACx23Ang';
const integratorKey = '802c3ffe-934c-43b7-9cdb-4c3e0656ff54';
const baseUrl = 'https://demo.docusign.net/restapi';
const userId = 'c2cb21a2-7e28-41f4-a660-ef9ef217ad4b';
const oAuthBaseUrl = 'account-d.docusign.com';
const redirectURI = 'https://www.docusign.com/api';
const privateKeyFilename = 'keys/docusign_private_key.txt';

module.exports = {
  getAccountListStatus: (callback) => {
    module.exports.getBearerToken(() => {
      // https://developers.docusign.com/esign-rest-api/code-examples/polling-for-envelope-status
      // Instantiate a new EnvelopesApi
      const envelopesApi = new docusign.EnvelopesApi();

      // The list status changes call requires at least a from_date OR
      // a set of envelopeIds. here we filter using a from_date
      const options = {};

      // Set from date to filter envelopes (ex: Jan 15, 2018)
      options.fromDate = '2018/10/06';

      // Call the listStatusChanges() API
      envelopesApi.listStatus(accountId, options, function (error, data, response) {
        if (error) {
          callback('Error: ' + error, null);
          return;
        }
        if (data) {
          callback(null, data);
        }
      });
    });
  },
  getBearerToken: (callback) => {
    apiClient.setBasePath(baseUrl);
    // assign the api client to the Configuration object
    docusign.Configuration.default.setDefaultApiClient(apiClient);

    // IMPORTANT NOTE:
    // the first time you ask for a JWT access token, you should grant access by making the following call
    // get DocuSign OAuth authorization url:
    var oauthLoginUrl = apiClient.getJWTUri(integratorKey, redirectURI, oAuthBaseUrl);
    // open DocuSign OAuth authorization url in the browser, login and grant access
    // END OF NOTE

    // configure the ApiClient to asynchronously get an access to token and store it

    apiClient.configureJWTAuthorizationFlow(path.resolve(__dirname, privateKeyFilename), oAuthBaseUrl, integratorKey, userId, 3600, function (err, res) {
      if (!err && res.body && res.body.access_token) {
        apiClient.getUserInfo(res.body.access_token, function (err, userInfo) {
          const account = userInfo.accounts.filter(account => account.accountName === 'Cheetah DMV');
          if (account.length) {
            accountId = account[0].accountId;
            var baseUri = userInfo.accounts[0].baseUri;
            var accountDomain = baseUri.split('/v2');
            // below code required for production, no effect in demo (same domain)
            apiClient.setBasePath(accountDomain[0] + "/restapi");
            callback(null, null);
          }
          else {
            callback('Account not found', null);
          }
        });
      }
    });
  },
  sendEmailSignatureRequest: (template, callback) => {
    // template = {
    //   id: '',
    //   role: {
    //     roleName: '',
    //     name: '',
    //     email: '',
    //   },
    // }
    module.exports.getBearerToken(() => {
      const templateRoleName = 'Needs to sign';

      // create an envelope to be signed
      const envelope = new docusign.EnvelopeDefinition();
      envelope.emailSubject = 'Please Sign my Node SDK Envelope';
      envelope.emailBlurb = 'Hello, Please sign my Node SDK Envelope.';

      // / assign template information including ID and role(s)
      envelope.templateId = template.id;
      // envelope.templateId = '32a7dd00-5df7-431d-98f9-6269c7b4d9a7';

      // create a template role with a valid templateId and roleName and assign signer info
      let templateRole = new docusign.TemplateRole();
      templateRole = Object.assign(templateRole, template.role);
      // templateRole.roleName = 'Applicant';
      // templateRole.name = 'Oscar Shaw';
      // templateRole.email = 'oshaw587@insite.4cd.edu'

      // create a list of template roles and add our newly created role
      const templateRolesList = [];
      templateRolesList.push(templateRole);

      // assign template role(s) to the envelope
      envelope.templateRoles = templateRolesList;

      // send the envelope by setting |status| to "sent". To save as a draft set to "created"
      envelope.status = 'sent';

      const envelopesApi = new docusign.EnvelopesApi(apiClient);

      envelopesApi.createEnvelope(accountId, {'envelopeDefinition': envelope}, function (error, envelopeSummary, response) {
        if (error) {
          return callback(error, null);
        }
        if (envelopeSummary) {
          callback(null, envelopeSummary);
        }
      });
    });
  },
  signatureUpdateListener: (callback) => {
    module.exports.getBearerToken(() => {
      const checkForUpdates = () => {
        // https://developers.docusign.com/esign-rest-api/code-examples/polling-for-envelope-status
        // Instantiate a new EnvelopesApi
        const envelopesApi = new docusign.EnvelopesApi();

        // The list status changes call requires at least a from_date OR
        // a set of envelopeIds. here we filter using a from_date
        const options = {};

        // Set from date to filter envelopes (ex: Jan 15, 2018)
        options.fromDate = '2018/10/06';

        // Call the listStatusChanges() API
        envelopesApi.listStatusChanges(accountId, options, function (error, envelopes, response) {
          if (error) {
            callback('Error: ' + error, null);
            return;
          }
          if (envelopes) {
            callback(null, envelopes);
          }
        });
      }
      setTimeout(checkForUpdates, 900000); // 15 minutes, max frequency
    });
  }
};

// const accessToken = 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQgAAAABAAUABwCA1OYSoM7VSAgAgBQKIePO1UgCAKIhy8IofvRBpmDvnvIXrUsVAAEAAAAYAAEAAAAKAAAADQAkAAAAYWUzMGVhNGUtMzk1OS00ZDFjLWI4NjctZmNiNTdkMmRjNGRmMACAkd_an87VSA.RpN-OQN6uRsOGzBVtXfLR_915vPdlACx7IeacjyajLf8bG2ieLh0GJdK9dKUMJ9iiQ-_8f_Ey0ibVoOSYdv4sbrracvEmomOfIDAfXTZriCViUp-Ud62bet_olA69Y57pZpKqIv-i878GEaJ6odIzWDeEf5SXPj0If1xqsBRF9dJCWqCVOKVPGIJPcOP1scZjHsB0K_syhvjw0OV3P_Sh9qTIF3hK0j_wL9VpMDZDvCH2_lxbVrqJz4DyvZcnRO3pcPz5_RyUy9YBz2Erp1M7vCWIrxLA-K3MPmusnadMJymzQT8da_-jnvYTEr16ZRT0UERCdTlRIUnqtZSmsLpoA';
// // const accountId = 'c2cb21a2-7e28-41f4-a660-ef9ef217ad4b'

// apiClient.setBasePath('https://demo.docusign.net/restapi');

// module.exports = {
//   sendEmailSignatureRequest: (callback) => {
//     // create a new envelope object that we will manage the signature request through
//     const envelope = new docusign.EnvelopeDefinition();
//     envelope.emailSubject = 'Please sign this document sent from Node SDK';
//     envelope.templateId = '32a7dd00-5df7-431d-98f9-6269c7b4d9a7';

//     // create a template role with a valid templateId and roleName and assign signer info
//     const templateRole = new docusign.TemplateRole();
//     templateRole.roleName = 'Applicant';
//     templateRole.name = 'Oscar Shaw';
//     templateRole.email = 'oscar.shaw@yahoo.com';

//     // create a list of template roles and add our newly created role
//     const templateRolesList = [];
//     templateRolesList.push(templateRole);

//     // assign template role(s) to the envelope
//     envelope.templateRoles = templateRolesList;

//     // send the envelope by setting |status| to 'sent'. To save as a draft set to 'created'
//     envelope.status = 'sent';

//     // use the |accountId| we retrieved through the Login API to create the Envelope
//     // const accountId = accountId;

//     // instantiate a new EnvelopesApi object
//     const envelopesApi = new docusign.EnvelopesApi();

//     // call the createEnvelope() API
//     envelopesApi.createEnvelope(accountId, {
//       'envelopeDefinition': envelope,
//       'IntegratorKey': '802c3ffe-934c-43b7-9cdb-4c3e0656ff54',
//     }, (error, envelopeSummary, response) => {
//       if (error) {
//         callback(error, null);
//       }
//       else {
//         console.log('EnvelopeSummary: ' + JSON.stringify(envelopeSummary));
//         callback(null, JSON.stringify(envelopeSummary));
//       }
//     });
//   }
// }