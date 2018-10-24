let
    fs = require('fs'),
    uuid = require('uuid'),
    archiver = require('archiver');

class compression {
    /**
     * 压缩zip包
     * @param {json} params { files: [{content: "content", name: "filename.ext"}] }
     */
    static async zip(params) {
        return new Promise(async (resolve, reject) => {
            let zipName = `${uuid()}.zip`,
                zipPath = `${__dirname}/../tmp/${zipName}`,
                output = fs.createWriteStream(zipPath),
                archive = archiver('zip', { store: true });

            // fs.writeFile(zipPath, null, function (err) {
            //     if (err) {
            //         return console.log(err);
            //     }
            //     console.log("The file was saved!");
            // });
            // return;
            output.on('close', () => {
                console.log(archive.pointer() + ' total bytes');
                resolve(zipPath)
            });
            archive.on('error', (err) => reject(err));
            archive.pipe(output);
            params.files.forEach(file => archive.append(file.content, { name: file.name }))
            archive.finalize();
        })
    }
}

module.exports = compression