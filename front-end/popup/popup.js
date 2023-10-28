const countP = () => {
    var pTags = document.querySelectorAll('p');
    return pTags.length;
}

document.addEventListener('DOMContentLoaded', function() {
    var count = counP();
    document.querySelector('#count').innerHTML = count;
})