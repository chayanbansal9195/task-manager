const request = require("supertest");
const app = require("../src/indexTest");
const Task = require("../src/models/tasks");
const {
  userOne,
  userOneId,
  userTwoId,
  taskOne,
  taskTwo,
  setUpDatabase
} = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should create a new task", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Graham bell is here!!!"
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should fetch user tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test("Should not delete others users task", async () => {
  const response =await request(app).delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404);
    const task=await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
});
