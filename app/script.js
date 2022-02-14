const { ipcRenderer } = require('electron');

document.querySelector('#new-todo').addEventListener('submit', (event) => {
	event.preventDefault();

	const newTodo = {
		title: event.target.querySelector('#title').value,
		description: event.target.querySelector('#desc').value
	};

	ipcRenderer.send('new-todo', newTodo);
});

function deleteItem(item) {
	ipcRenderer.send('delete-todo', item);
}

ipcRenderer.on('new-data', (event, data) => {
	console.log('Data received: ');
	console.table(data);
	const container = document.querySelector('#todos');

	container.innerHTML = '';

	data.forEach((item) => {
		const card = document.createElement('div');
		card.className = 'card';

		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';
		card.appendChild(cardBody);

		const cardTitle = document.createElement('div');
		cardTitle.className = 'card-title';
		cardTitle.innerHTML = `<b>${item.title}</b>`;
		cardBody.appendChild(cardTitle);

		cardBody.innerHTML += `<p>${item.description}</p>`;

		const button = document.createElement('button');
		button.className = 'btn btn-danger';
		button.style = 'float: right;';
		button.innerText = 'Verwijderen';
		button.addEventListener('click', () => {
			deleteItem(item);
		});
		cardBody.appendChild(button);

		container.appendChild(card);
	});
});

ipcRenderer.send('get-data');
