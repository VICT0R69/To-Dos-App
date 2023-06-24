const resendBtn = document.getElementById('resend');
resendBtn.addEventListener('click', ()=>{
    console.log("working")
})

const allInput = document.querySelectorAll('.input');

allInput.forEach( (input, i) => {
    // console.log(input, i)
    input.addEventListener('input', (e)=>{
        let currentInput = e.target;
        let otpLength = currentInput.value.length;

        if (otpLength > 0 && i < allInput.length-1){
            allInput[i + 1].focus();
        }

        if (otpLength === 0 && i > 0){
            allInput[i - 1].focus();
        }
        
    })
})