const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

// Array of folder IDs
const folderIds = [
  '1y8bnKjngGHhNknAfSL3151nNYrHUGFWv',
  '1ZU7eybx8O0QzVMPKysqIxsC5h5Vx7z7j',
  '1MehLgwyS0Xc44PqhnIc6mBIpYToMyzW_',
  '1y8r76DMsZypV0-AuCPNf_GOyRRAfKMWs',
  // Add more folder IDs as needed
];

// API base URL
const apiUrl = 'https://gdapi.viatg.workers.dev/listFilesInFolder.aspx?folderId=';

// Function to fetch videos from the API and save them in the database
async function fetchAndSaveVideos() {
    try {
      const videosToCreate = [];
  
      // Iterate over each folder ID
      for (let i = 0; i < folderIds.length; i++) {
        const folderId = folderIds[i];
  
        // Construct the URL for the current folder
        const url = `${apiUrl}${folderId}`;
  
        // Make an HTTP GET request to fetch the list of files from the folder
        const response = await axios.get(url);
  
        // Extract the files array from the response data
        const files = response.data.files;
  
        // Iterate over each file
        for (const file of files) {
          // Check if the file is a video (you may need to adjust this check based on your file naming convention or other criteria)
          if (file.mimeType.startsWith('video/')) {
            // Collect data for video creation
            videosToCreate.push({
              id: file.id, // Assuming 'id' contains the video URL
              name: file.name, // Optionally, save other details like the name of the video
              folderId: folderId, // Save the current folder ID associated with the video
            });
          }
        }

        console.log(`Folder ${i + 1}/${folderIds.length} processed`);
      }
  
      // Save all videos in the database
      await database.video.createMany({
        data: videosToCreate,
      });
  
      console.log('Videos saved successfully!');
    } catch (error) {
      console.error('Error fetching and saving videos:', error);
    } finally {
      // Disconnect Prisma client
      await database.$disconnect();
    }
  }
// Call the function to fetch and save videos
fetchAndSaveVideos();