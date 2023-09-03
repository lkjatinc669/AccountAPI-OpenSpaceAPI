const updateData = require("../models/updateData")
const verifier = require("../extra/verifier")
const generator = require("../extra/generators")

function getError(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "GET_NOT_ALLOWED", "DESC": "Insecure way of Sending Data", "DATA": null })
}

// Simplification, observation, application, curiosity

async function update_username(req, res){
    const data = filterFetchv1(req.query);

    if(!data[0]){
        res.json({
            "ERROR": data[0],
            "ERRCODE": data[1],
            "DESC": data[2],
            "DATA": null
        })
    } else {
        const yy = await updateData.updateusernameCracks(data[3][0], data[3][1], data[3][2], data[3][3]);
        if (yy[0] == false){
            res.json ({
                "ERROR": yy[0],
                "ERRCODE": yy[1],
                "DESC": yy[2],
                "DATA": null
            })
        } else {
            res.json ({
                "ERROR": false,
                "ERRCODE": "NO_ERROR",
                "DESC": null,
                "DATA": null
            })
        }
    }
}

function filterFetchv1(r){
    // id, newusername, token

    var isuserunqIdExist = false;
    var isTokenExist = false;
    var isnewUsernameExist = false;
    var isPasswordExists = false;

    ERRCODESTR = "PROVIDE";
    rStr = "Provide"

    if (r.userid){
        isuserunqIdExist = true;
    } else {
        ERRCODESTR += "_USERID"; rStr += " userid,"
    }

    if (r.token){
        isTokenExist = true;
    } else {
        ERRCODESTR += "_TOKEN"; rStr += " token"
    }

    if (r.newusername){
        isnewUsernameExist = true;
    } else {
        ERRCODESTR += "_NEWUSERNAME"; rStr += " newusername"
    }

    
    if(r.password) { isPasswordExists = true} else { rStr += " password"; ERRCODESTR += "_PASSWORD" }

    if (isuserunqIdExist && isTokenExist && isnewUsernameExist && isPasswordExists) {
        return [true, "NO_ERROR", null, [r.userid, r.token, r.password, r.newusername]]
    } else {
        return [false, ERRCODESTR, rStr, null];
    }
}

async function update_profilepic(req, res) {
    console.log(req.query)
    var data = filterFetchv2(req.body, req.files)
    if (!data[0]){
        res.json({
            "ERROR": true,
            "ERRCODE": data[1],
            "DESC": data[2],
            "DATA": null
        })
    } else {
        console.log(data[3])
        const yy = await profilePicMover(data[3][1])
        console.log(yy)
        if(!yy[0]){
            res.json({
                "ERROR": true,
                "ERRCODE": data[1],
                "DESC": data[2],
                "DATA": null
            })
        } else {
            const yyy = await updateData.updateProfile(data[3][1], yy[3][0])
            if (yyy == 1){
                res.json({
                    "ERROR": false,
                    "ERRCODE": "NO_ERROR",
                    "DESC": null,
                    "DATA": null
                })
            } else {
                res.json({
                    "ERROR": true,
                    "ERRCODE": "ERROR_IN_DATABASE_UPDATE",
                    "DESC": "Error in Database upload, The result will not reflect on the profile",
                    "DATA": null
                })
            }
        }
    }
}

function filterFetchv2(rq, rf) {
    var isuserunqIdExist = false;
    var isfileExist = false;

    ERRCODESTR  = "PROVIDE";
    rStr = "Provide"

    if (rq.userid){
        isuserunqIdExist = true;
    } else {
        ERRCODESTR += "_USERID"
        rStr += " Userid"
    }

    if (!rf || Object.keys(rf).length === 0) {
        ERRCODESTR += "_NEWPROFILEPIC";
        rStr += " New Profile Pic"
    } else {
        profilepic = rf.profilepic;
        extension = getExtension(profilepic.name)
        if (extension == "jpg" || extension == "png" || extension == "jpeg"){
            isfileExist = true;
        } else {
            ERRCODESTR += "_VALIDPROFILEPIC";
            rStr += " Valid Profile Pic"
        }
    }

    if (isfileExist && isuserunqIdExist){
        return [true, "NO_ERROR", null, [rq.userid, [rf.profilepic]]]
    } else {
        return [false, ERRCODESTR, rStr, null]
    }
}

async function profilePicMover(file){
    let uploadPath;

    extension = getExtension(file.name)

    fileGen = generator(10) + "." + extension
    var isFileGenExist = await updateData.checkProfileExists(fileGen)
    while (isFileGenExist) { fileGen = generator(10)+ "." + extension; isFileGenExist = await updateData.checkProfileExists(fileGen) }

    newfilename = fileGen + "." + extension;
    uploadPath = "D:\\Publicons\\"+ newfilename;
    profilepic.mv(uploadPath, function(err) {
        if (err)
        return [false, "ERROR_IN_UPLOADING", "Error in Moving Profile to the Server", null];
        return [true, "NO_ERROR", null, [newfilename]]
    });
}

function getExtension(filename){
    fileArray = filename.split(".");
    return fileArray[fileArray.length-1]
}

function notAllowed(req, res) {
    res.json({ "ERROR": true, "ERRCODE": "NO_PATH_EXIST", "DESC": "Invalid Path or Path not Exist", "DATA": null })
}

module.exports = { getError, update_username, update_profilepic, notAllowed }