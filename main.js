const { app, BrowserWindow, ipcMain } = require('electron');
const Connection = require('./scripts/mongodb.js');

const createWindow = async () => {
	await Connection.run();

	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	ipcMain.on('get-data', async () => {
		console.log('Getting data...');

		await sendNewData();
	});

	ipcMain.on('new-todo', async (event, data) => {
		console.log('Inserting data...');
		console.table(data);

		await Connection.insert('todos', data);

		await sendNewData();
	});

	ipcMain.on('delete-todo', async (event, data) => {
		console.log('Deleting data...');
		console.table(data);

		await Connection.delete('todos', data);

		await sendNewData();
	});

	// For dev purposes only
	win.loadFile('app/index.html');
	win.webContents.openDevTools();

	async function sendNewData() {
		const data = await Connection.findAll('todos');

		win.webContents.send(
			'new-data',
			data.map((item) => ({ ...item, _id: item._id.toString() }))
		);
	}
};

app.whenReady().then(() => {
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
