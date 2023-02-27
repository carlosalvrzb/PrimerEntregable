const socket = io()

const divProducts = document.getElementById('products')

socket.on('productos', data =>{
    divProducts.innerHTML = ''
    data.forEach(( product ) =>{
        const productList = document.createElement("ul")
        productList.innerHTML = `
        <li>${product.title}</li>
        <li>${product.description}</li>
        <li>Código del producto: ${product.code}</li>
        <li>Precio: ${product.price}</li>
        <li>Status: ${product.status}</li>
        <li>Categoria: ${product.category}</li>
        <li>ID del producto: ${product.id}</li>
    `
        divProducts.appendChild(productList)
    })
})