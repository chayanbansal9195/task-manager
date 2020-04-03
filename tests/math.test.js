const {calculateTip,celciusToFahrenheit,fahrenheitToCelcius,add}=require("../src/math")

test("I am here",()=>{
const total=calculateTip(10,0.3)
expect(total).toBe(13)
})

test("f->c",()=>{
    const check=fahrenheitToCelcius(32)
    expect(check).toBe(0)

})
test("f->c",()=>{
    const check=celciusToFahrenheit(0)
    expect(check).toBe(32)

})

test("using done as a callback",(done)=>{
    add(1,2).then((sum)=>{
        expect(sum).toBe(3)
        done()
    })
})

test("using async and wait",async()=>{
const sum=await add(1,2)
expect(sum).toBe(3)
})

// test("this is who",()=>{
//     throw new Error("lol")
// })