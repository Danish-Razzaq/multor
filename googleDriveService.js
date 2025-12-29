const fs = require('fs');
const { google } = require('googleapis');

/**
 * Browse the link below to see the complete object returned for folder/file creation and search
 *
 * @link https://developers.google.com/drive/api/v3/reference/files#resource
 */

class GoogleDriveService {
  constructor(clientId, clientSecret, redirectUri, refreshToken) {
    this.driveClient = this.createDriveClient(clientId, clientSecret, redirectUri, refreshToken);
  }

  createDriveClient(clientId, clientSecret, redirectUri, refreshToken) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    client.setCredentials({ refresh_token: refreshToken });

    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  createFolder(folderName, parentFolderId = null) {
    const requestBody = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };
    
    if (parentFolderId) {
      requestBody.parents = [parentFolderId];
    }

    return this.driveClient.files.create({
      requestBody: requestBody,
      fields: 'id, name',
    }).then((response) => response.data);
  }

  searchFolder(folderName, parentFolderId = null) {
    return new Promise((resolve, reject) => {
      const query = parentFolderId 
        ? `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentFolderId}' in parents`
        : `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`;
        
      this.driveClient.files.list(
        {
          q: query,
          fields: 'files(id, name)',
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res.data.files ? res.data.files[0] : null);
        },
      );
    });
  }

  saveFile(fileName, filePath, fileMimeType, folderId) {
    return this.driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
      fields: 'id, name, webViewLink, webContentLink'
    }).then((response) => response.data);
  }

  saveFileFromBuffer(fileName, fileBuffer, fileMimeType, folderId) {
    const { Readable } = require('stream');
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    return this.driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: stream,
      },
      fields: 'id, name, webViewLink, webContentLink'
    }).then((response) => response.data);
  }

  getFilesInFolder(folderId) {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: `'${folderId}' in parents and mimeType contains 'image/'`,
          fields: 'files(id, name, webViewLink, webContentLink, createdTime, size)',
          orderBy: 'createdTime desc'
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res.data.files || []);
        },
      );
    });
  }

  makeFilePublic(fileId) {
    return this.driveClient.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
  }
}

module.exports = GoogleDriveService;