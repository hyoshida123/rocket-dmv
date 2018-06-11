# Rocket DMV
Rocket DMV allows end users to apply for a DMV license from a mobile phone. We provide interface for DMV officers to receive, analyze and approve/reject applications. Once an application is reviewed, its status changes to either approved/rejected and we notify applicants by sending them a text message or email.

## API endpoints
baseurl: https://oshaw-dmv.herokuapp.com/
api?endpoint=[name_of_endpoint]
endpoints 

ex) https://oshaw-dmv.herokuapp.com/api?endpoint=[name_of_endpoint]

```
1. approveSignedDocument:
  method: PUT
  Marks document as approved in Firebase
  Call this in operator's front end when operator presses approve
  Front end passes document id
  
2. getDriverSignedDocuments:
  method: GET
  Gets all driver signed documents
  Call this on a regular interval to update operator's front end documents list
  
3. getOperatorSignedDocuments:
  method: GET
  Gets all operator signed documents belonging to a user
  Call this on iOS on a regular interval to update driver's app
  Pass in first name and last name so only documents linked to user return
  
4. submitUserData:
  method: GET
  Saves user data to Firebase and sends Docusign signature request email
  Call on iOS
  Pass in firstName, lastName, zipCode

```
