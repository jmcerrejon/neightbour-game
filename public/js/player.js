const socket = io()

const player = {
	team: getUrlParam('team', 'Harkonen House'),
	room: getUrlParam('room', 'secondary')
}
let isReady = false

$(() => {
	document.title = 'Team: ' + player.team;

	socket.emit('new_player', player)

	socket.on('set_player', newPlayer => {
		player.id = socket.id
		$('#chat')
			.empty()
			.append(`<h3>Welcome ${newPlayer.team} to room ${newPlayer.room}!</h3>`)
	})
})

$('form').on('submit', event => {
	event.preventDefault()
	let msg = {
		name: player.team,
		content: $('#content').val().trim()
	}
	if (msg.content.length > 0) {
		socket.emit('new_msg', msg)
		$('#content').val('').focus()
	}
})

socket.on('spread_msg', msg => {
	setMessage(`<b>${special(msg.name)}</b> ${msg.content}`)
})

socket.on('change_button', isReadyFromServer => {
	isReady = isReadyFromServer
	setButtonColor('button', (isReadyFromServer) ? 'button-yellow' : 'button-gray')
})

socket.on('team_clicked', playerWhoAnswer => {
	setMessage(`<b>${playerWhoAnswer.team}</b> clicked the button!`)
	if (player.id === playerWhoAnswer.id) {
		setButtonColor('button', 'button-green')
	}
})

socket.on('check_answer', ({isValid, playerId}) => {
	console.log({isValid}, {playerId})
})

const special = str => {
	return (str.replace(/</gi, '&lt;')).replace(/>/gi, '&gt;')
}

$('#button').click(event => {
	if (isReady) {
		// TODO Counter
		socket.emit('button_pressed', player)
	}
})