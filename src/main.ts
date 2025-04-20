import { app, BrowserWindow, Tray, nativeImage, Menu } from 'electron';
import * as path from 'path';

app.dock.hide();  // This will hide the dock icon completely

let tray: Tray | null = null;
let window: BrowserWindow | null = null;
let aboutWindow: BrowserWindow | null = null;
let contextMenu: Menu | null = null;  // Add this line to store the menu

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 308,    // 288px (calendar) + 24px (padding)
    height: 336,   // Current height
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    vibrancy: 'menu',
    visualEffectState: 'active',
    backgroundColor: '#00ff0000',
    hasShadow: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // Load the index.html file
  window.loadFile('index.html');
  
  // Hide the window when it loses focus
  window.on('blur', () => {
    window?.hide();
  });
}

function createAboutWindow() {
  if (aboutWindow) {
    aboutWindow.show();
    return;
  }

  aboutWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    title: 'About LilCal',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  aboutWindow.loadFile('about.html');

  aboutWindow.once('ready-to-show', () => {
    aboutWindow?.show();
  });

  aboutWindow.on('closed', () => {
    aboutWindow = null;
  });
}

function createTray() {
  if (tray) {
    return;
  }
  
  const iconPath = path.join(__dirname, '../assets/calendar-icon.template.png');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  tray = new Tray(icon);

  // Create menu template with proper types
  const menuTemplate = [
    {
      label: 'About LilCal',
      click: () => createAboutWindow()
    },
    {
      type: 'separator' as const
    },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ];

  // Create menu
  contextMenu = Menu.buildFromTemplate(menuTemplate);

  // Set up click handlers
  tray.on('click', handleClick);
  tray.on('right-click', handleRightClick);
}

function handleClick() {
  if (!window) return;
  
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
}

function handleRightClick() {
  if (!tray || !contextMenu) return;
  tray.popUpContextMenu(contextMenu);
}

function showWindow() {
  if (!window || !tray) return;
  
  // Get the bounds of tray icon
  const trayBounds = tray.getBounds();
  console.log('Tray bounds:', trayBounds);
  
  // Get the size of the window
  const windowBounds = window.getBounds();
  console.log('Window bounds:', windowBounds);
  
  // Center window horizontally under the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  
  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);
  
  console.log('Setting window position to:', { x, y });
  
  // Set the window position and show it
  window.setPosition(x, y, false);
  window.show();
  window.focus();
}

// Prevent multiple instances
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.whenReady().then(() => {
    createWindow();
    createTray();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
} 