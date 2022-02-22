$(document).ready(function() {
    // send action
    $('#send').click(function() {
        let requestObj = createRequestObj()
        if (requestObj) {
            $.ajax({
                ...requestObj,
                dataType: 'JSON',
                success: function(result, status, xhr) {
                    if (status === 'success') {
                        $('#response-body').val(JSON.stringify(result, null, 4))
                    } else {
                        showToast('The request was unsuccessful!')
                    }
                },
                error: function(xhr, status, error) {
                    showToast('The request was unsuccessful!')
                },
                complete: function(xhr, status) {
                    let plaintext = xhr.getResponseHeader('content-type').split(";")[0].split("/")[1]
                    let statusCode = xhr.status
                    $('#plaintext').text(plaintext.toUpperCase())
                    $('#status').text(statusCode)
                }
            })
        }
    })

    // change type
    $('#type').change(function() {
        if ($(this).val() === 'GET') $('#request-body-container').hide()
        else $('#request-body-container').show()
    })

    // create object for request
    const createRequestObj = function() {
        // check if url has value
        let url = $('#url').val()
        if (!url) {
            showToast(`The request's url is not correct.`)
            return false
        }

        // check if type is correct
        let type = $('#type').val()
        if (!type) { 
            showToast(`The request's type is not correct.`)
            return false
        }

        // check if type is GET or POST
        if (type !== 'GET' && type !== 'POST') {
            showToast(`The request's type must be GET or POST.`)
            return false
        }

        let requestObj = {
            type,
            url
        }
        if (type === 'POST') {
            // check if data is correct
            let requestBody = $('#request-body').val()
            if (!hasJsonStructure(requestBody)) {
                showToast(`The request's body is not JSON.`)
                return false
            }
            requestObj['data'] = JSON.parse(requestBody)
        }

        return requestObj
    }

    // helpers
    const hasJsonStructure = function(string) {
        if (typeof string !== 'string') return false
        try {
            JSON.parse(string)
            return true
        } catch (error) {
            return false
        }
    }
    const showToast = function(message) {
        let toast = new bootstrap.Toast($('#toast'))
        $('#toast-message').text(message)
        toast.show()
    }
})