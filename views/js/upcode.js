 document.querySelector('#save').addEventListener('click', () => {
    if (document.querySelector('#content').value == '') {
        document.querySelector('#content').style.border = '1px solid red';
        document.querySelector('#content').style.boxShadow = '0 0 5px red';
        document.querySelector('#content').style.color = 'red';
        document.querySelector('#content').placeholder = 'Content cannot be empty';
    } else {
        document.querySelector('#content').style.border = '1px solid #ccc';
        document.querySelector('#content').style.boxShadow = 'none';
        document.querySelector('#content').style.color = '#000';
        document.querySelector('#content').placeholder = 'Content';
        axios({
            method: 'POST',
            url: '/upcode',
            data: {
                code: document.querySelector('#content').value
            }
        }).then(async(res) => {
            if(res.data.status == true){
                new Toasteur("top-right", 4000).success('Tạo ghi chú thành công!', 'Success');
                const content = (await axios.get(`${res.data.url}`)).data;
                document.querySelector('#result').innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title text-center">${res.data.id}</h5>
                            <textarea class="form-control" id="code" rows="10" type="text/html" readonly>${content}</textarea>
                            <button class="btn btn-primary mt-2" id="remove">remove</button>
                            <a href="${res.data.url}" class="btn btn-primary mt-2" id="link">view</a>
                        </div>
                    </div>
                `;
                document.querySelector("#result").scrollIntoView();
                document.querySelector('#remove').addEventListener('click', () => {
                  axios({
            method: 'POST',
            url: '/delcode',
            data: {
              id: res.data.id
            }
        }).then(async(resss) => {
                 if(resss.data.status == true){
                    new Toasteur("top-right", 4000).success('Xoá ghi chú thành công!', 'Success');
                    document.querySelector('#result').innerHTML = "";
    document.querySelector('#content').value = '';
                 } else {
          new Toasteur("top-right", 4000).error('Error', 'Đã có lỗi xảy ra!'); 
                   
                 }
        }
                 /*   document.querySelector('#code').select();
                    document.execCommand('copy');
                    document.querySelector('#copy').innerHTML = 'Copied';
                    document.querySelector('#copy').style.backgroundColor = 'green';
                    document.querySelector('#copy').style.color = '#fff';
                    setTimeout(() => {
                        document.querySelector('#copy').innerHTML = 'Copy';
                        document.querySelector('#copy').style.backgroundColor = '#007bff';
                        document.querySelector('#copy').style.color = '#fff';
                    }*/
                    , 1000);
                });
            }
            else{
                new Toasteur("top-right", 4000).error('Error', 'Đã có lỗi xảy ra!');
            }
        }).catch((err) => {
            console.log(err);
        });
    }
});
document.querySelector('#clear').addEventListener('click', () => {
    document.querySelector('#content').value = '';
});