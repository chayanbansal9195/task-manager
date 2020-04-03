const request = require("supertest");
const app = require("../src/indexTest");
const User = require("../src/models/users");
const {userOne,userOneId,setUpDatabase}=require("./fixtures/db")


beforeEach(setUpDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Chayan Bansal",
      email: "danielross915@gmail.com",
      password: "123asd!!"
    })
    .expect(201);

  // advance assertion check
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "Chayan Bansal",
      email: "danielross915@gmail.com"
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe("123asd!!");
});

test("Should login a existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).not.toBeNull();
  expect(response.body).toMatchObject({
    user: {
      name: userOne.name,
      email: userOne.email 
    },
    token: user.tokens[0].token
  });
});

test("Should not login a nonexisting user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "124lnssdlk"
    })
    .expect(400);
});

test("Should get profile of user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile of user unauthenticated", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});

test("Should delete profile of user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
    const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete profile of user", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});
test("Should upload an image of the user",async()=>{
        await request(app).post("/users/me/avatar")
        .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
        .attach("avatar","tests/fixtures/a.jpg")
        .expect(200)
        
    const user=await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})


test("Should update valid user field",async()=>{
    await request(app).patch("/users/me")
    
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:"jack"
    })
    .expect(200)
    
const user=await User.findById(userOneId)
expect(user.name).toEqual("jack")
})

test("Should not update invalid user field",async()=>{
    await request(app).patch("/users/me")
    
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send({
        location:"jack"
    })
    .expect(400)
})