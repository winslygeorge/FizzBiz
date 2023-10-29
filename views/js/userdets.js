let imgElement = null
$(document).ready(()=>{

    imgElement = document.getElementById('addedImgIcon');

document.getElementById('iconImgcng').addEventListener('change', handleFileChange, false)
})

function handleFileChange(e){

    if(!e.target.files.length) return imgElement.src='';


    return imgElement.src= URL.createObjectURL(e.target.files.item(0));

}

function handleImageDoubleClick(id){

 
    document.getElementById('loader').style.display ="block"

        $.post('/post/like/user/image', {

        image_id : id

    }, (data, status)=>{


        if(data.code == 200){



            document.getElementById('like'+id).setAttribute('src', './../../images/like (1).svg')
            document.getElementById('likesCn').innerHTML =` ${data.count} likes` 
            document.getElementById('loader').style.display ="none"

         

        }else{
            alert(`Could like the image. Please try again later...`)
            document.getElementById('loader').style.display ="none"

        }
    })

    

}