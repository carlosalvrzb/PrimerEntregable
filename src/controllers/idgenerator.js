const idGenerator = ( array ) =>{
    const count = array.length
    if (count === 0){
        return 1
    } else {
        return (array[count-1].id) + 1     
    }
}

export default idGenerator