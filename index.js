import fs from "fs";
import { Command } from "commander";

const tracker = new Command();

tracker
  .name("BudgetTracker")
  .description(
    "a Budget tracker app to which allows one to add item, update item, get item, get items and delete items",
  )
  .version("1.0.0");

// ADD ITEM
tracker
  .command("add")
  .description("add an item")
  .option("-t, --title <value>", "title of the budget item")
  .option("-q, --quantity <value>", "quantity of the item")
  .option("-p, --price <value>", "price of the item")
  .action(function (options) {
    const { title, quantity, price } = options;
    let items = [];
    if (fs.existsSync("./data/Items.json")) {
      const loadedItems = fs.readFileSync("./data/Items.json", "utf8");
      items = JSON.parse(loadedItems);
    } else {
      console.log("File not found, creating a new one.");
    }
    const itemExists = items.find((item) => item.title === title);
    if (itemExists) {
      console.log(`Item '${title}' already exists.`);
      return;
    }
    items.push({ title, quantity, price });
    fs.writeFileSync("./data/Items.json", JSON.stringify(items));
    console.log(`Item '${title}' added successfully.`);
  });

//delete item

tracker
  .command("delete")
  .description("delete an item")
  .option("-t, --title <value>", "title of the budget item")
  .action(function (options) {
    const title = options.title;
    const loadedItems = fs.readFileSync("./data/Items.json", "utf8");
    const items = JSON.parse(loadedItems);
    if (items.length === 0) {
      console.log("no item to delete");
      return;
    }
    const remainingItems = items.filter(
      (currentItem) => currentItem.title !== title,
    );
    if (remainingItems.length === items.length) {
      console.log(`item '${title}' does not exist`);
      return;
    }
    fs.writeFileSync("./data/Items.json", JSON.stringify(remainingItems));
    console.log(`item '${title}'deleted successfully`);
  });

//GET ITEMS

tracker
  .command("all")
  .description("gets all items")
  .option("-t, --title <value>", "title of the budget item")
  .action(function () {
    const loadedItems = fs.readFileSync("./data/Items.json", "utf8");
    const items = JSON.parse(loadedItems);

    if (items.length === 0) {
      console.log("you dont have any item");
      return;
    }

    items.forEach((currentItem) => {
      console.log(currentItem.title);
      console.log(currentItem.quantity);
      console.log(currentItem.price);
    });
  });

//GET ITEM

tracker
  .command("get")
  .description("gets a specific budget item by title")
  .option("-t, --title <value>", "title of the budget item")
  .action(function (options) {
    const loadedItems = fs.readFileSync("./data/Items.json", "utf8");
    const items = JSON.parse(loadedItems);

    if (items.length === 0) {
      console.log("You don't have any items.");
      return;
    }
    const foundItem = items.find((item) => item.title === options.title);
    if (!foundItem) {
      console.log(`Item with title "${options.title}" not found.`);
    } else {
      console.log(`Title: ${foundItem.title}`);
      console.log(`Quantity: ${foundItem.quantity}`);
      console.log(`Price: ${foundItem.price}`);
    }
  });

//UPDATE ITEM

tracker
  .command("update")
  .description("updates a specific budget item by title")
  .option("-t, --title <value>", "title of the budget item")
  .option("-q, --quantity <value>", "new quantity of the budget item")
  .option("-p, --price <value>", "new price of the budget item")
  .action(function (options) {
    const loadedItems = fs.readFileSync("./data/Items.json", "utf8");
    const items = JSON.parse(loadedItems);
    if (items.length === 0) {
      console.log("You don't have any items.");
      return;
    }
    const foundIndex = items.findIndex((item) => item.title === options.title);

    if (foundIndex === -1) {
      console.log(`Item with title "${options.title}" not found.`);
      return;
    }

    if (options.quantity) {
      items[foundIndex].quantity = options.quantity;
    }

    if (options.price) {
      items[foundIndex].price = options.price;
    }

    fs.writeFileSync("./data/Items.json", JSON.stringify(items, null, 2));

    console.log(`Item "${options.title}" has been updated.`);
  });

tracker.parse(process.argv);
