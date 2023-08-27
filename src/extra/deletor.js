const connection = require("../db/connection")

async function deletors() {
    d = new Date()
    const curr = d.toISOString().slice(0, 19).replace('T', ' ')

    QUERY = `SELECT * FROM verifytable`
    await connection.query(QUERY)
        .then(
            data =>{
                data[0].forEach(element => {
                    // console.log(element)
                    console.log(resultTime(element.time))
                    if ((resultTime(element.time))>9){
                        const delID = element.unqID;
                        async function s(delID) {
                            await deleteRow(delID)
                        }
                        s(delID)
                    }
                });
            }
        )
        .catch(error => console.log(error));
}

async function deleteRow(delID){
    QUERY2 = `DELETE FROM verifytable WHERE unqId='${delID}'`
    const cnn2 = await connection.query(QUERY2)
        .catch(error => error)
    console.log(cnn2)
}

function resultTime(time) {
    const res = new Date() - time
    min = Math.floor((res/1000/60) << 0)
    return min
}

setInterval(()=>{
    deletors()
}, 10000)
