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
  .option("-p, --price <value>", "the price of the item")
  .action(function (options) {
    const title = options.title;
    const quantity = options.quantity;
    const price = options.price;

    const newItem = {
      title: title,
      quantity: quantity,
      price: price,
    };

    let items = [];

    try {
      const loadedItems = fs.readFileSync("./Data/Items.json", "utf-8");

      if (loadedItems) {
        items = JSON.parse(loadedItems);
      }
    } catch (error) {
      console.log("File does not exist , create a new file.");
    }

    const itemExists = items.find((currentItem) => currentItem.title === title);

    if (itemExists) {
      console.log(`Item '${title}' already exists`);
      return;
    }

    items.push(newItem);
    fs.writeFileSync("./Data/Items.json", JSON.stringify(items));
    console.log(`Item '${title}' added successfully`);
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
    const foundItem = items.find(item => item.title === options.title);
    if (!foundItem) {
      console.log(`Item with title "${options.title}" not found.`);
    } else {
     
      console.log(`Title: ${foundItem.title}`);
      console.log(`Quantity: ${foundItem.quantity}`);
      console.log(`Price: ${foundItem.price}`);
    }
  });


tracker.parse(process.argv);
