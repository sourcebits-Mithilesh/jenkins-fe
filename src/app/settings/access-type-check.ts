export let accessType = {
    check(data) {
        return (data.user_type_id===2 && localStorage.getItem('user_id') && data.id!=localStorage.getItem('user_id')) ? 1:data.access_type
    }
 } 