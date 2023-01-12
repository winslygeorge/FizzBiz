const {google} = require('googleapis')

const CLIENTID = '495780731430-ohsteuvh7emdvsepbd5kal1f7pmg0obt.apps.googleusercontent.com'

const REFRESHTOKEN = '1//04ms2eRjUFi6-CgYIARAAGAQSNwF-L9IrmrlKAqZZW0WTKGVVj9EaI-SU6ZoBojPPlMt7FLLuOvB1D35ayxyhyfl0prCK6IMsTwE'

const REDIRECTURI = 'https://developers.google.com/oauthplayground'

const CLIENTSECRETE =   'WiL-xule_mfe-ePRwWpTZXsW'

const auth2client = new google.auth.OAuth2(CLIENTID, CLIENTSECRETE, REDIRECTURI)

auth2client.setCredentials({refresh_token: REFRESHTOKEN})
module.exports = {

 CLIENTID : CLIENTID,

 REFRESHTOKEN : REFRESHTOKEN,

 REDIRECTURI : REDIRECTURI,

 CLIENTSECRETE :  CLIENTSECRETE,

 auth2client : auth2client
}