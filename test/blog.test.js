const Page = require("./factories/page");

let page;
brforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});
afterEach(async () => {
  await page.close();
});

describe("click on the login with google", async () => {
  await page.click(".google btn a ");
  const url = await page.url();
  expect(url).toMatch(/\accounts\.google\.com/);
});

describe("when we logged in", async () => {
  beforeEach(async () => {
    await Page.login();
  });
  test("show the logout button", async () => {
    await this.page.waitFor('a[href="auth/logout"]');
    const test = await Page.getContentOf('a[href="auth/logout"]');

    expect(test).toEqual("logout");
  });
  test("show the list of users", async () => {
    const userItem = await Page.getContentOf(".li ");
    const numberOfPlaces = await Page.getContentOf(".li ");

    expect(userItem).length !== 0;
    expect(numberOfPlaces).toEqual("");
  });
  describe("when click create a blog", async () => {
    beforeEach(async () => {
      await Page.login();
      await page.click("a.btn-");
    });

    test("can see form", async () => {
      beforeEach(async () => {
        const titleLabel = await Page.getContentOf("form label.title ");
        const descriptionLabel = await Page.getContentOf(
          "form label.description "
        );

        expect(titleLabel).toEqual("title");
        expect(descriptionLabel).toEqual("description");
      });
    });

    describe("using valid inputs to create a blog", async () => {
      beforeEach(async () => {
        await page.type(".title input", "My Title");
        await page.type(".title description", "description");
        await page.click("form button");
      });
      test("submitting take user to places", async () => {
        await page.waitFor(".card");
        const placeTitle = await Page.getContentOf("li .card-title ");
        const placeDescription = await Page.getContentOf(
          "li .card-description "
        );
        expect(placeTitle).toEqual("My Title");
        expect(placeDescription).toEqual("description");
      });
    });
    test("using invalid inputs ", async () => {
      beforeEach(async () => {
        await page.click("form button");
      });
      const titleError = await Page.getContentOf(".title .red-text");
      const descriptionError = await Page.getContentOf("description .red-text");

      expect(titleError).toEqual("you must provide a value");
      expect(descriptionError).toEqual("you  must provide a value");
    });
  });
});

describe("when we are not  logged in", async () => {
  const actions = [
    // {
    //   method: "get",
    //   path: "/api/blogs",
    // },
    {
      method: "post",
      path: "/api/blogs",
      data: {
        title: "My title",
        description: "descriptiion",
      },
    },
  ];
  test("user cannot create blog post", async () => {
    const result = await Page.post("/api/createPlace", {
      title: "My title",
      description: "descriptiion",
    });

    expect(result).toEqual({ error: "you are not logged in" });
  });
  test("blog related actions are prohibited", async () => {
    const result = await Page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: "you are not logged in" });
    }
  });
});
