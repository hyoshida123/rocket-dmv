const docusign = require('docusign-esign');
const apiClient = new docusign.ApiClient();

const accessToken = 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQgAAAABAAUABwCA1OYSoM7VSAgAgBQKIePO1UgCAKIhy8IofvRBpmDvnvIXrUsVAAEAAAAYAAEAAAAKAAAADQAkAAAAYWUzMGVhNGUtMzk1OS00ZDFjLWI4NjctZmNiNTdkMmRjNGRmMACAkd_an87VSA.RpN-OQN6uRsOGzBVtXfLR_915vPdlACx7IeacjyajLf8bG2ieLh0GJdK9dKUMJ9iiQ-_8f_Ey0ibVoOSYdv4sbrracvEmomOfIDAfXTZriCViUp-Ud62bet_olA69Y57pZpKqIv-i878GEaJ6odIzWDeEf5SXPj0If1xqsBRF9dJCWqCVOKVPGIJPcOP1scZjHsB0K_syhvjw0OV3P_Sh9qTIF3hK0j_wL9VpMDZDvCH2_lxbVrqJz4DyvZcnRO3pcPz5_RyUy9YBz2Erp1M7vCWIrxLA-K3MPmusnadMJymzQT8da_-jnvYTEr16ZRT0UERCdTlRIUnqtZSmsLpoA';
const accountId = '"e32318d9-7c98-4adb-bf32-746edc3317a8"';
apiClient.setBasePath('https://demo.docusign.net/restapi');

module.exports = {
  sendEmailSignatureRequest: (callback) => {
    // create a new envelope object that we will manage the signature request through
    const envelope = new docusign.EnvelopeDefinition();
    envelope.emailSubject = 'Please sign this document sent from Node SDK';
    envelope.templateId = '32a7dd00-5df7-431d-98f9-6269c7b4d9a7';

    // create a template role with a valid templateId and roleName and assign signer info
    const templateRole = new docusign.TemplateRole();
    templateRole.roleName = 'Applicant';
    templateRole.name = 'Oscar Shaw';
    templateRole.email = 'oscar.shaw@yahoo.com';

    // create a list of template roles and add our newly created role
    const templateRolesList = [];
    templateRolesList.push(templateRole);

    // assign template role(s) to the envelope
    envelope.templateRoles = templateRolesList;

    // send the envelope by setting |status| to 'sent'. To save as a draft set to 'created'
    envelope.status = 'sent';

    // use the |accountId| we retrieved through the Login API to create the Envelope
    // const accountId = accountId;

    // instantiate a new EnvelopesApi object
    const envelopesApi = new docusign.EnvelopesApi();

    // call the createEnvelope() API
    envelopesApi.createEnvelope(accountId, {'envelopeDefinition': envelope}, function (error, envelopeSummary, response) {
      if (error) {
        callback(error, null);
      }
      else {
        console.log('EnvelopeSummary: ' + JSON.stringify(envelopeSummary));
        callback(null, JSON.stringify(envelopeSummary));
      }
    });
  }
}