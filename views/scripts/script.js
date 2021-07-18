window.onload = function(){
	console.log('dom content loaded');

	fetch("/status").then(function(res){
		res.json().then(function(data){
			console.log(data)

            data.forEach(function(task) {
                let name_html = document.createElement('li')
                let status_html = document.createElement('li')
                let delete_button = document.createElement('button')

                name_html.innerHTML = task.name
                status_html.innerHTML = task.status
                delete_button.innerHTML = 'delete this status, because it\'s emmbaressing'

                document.getElementById('status-area').append(name_html)
                document.getElementById('status-area').append(status_html)
                document.getElementById('status-area').append(delete_button)
                document.getElementById('status-area').append('')
            })

		})
	})

}