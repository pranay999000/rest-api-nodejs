window.onload = function(){
	console.log('dom content loaded');

    getAllStatus()

    let status_array = []

    function getAllStatus() {
        fetch("/status").then(function(res){
            res.json().then(function(data){
                // console.log(data)
                status_array = []
                data.forEach(function(data) {
                    status_array.push(data)
                })

                initializeInViews()
            })
        })
    }

    function initializeInViews() {
        for (let i in status_array) {
            console.log(i + ' - ' + status_array[i]._id + ' - ' + status_array[i].status)
        

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
                // console.log(status_array._id + ' - ' + status_array.status);
                update_status(status_array[i]._id, status_array[i].status)
            })

            delete_button.addEventListener('click', function() {
                delete_status(status_array[i]._id)
            })

            name_html.innerHTML = status_array[i].name + ' : '
            status_html.innerHTML =  '<b>' + status_array[i].status + '</b><br />'
            update_button.innerHTML = 'Update this status'
            delete_button.innerHTML = 'Delete this status'
            line_break.innerHTML = '<br /><br />'

            document.getElementById('status-area').append(name_html)
            document.getElementById('status-area').append(status_html)
            document.getElementById('status-area').append(update_button)
            document.getElementById('status-area').append(delete_button)
            document.getElementById('status-area').append(line_break)
        }
    }

    function update_status(objectId, status) {
        let input = document.createElement('input');
        input.placeholder = status
        input.id = "updateInput"

        let update_button = document.createElement('button')
        update_button.innerText = "Update"
        update_button.addEventListener('click', function() {
            fetch('/status/update/' + objectId, { method: 'put', body: JSON.stringify({
                status: document.getElementById('updateInput').value
            }), headers: {
                'Content-Type': 'application/json'
            } })
        })
        document.getElementById('status-area').append(input)
        document.getElementById('status-area').append(update_button)
    }

    function delete_status(objectId) {
        fetch('/status/' + objectId, { method: 'delete' })
    }

}