import { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, Notification, session, Tray } from "electron";
import path from 'path'
import fs from 'fs'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}
ipcMain.handle("dialog:openFile",async()=>{
  const {canceled,filePaths}=await dialog.showOpenDialog({
    properties:['openFile']
  });
  if(canceled){
    return null
  }
  else{
    return filePaths[0]
  }
})
let mainWindow:BrowserWindow|null=null;
let tray:Tray|null=null;
let isQuitting =false;
ipcMain.handle("readfile",async(_event,filePath)=>{
  try {
    const buffer=fs.readFileSync(filePath);
    return buffer;
  } catch (error) {
    console.log('failed to read the file',error);
    throw error;
  }
})
const createWindow = () => {
 mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
     icon: path.join(__dirname, "../assets/icon.png"),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
       contextIsolation: true, 
  nodeIntegration: false,
     webSecurity: false,
      
    },
  });
  mainWindow.on('close',(event)=>{
    if(!isQuitting){
      event.preventDefault();
      mainWindow.hide();
    }
  })


 
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      "Content-Security-Policy": [
        `default-src 'self' data:; 
         script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com;
         connect-src 'self' https://cewmylpshuskuoomkzox.supabase.co https://play.google.com https://content.googleapis.com;
         style-src 'self' 'unsafe-inline' https://www.gstatic.com;
         img-src 'self' data: https://cewmylpshuskuoomkzox.supabase.co https://ssl.gstatic.com;
         frame-src 'self' https://docs.google.com https://docs.googleusercontent.com https://view.officeapps.live.com https://drive.google.com https://content.googleapis.com;`
      ],
    },
  });
});




  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(
  ()=>{
    createWindow();

   if (tray) {
    tray.destroy();
    tray = null;
  }
const iconPath = 'src/imgs/tray.png';
        const icon = nativeImage.createFromPath(iconPath);
        tray = new Tray(icon);

  const contextMenu=Menu.buildFromTemplate([
    {
      label:'show',
      click:()=>{
        mainWindow?.show();
      },
    },{
     label:'quit',
     click:()=>{
      isQuitting=true;
      app.quit();
     }
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('kahnt');
  tray.on('click',()=>{
    if(mainWindow?.isVisible()){
      mainWindow?.hide();
    }
    else{
      mainWindow?.show();
    }
  })

    
}
);



app.on("window-all-closed", () => {

});
ipcMain.on("show-notification", (_, { title, body }) => {
  new Notification({ title, body }).show();
});
app.on("activate", () => {
 mainWindow?.show()
});
