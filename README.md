# End Points for https://accounts.openspaceapi.com/

### ENDPOINTS Table

| EndPoint  | Required Data | Return Data |  Used For |
| ------------- | ------------- | ------------- | ------------- |
| /login   | [type, data, token, password] | | Login into the Account |
| /signup  | [username, email, password]  | | Initial Signup |
| /forgot-password  |    |  | |
| /verify/generate  | [userid, mail] | | Generate The OTP |
| /verify/verifyotp  | [userid, token, otphash] | | Verify the OTP |
| /signup  |    |  |



# Error Codes for https://accounts.openspaceapi.com/

### Error Codes Table

| ERRCODE  | EndPoint | Reason |  Detail |
| ------------- | ------------- | ------------- | ------------- |
| GET_NOT_ALLOWED | All | Get Request | Make POST Request |
| INVALID_OTP | | |
| OTP_VERIFIED | | |
| OTP_PASS_VERIFICATION_ERROR | | |
| USERID_UNVERIFIED | | |
| | | |
