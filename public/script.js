window.onload = function(){
	console.log('dom content loaded');

	fetch("/status").then(function(res){
		res.json().then(function(data){
			console.log(data)

            data.forEach(function(task) {
                let name_html = document.createElement('i')
                let status_html = document.createElement('i')
                let update_button = document.createElement('button')
                let delete_button = document.createElement('button')
                let line_break = document.createElement('i')

                name_html.setAttribute('class', 'nameText')
                status_html.setAttribute('class', 'statusText')
                update_button.setAttribute('class', 'updateButton')
                delete_button.setAttribute('class', 'deleteButton')

                update_button.addEventListener('click', function() {
                    update_status(task._id, task.status)
                })

                name_html.innerHTML = '<i>' + task.name + ' : </i>'
                status_html.innerHTML =  '<b>' + task.status + '</b><br />'
                update_button.innerHTML = 'Update this status'
                delete_button.innerHTML = 'Delete this status'
                line_break.innerHTML = '<br /><br />'

                document.getElementById('status-area').append(name_html)
                document.getElementById('status-area').append(status_html)
                document.getElementById('status-area').append(update_button)
                document.getElementById('status-area').append(delete_button)
                document.getElementById('status-area').append(line_break)
            })

		})
	})

    function update_status(objectId, status) {
        let input = document.createElement('input');
        input.placeholder = status
        input.id = "updateInput"

        let submit_button = document.createElement('button')
        submit_button.innerText = "Update"
        submit_button.addEventListener('click', function() {
            fetch('/status/update/' + objectId, { method: 'put', body: JSON.stringify({
                status: document.getElementById('updateInput').value
            }), headers: {
                'Content-Type': 'application/json'
            } })
        })
        document.getElementById('status-area').append(input)
        document.getElementById('status-area').append(submit_button)
    }

}