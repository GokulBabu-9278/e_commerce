function addToCart(proId){
    $.ajax({
        url:'/add_tocart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count = $('#cart_count').html()
                count = parseInt(count)+1
                $("#cart_count").html(count)
            }
            location.reload()
        }
    })
}