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
function changeQuantity(cartId, proId, userId, count){
    let quantity = parseInt(document.getElementById(proId).innerHTML)
    count = parseInt(count)
    $.ajax({
      url:'/change_product_quantity',
      data:{
        user:userId,
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
        console.log(response)
        document.getElementById(proId).innerHTML = quantity+count
        document.getElementById('total').innerHTML = response.total
        //location.reload()
        }
      }
    })
  }
  $("#checkout_form").submit((e)=>{
    e.preventDefault()
        $.ajax({
            url:'/place_order',
            method:'post',
            data:$('#checkout_form').serialize(),
            success:(response)=>{
              if(response.status){
                location.href = '/order_sts'
              }
            }
        })
    })