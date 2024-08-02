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
function changeQuantity(cartId, proId, count){
    let quantity = parseInt(document.getElementById(proId).innerHTML)
    count = parseInt(count)
    $.ajax({
      url:'/change_product_quantity',
      data:{
        cart:cartId,
        product:proId,
        count:count,
        quantity:quantity
      },
      method:'post',
      success:(response)=>{
       if(response.removeProduct){
        alert("product Removed")
        location.reload()
       }else{
        document.getElementById(proId).innerHTML = quantity+count
        location.reload()
        }
      }
    })
  }