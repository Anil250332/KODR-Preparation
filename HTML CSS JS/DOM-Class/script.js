// let bulb = document.querySelector('.bulb');
// let btn = document.querySelector('.btn');
// let flag = false;
// btn.addEventListener('click', () => {
//     console.log("clicked");
//    if(flag == false){
//     bulb.style.backgroundColor = "yellow";
//     btn.innerHTML = "Off";
//     flag = true;
//    } else {
//     bulb.style.backgroundColor = "transparent";
//     btn.innerHTML = "On";
//     flag = false;
//    }
// });





let img = document.querySelector('.img-1');
let btn = document.querySelector('.btn');
let flag = false;
btn.addEventListener('click', () => {
    if(flag == false){
        img.src = "https://images.unsplash.com/photo-1790632454757-7c0a5a0fc2ba?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        btn.innerHTML = "change";
        flag = true;
    } else {
        img.src = "https://plus.unsplash.com/premium_photo-1786868126588-39f864726bd9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        flag = false;
    }
})